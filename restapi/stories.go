package restapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math/rand"
	"mime/multipart"
	"net/http"
	"os"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/biter777/countries"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"gorm.io/gorm"
)

var youtubeRegex = regexp.MustCompile(`(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})`)
var youtubeEmbedURL = regexp.MustCompile("https://www.youtube.com/embed/")

var s3KeyNameRegex = regexp.MustCompile(`^https:\/\/shoeproject.s3.us-west-000.backblazeb2.com\/(.*)\?versionId`)
var s3KeyNameRegexAlternate = regexp.MustCompile(`^https:\/\/shoeproject.s3.us-west-000.backblazeb2.com\/(.*)`)
var s3VersionIdRegex = regexp.MustCompile(`\?versionId=(.*)`)

func init() {
	rand.Seed(time.Now().UTC().UnixNano())
}

type TaggedStory struct {
	models.Story
	Tags []string `json:"tags"`
}

func (api api) ReturnTaggedStories(stories []models.Story) []TaggedStory {
	TaggedStories := make([]TaggedStory, len(stories))
	for i, story := range stories {
		TaggedStories[i] = api.ReturnTaggedStory(story)
	}
	return TaggedStories
}

func (api api) ReturnTaggedStory(story models.Story) TaggedStory {
	var tags []models.Tag
	err := api.database.Where("story_id=?", story.ID).Find(&tags).Error
	if err != nil {
		return TaggedStory{story, []string{}} //Test for this case
	}
	names := make([]string, len(tags))
	for i, t := range tags {
		names[i] = t.Name
	}
	return TaggedStory{story, names}
}

func (api api) AddAuthorToStories(stories []models.Story) ([]models.Story, error) {
	for i, story := range stories {
		var author = models.Author{
			FirstName:     story.AuthorFirstName,
			LastName:      story.AuthorLastName,
			OriginCountry: story.AuthorCountry,
		}
		err := api.database.First(&author).Error
		if err != nil {
			return stories, err
		}
		stories[i].Author = author
	}
	return stories, nil
}

func (api api) ReturnAllStories(w http.ResponseWriter, r *http.Request) render.Renderer {
	var stories []models.Story
	var storiesByTags []models.Tag

	getVisibility := r.URL.Query()["visibility"]
	visibility := true
	if getVisibility != nil {
		vb, err := strconv.ParseBool(getVisibility[0])
		if err != nil {
			return rest.ErrInternal(api.logger, err)
		}
		visibility = vb
	}
	err := r.ParseForm()
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}
	sort := r.Form["sort"]
	order := r.Form["order"]
	tags := r.Form["tags"]

	sortString := ""
	for i := 0; i < len(sort); i++ {
		//special case for author name because our db table doesnt have "name" in one column
		if sort[i] == "author_name" {
			sortString += "author_first_name" + " " + order[i] + ", " + "author_last_name" + " " + order[i]
		} else {
			sortString += sort[i] + " " + order[i]
		}

		if i != len(sort)-1 {
			sortString += ", "
		}
	}
	
	gormStories := api.database.Table("stories")
	gormTags := api.database.Table("tags")
	
	err = gormTags.Where("name IN ?", tags).Find(&storiesByTags).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	if len(storiesByTags) != 0 {

		storyIDs := make([]string, len(storiesByTags))
		for i := 0; i < len(storiesByTags); i++ {
			storyIDs[i] = strconv.FormatUint(uint64(storiesByTags[i].StoryID), 10)
		}
		gormStories = gormStories.Where("id IN ?", storyIDs)
	}

	if len(sortString) != 0 {
		gormStories = gormStories.Order(sortString)
	}

	err = gormStories.Where("is_visible = ?", visibility).Find(&stories).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	stories, err = api.AddAuthorToStories(stories)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(api.ReturnTaggedStories(stories))
}

func (api api) ReturnStoryByID(w http.ResponseWriter, r *http.Request) render.Renderer {
	var story models.Story
	id := chi.URLParam(r, "storyID")

	err := api.database.Preload("Author").Where("id=?", id).First(&story).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound(fmt.Sprintf("Could not find story with ID %s", id))
		}
		return rest.ErrInternal(api.logger, err)
	}
	return rest.JSONStatusOK(api.ReturnTaggedStory(story))
}

