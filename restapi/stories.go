package restapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
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

const youtubeRegex = `(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})`
const youtubeEmbedURL = "https://www.youtube.com/embed/"

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
	TaggedStory := TaggedStory{story, names}
	return TaggedStory
}

func (api api) ReturnAllStories(w http.ResponseWriter, r *http.Request) render.Renderer {
	var stories []models.Story

	err := api.database.Preload("Author").Where("is_visible = true").Find(&stories).Error
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

	file, h, err := r.FormFile("image")

	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error getting the image.", err)
	}
	imageURL, err := api.uploadImageTos3(file, h.Size, h.Filename)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error uploading the image to s3.", err)
	}
	defer file.Close()

	var author models.Author
	author.FirstName = r.FormValue("author_first_name")
	author.LastName = r.FormValue("author_last_name")
	author.OriginCountry = r.FormValue("author_country")

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
	author.Bio = r.FormValue("bio")
	api.database.Save(&author)
	story.Author = author
	story.AuthorFirstName = r.FormValue("author_first_name")
	story.AuthorLastName = r.FormValue("author_last_name")
	story.AuthorCountry = r.FormValue("author_country")
	story.ImageURL = imageURL
	story.Title = r.FormValue("title")
	story.Content = r.FormValue("content")
	story.CurrentCity = r.FormValue("current_city")
	year, err := strconv.ParseUint(r.FormValue("year"), 10, 64)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error parsing year field", err)
	}
	story.Year = uint(year)
	story.Summary = r.FormValue("summary")
	city := story.CurrentCity
	coordinates, err := api.locationFinder.GetCityCenter(city)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Story has an invalid current city", err)
	}
	story.Latitude = randomCoords(coordinates.Latitude)
	story.Longitude = randomCoords(coordinates.Longitude)

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

	api.database.Where("story_id=?", story.ID).Delete(models.Tag{}) // delete existing tags

	names := r.Form["tags"]
	if len(names) != 0 {
		err = api.AddTags(names, story)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "Error Adding Tags", err)
		}
	}

	return rest.MsgStatusOK("Story Updated successfully")
}

func (api api) CreateStories(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Story struct.
	var stories []models.Story
	// respond to the client with the error message and a 400 status code.
	if err := json.NewDecoder(r.Body).Decode(&stories); err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid payload", err)
	}

	for i := 0; i < len(stories); i++ {
		city := stories[i].CurrentCity
		coordinates, err := api.locationFinder.GetCityCenter(city)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d has an invalid current city", i), err)
		}
		stories[i].Latitude = randomCoords(coordinates.Latitude)
		stories[i].Longitude = randomCoords(coordinates.Longitude)
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

	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Body:          fileBytes,
		Bucket:        bucket,
		Key:           aws.String(name),
		ContentLength: aws.Int64(size),
		ContentType:   aws.String(fileType),
	})
	if err != nil {
		return "", fmt.Errorf("Could not upload to S3")
	}
	return fmt.Sprintf("https://%s.s3.us-west-000.backblazeb2.com/%s", os.Getenv("BUCKET_NAME"), name), nil
}

func convertYoutubeURL(originalURL string) (string, error) {
	re := regexp.MustCompile(youtubeRegex)
	match := re.FindAllStringSubmatch(originalURL, 2)
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
	defer file.Close()
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

	story.ImageURL = imageURL
	story.Title = r.FormValue("title")
	story.Content = r.FormValue("content")
	story.CurrentCity = r.FormValue("current_city")
	year, err := strconv.ParseUint(r.FormValue("year"), 10, 64)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error parsing year field", err)
	}
	story.Year = uint(year)
	story.Summary = r.FormValue("summary")
	city := story.CurrentCity
	coordinates, err := api.locationFinder.GetCityCenter(city)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Story has an invalid current city", err)
	}
	story.Latitude = randomCoords(coordinates.Latitude)
	story.Longitude = randomCoords(coordinates.Longitude)

	videoURL := r.FormValue("video_url")
	if videoURL != "" {
		convertedURL, err := convertYoutubeURL(videoURL)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, "Invalid Youtube Link", err)
		}
		story.VideoURL = convertedURL
	}

	story.AuthorFirstName = r.FormValue("author_first_name")
	story.AuthorLastName = r.FormValue("author_last_name")
	story.AuthorCountry = r.FormValue("author_country")

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

func randomCoords(coordinate float64) float64 {
	num := math.Floor(rand.Float64()*99) + 1
	if math.Round(rand.Float64()) == 1 {
		num *= 1
	}

	return coordinate + 0.003*num
}
