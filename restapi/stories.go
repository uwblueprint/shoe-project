package restapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"gorm.io/gorm"
)

func init() {
	rand.Seed(time.Now().UTC().UnixNano())
}

func (api api) ReturnAllStories(w http.ResponseWriter, r *http.Request) render.Renderer {
	var stories []models.Story

	err := api.database.Find(&stories).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(stories)
}

func (api api) ReturnStoryByID(w http.ResponseWriter, r *http.Request) render.Renderer {
	var story models.Story
	id := chi.URLParam(r, "storyID")

	err := api.database.Where("id=?", id).First(&story).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound(fmt.Sprintf("Could not find story with ID %s", id))
		}
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(story)
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

func (api api) CreateStoriesFormData(w http.ResponseWriter, r *http.Request) render.Renderer {

	awsAccessKeyID := "000ee7a351df6cc0000000002"
	awsSecretAccessKey := "K000h8DEx6wCtLUuGkhpBtsqsZoiQcw"
	s3Config := &aws.Config{
		Credentials:      credentials.NewStaticCredentials(awsAccessKeyID, awsSecretAccessKey, ""),
		Endpoint:         aws.String("https://s3.us-west-000.backblazeb2.com"),
		Region:           aws.String("us-west-002"),
		S3ForcePathStyle: aws.Bool(true),
	}
	newSession := session.New(s3Config)

	s3Client := s3.New(newSession)
	fmt.Println(s3Client)
	file, h, err := r.FormFile("image")
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error", err)
	}

	var story models.Story
	story.Title = r.FormValue("title")
	story.Content = r.FormValue("content")
	story.CurrentCity = r.FormValue("current_city")
	i, err := strconv.ParseUint(r.FormValue("year"), 10, 64)
	if err == nil {
		fmt.Printf("Type: %T \n", i)
		fmt.Println(i)
	}
	fmt.Println(i)
	story.Year = uint(i)
	story.Summary = r.FormValue("summary")
	city := story.CurrentCity
	coordinates, err := api.locationFinder.GetCityCenter(city)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story has an invalid current city"), err)
	}
	story.Latitude = randomCoords(coordinates.Latitude)
	story.Longitude = randomCoords(coordinates.Longitude)
	videoURL := r.FormValue("video_url")
	re := regexp.MustCompile(`(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})`)
	videoURL = "https://www.youtube.com/watch?v=ao6jHx27gB8"
	match := re.FindAllStringSubmatch(videoURL, 2)

	story.VideoURL = "https://www.youtube.com/embed/" + match[0][1]
	fmt.Println(story.VideoURL)
	story.AuthorFirstName = r.FormValue("author_first_name")
	story.AuthorLastName = r.FormValue("author_last_name")
	story.AuthorCountry = r.FormValue("author_country")
	defer file.Close()
	size := h.Size
	buffer := make([]byte, size) // read file content to buffer

	file.Read(buffer)

	fileBytes := bytes.NewReader(buffer)
	fileType := http.DetectContentType(buffer)
	bucket := aws.String("shoeproject")

	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Body:          fileBytes,
		Bucket:        bucket,
		Key:           aws.String(h.Filename),
		ContentLength: aws.Int64(size),
		ContentType:   aws.String(fileType),
	})
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error", err)
	}
	resp := "https://shoeproject.s3.us-west-000.backblazeb2.com/" + h.Filename
	story.ImageURL = resp
	fmt.Println(story)
	if err := api.database.Create(&story).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}
	return rest.MsgStatusOK("Story Added Successfully")
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