func (api api) EditStoryByID(w http.ResponseWriter, r *http.Request) render.Renderer {
	var story models.Story
	id := chi.URLParam(r, "storyID")

	err := api.database.Preload("Author").Where("id=?", id).First(&story).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound(fmt.Sprintf("Could not find story with ID %s", id))
		}
		return rest.ErrInternal(api.logger, err)
	}

	imageURL := story.ImageURL

	file, h, err := r.FormFile("image")

	if err == nil { // If new image is passed in
		imageKey, err := convertImageURLToKeyName(story.ImageURL)

		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "ImageUrl of existing image is not valid", err)
		}

		versionId, err := convertImageURLToVersionId(story.ImageURL)

		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "VersionID of existing image is not valid", err)
		}
		msg, err := api.DeleteImageInS3(imageKey, versionId) //delete existing image
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, msg, err)
		}
		imageURL, err = api.uploadImageTos3(file, h.Size, h.Filename)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "Error uploading the image to s3.", err)
		}
	}

	var author models.Author
	author.FirstName = r.FormValue("author_first_name")
	author.LastName = r.FormValue("author_last_name")
	author.OriginCountry = r.FormValue("author_country")

	errAuthor := api.database.First(&author).Error // Checking if author exists or not. If it does not, a new author would be created
	if errAuthor != nil {
		if errAuthor == gorm.ErrRecordNotFound {
			country := countries.ByName(author.OriginCountry)
			if country == countries.Unknown {
				return rest.ErrInvalidRequest(api.logger, "Unknown origin country", nil)
			}
			if err := api.database.Create(&author).Error; err != nil { // This is where a new author is added if it did not already exist
				return rest.ErrInternal(api.logger, errAuthor)
			}
		} else {
			return rest.ErrInternal(api.logger, errAuthor)
		}
	}
	if r.FormValue("bio") != "" {
		author.Bio = r.FormValue("bio")
	}
	api.database.Save(&author) // Saving author to reflect bio changes
	year, err := strconv.ParseUint(r.FormValue("year"), 10, 64)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error parsing year field", err)
	}
	city := strings.Title(strings.ToLower(r.FormValue("current_city")))
	// get number of stories with current city in db
	var prevStories []models.Story
	var numStoriesInCity int64
	api.database.Where("current_city=?", city).Model(&prevStories).Count(&numStoriesInCity)
	Latitude, Longitude, err := api.locationFinder.GetPostalLatitudeAndLongitude(city, numStoriesInCity)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Story has an invalid current city", err)
	}

	story.Author = author
	story.AuthorFirstName = r.FormValue("author_first_name")
	story.AuthorLastName = r.FormValue("author_last_name")
	story.AuthorCountry = r.FormValue("author_country")
	story.ImageURL = imageURL
	story.Title = r.FormValue("title")
	story.Content = r.FormValue("content")
	story.CurrentCity = city
	story.Year = uint(year)
	story.Summary = r.FormValue("summary")
	story.Latitude = Latitude
	story.Longitude = Longitude

	videoURL := r.FormValue("video_url")
	if videoURL != "" {
		convertedURL, err := convertYoutubeURL(videoURL)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "Invalid Youtube Link", err)
		}
		story.VideoURL = convertedURL
	}

	if err := api.database.Save(&story).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	if err := api.database.Where("story_id=?", story.ID).Delete(models.Tag{}).Error; err != nil { // delete existing tags
		return rest.ErrInternal(api.logger, err)
	}

	names := r.Form["tags"]
	if len(names) != 0 {
		err = api.AddTags(names, story)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "Error Adding Tags", err)
		}
	}

	return rest.MsgStatusOK("Story Updated successfully")
}

