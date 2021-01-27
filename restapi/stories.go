package restapi

import (
	"bytes"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"net/http"
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

type imageStruct struct {
	image string
}

func (api api) UploadToS3(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Story struct.
	//var image imageStruct

	// respond to the client with the error message and a 400 status code.
	//if err := json.NewDecoder(r.Body).Decode(&image); err != nil {
	//return rest.ErrInvalidRequest(api.logger, "Invalid payload", err)
	//}
	awsAccessKeyID := "Insert Key ID here"
	awsSecretAccessKey := "Insert Secret Here"
	s3Config := &aws.Config{
		Credentials:      credentials.NewStaticCredentials(awsAccessKeyID, awsSecretAccessKey, ""),
		Endpoint:         aws.String("https://s3.us-west-000.backblazeb2.com"),
		Region:           aws.String("us-west-002"),
		S3ForcePathStyle: aws.Bool(true),
	}
	newSession := session.New(s3Config)

	s3Client := s3.New(newSession)

	file, h, err := r.FormFile("image")
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error", err)
	}
	defer file.Close()
	var buff bytes.Buffer
	fileSize, err := buff.ReadFrom(file)
	//fileInfo, _ := file.Stat()
	//size := fileInfo.Size()
	buffer := make([]byte, fileSize) // read file content to buffer

	file.Read(buffer)
	fileBytes := bytes.NewReader(buffer)
	//fileType := http.DetectContentType(buffer)
	bucket := aws.String("shoeproject")
	_, err = s3Client.PutObject(&s3.PutObjectInput{
		Body:          fileBytes,
		Bucket:        bucket,
		Key:           aws.String(h.Filename),
		ContentLength: aws.Int64(fileSize),
		ContentType:   aws.String("image/png"),
	})
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Error", err)
	}
	//fmt.Print(resp)
	return rest.MsgStatusOK("Image Uploaded Successfully")
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