func (api api) DeleteStoryByID(w http.ResponseWriter, r *http.Request) render.Renderer {
	var story models.Story
	id := chi.URLParam(r, "storyID")

	err := api.database.Where("id=?", id).First(&story).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound(fmt.Sprintf("Could not find story with ID %s", id))
		}
		return rest.ErrInternal(api.logger, err)
	}

	imageKey, err := convertImageURLToKeyName(story.ImageURL)

	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "ImageUrl of existing image is not valid. ImageKey could not be found", err)
	}

	versionId, err := convertImageURLToVersionId(story.ImageURL)

	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "ImageUrl of existing image is not valid", err)
	}
	msg, err := api.DeleteImageInS3(imageKey, versionId) //delete existing image
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, msg, err)
	}

	var author = models.Author{
		FirstName:     story.AuthorFirstName,
		LastName:      story.AuthorLastName,
		OriginCountry: story.AuthorCountry,
	}
	err = api.database.First(&author).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}
	story.Author = author

	var stories []models.Story
	var numStories int64
	err = api.database.Where("author_first_name=?", story.AuthorFirstName).Where("author_last_name=?", story.AuthorLastName).Where("author_country=?", story.AuthorCountry).Find(&stories).Count(&numStories).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	if err := api.database.Where("story_id=?", id).Unscoped().Delete(models.Tag{}).Error; err != nil { // delete existing tags
		return rest.ErrInternal(api.logger, err)
	}

	if err := api.database.Unscoped().Delete(story).Error; err != nil { // delete existing story
		return rest.ErrInternal(api.logger, err)
	}

	if numStories == 1 { // This would mean the author has only 1 story which is being deleted, so author needs to be deleted as well
		if err := api.database.Unscoped().Delete(author).Error; err != nil { // delete existing author
			return rest.ErrInternal(api.logger, err)
		}
	}

	return rest.MsgStatusOK("Story Deleted Successfully")
}

func (api api) CreateStories(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Story struct.
	var stories []models.Story
	cityToCount := make(map[string]int64)
	// respond to the client with the error message and a 400 status code.
	if err := json.NewDecoder(r.Body).Decode(&stories); err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid payload", err)
	}

	for i := 0; i < len(stories); i++ {
		stories[i].CurrentCity = strings.Title(strings.ToLower(stories[i].CurrentCity))
		city := stories[i].CurrentCity

		// get number of stories with current city in db
		var prevStories []models.Story
		var numStoriesInCity int64
		var err error
		if cityToCount[city] == 0 {
			api.database.Where("current_city=?", stories[i].CurrentCity).Model(&prevStories).Count(&numStoriesInCity)
			cityToCount[city] = numStoriesInCity + 1
		} else {
			cityToCount[city] = cityToCount[city] + 1
			numStoriesInCity = cityToCount[city]
		}

		stories[i].Latitude, stories[i].Longitude, err = api.locationFinder.GetPostalLatitudeAndLongitude(stories[i].CurrentCity, numStoriesInCity)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d has an invalid current city", i), err)
		}
	}

	if err := api.database.Create(&stories).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.MsgStatusOK("Stories added successfully")
}

func (api api) uploadImageTos3(file multipart.File, size int64, name string) (string, error) {
	newSession, err := session.NewSession(api.s3config)
	if err != nil {
		return "", fmt.Errorf("Could not connect with S3")
	}

	buffer := make([]byte, size) // read file content to buffer

	_, err = file.Read(buffer)
	if err != nil {
		return "", fmt.Errorf("Could not read file")
	}
	s3Client := s3.New(newSession)
	fileBytes := bytes.NewReader(buffer)
	fileType := http.DetectContentType(buffer)
	bucket := aws.String(os.Getenv("BUCKET_NAME"))

	res, err := s3Client.PutObject(&s3.PutObjectInput{
		Body:          fileBytes,
		Bucket:        bucket,
		Key:           aws.String(name),
		ContentLength: aws.Int64(size),
		ContentType:   aws.String(fileType),
	})
	if err != nil {
		return "", fmt.Errorf("Could not upload to S3")
	}
	return fmt.Sprintf("https://%s.s3.us-west-000.backblazeb2.com/%s?versionId=%s", os.Getenv("BUCKET_NAME"), name, *res.VersionId), nil
}

func (api api) DeleteImageInS3(name string, versionId string) (string, error) {

	newSession, err := session.NewSession(api.s3config)
	if err != nil {
		return "", fmt.Errorf("Could not connect with S3")
	}

	s3Client := s3.New(newSession)
	bucket := aws.String(os.Getenv("BUCKET_NAME"))

	_, err = s3Client.DeleteObject(&s3.DeleteObjectInput{
		Bucket:    bucket,
		Key:       aws.String(name),
		VersionId: aws.String(versionId),
	})
	if err != nil {
		return "", fmt.Errorf("Could not delete image in S3")
	}
	return "Image Successfully Deleted", nil
}

func convertImageURLToKeyName(originalURL string) (string, error) {
	match := s3KeyNameRegex.FindAllStringSubmatch(originalURL, 2) // This is for the URLs that have versionID
	if len(match) == 0 {
		match = s3KeyNameRegexAlternate.FindAllStringSubmatch(originalURL, 2) // This is for the image URl that are valid but dont have versionID. E.g. the current seeded stories image url dont have version id
		if len(match) == 0 {
			return "", fmt.Errorf("Invalid Image Link - Image Key not found")
		}
	}
	return match[0][1], nil
}

func convertImageURLToVersionId(originalURL string) (string, error) {
	match := s3KeyNameRegex.FindAllStringSubmatch(originalURL, 2) // This checks if url has the versionId or not
	if len(match) == 0 {
		return "", nil
	}
	match = s3VersionIdRegex.FindAllStringSubmatch(originalURL, 2)
	if len(match) == 0 {
		return "", fmt.Errorf("Invalid Image Link - VersionID not found")
	}
	return match[0][1], nil
}

func convertYoutubeURL(originalURL string) (string, error) {
	match := youtubeRegex.FindAllStringSubmatch(originalURL, 2)
	if len(match) == 0 {
		return "", fmt.Errorf("Invalid Youtube Link")
	}
	return fmt.Sprintf("%s%s", youtubeEmbedURL, match[0][1]), nil
}

func (api api) CreateStoriesFormData(w http.ResponseWriter, r *http.Request) render.Renderer {
	file, h, err := r.FormFile("image")

	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error getting the image.", err)
	}
	imageURL, err := api.uploadImageTos3(file, h.Size, h.Filename)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error uploading the image to s3.", err)
	}
	var story models.Story
	var author models.Author
	author.FirstName = r.FormValue("author_first_name")
	author.LastName = r.FormValue("author_last_name")
	author.OriginCountry = r.FormValue("author_country")
	author.Bio = r.FormValue("bio")

	errAuthor := api.database.First(&author).Error
	if errAuthor != nil {
		if errAuthor == gorm.ErrRecordNotFound {
			country := countries.ByName(author.OriginCountry)
			if country == countries.Unknown {
				return rest.ErrInvalidRequest(api.logger, "Unknown origin country", nil)
			}
			if err := api.database.Create(&author).Error; err != nil { //Adding author
				return rest.ErrInternal(api.logger, errAuthor)
			}
		} else {
			return rest.ErrInternal(api.logger, errAuthor)
		}
	}

	year, err := strconv.ParseUint(r.FormValue("year"), 10, 64)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error parsing year field", err)
	}
	city := strings.Title(strings.ToLower(r.FormValue("current_city")))
	// get number of stories with current city in db
	var prevStories []models.Story
	var numStoriesInCity int64
	api.database.Where("current_city=?", city).Model(&prevStories).Count(&numStoriesInCity)
	Latitude, Longitude, err := api.locationFinder.GetPostalLatitudeAndLongitude(city, numStoriesInCity)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Story has an invalid current city", err)
	}
	story = models.Story{
		Author:          author,
		AuthorFirstName: r.FormValue("author_first_name"),
		AuthorLastName:  r.FormValue("author_last_name"),
		AuthorCountry:   r.FormValue("author_country"),
		ImageURL:        imageURL,
		Title:           r.FormValue("title"),
		Content:         r.FormValue("content"),
		CurrentCity:     city,
		Year:            uint(year),
		Summary:         r.FormValue("summary"),
		Latitude:        Latitude,
		Longitude:       Longitude,
	}

	videoURL := r.FormValue("video_url")
	if videoURL != "" {
		convertedURL, err := convertYoutubeURL(videoURL)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "Invalid Youtube Link", err)
		}
		story.VideoURL = convertedURL
	}

	if err := api.database.Create(&story).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}
	names := r.Form["tags"]
	if len(names) != 0 {
		err = api.AddTags(names, story)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "Error Adding Tags", err)
		}
	}
	return rest.MsgStatusOK("Story Added Successfully")
}

func (api api) AddTags(names []string, story models.Story) error {
	tags := make([]models.Tag, len(names))
	for i, t := range names {
		tags[i] = models.Tag{
			Name:    strings.ToUpper(t),
			StoryID: story.ID,
		}
	}
	return api.database.Create(&tags).Error
}

func (api api) ReturnStoriesByCountries(w http.ResponseWriter, r *http.Request) render.Renderer {
	countriesString := chi.URLParam(r, "countries")
	countries := strings.Split(countriesString, ",")

	var stories []models.Story

	err := api.database.Where("author_country IN ?", countries).Find(&stories).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(stories)
}
