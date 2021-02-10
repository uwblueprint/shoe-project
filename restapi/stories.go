package restapi

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"gorm.io/gorm"
)

type ZipcodeResponse struct {
	Results []string `json:"results"`
}

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

func (api api) randomizePinLocation(city string) (latitude float64, longitude float64, err error) {
	coordinates, err := api.locationFinder.GetCityCenter(city)
	if err != nil {
		return 0, 0, err
	}
	latitude = randomCoords(coordinates.Latitude)
	longitude = randomCoords(coordinates.Longitude)
	return latitude, longitude, nil
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
		stories[i].CurrentCity = strings.Title(strings.ToLower(city))

		// get number of stories with current city in db
		var prevStories []models.Story
		err := api.database.Where("current_city=?", city).Find(&prevStories).Error
		if err != nil {
			api.logger.Infof("A")
			// default to randomizing if there is an error
			stories[i].Latitude, stories[i].Longitude, err = api.randomizePinLocation(city)
			if err != nil {
				return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d has an invalid current city", i), err)
			}
			continue
		}
		numStoriesInCity := 0
		if prevStories != nil {
			numStoriesInCity = len(prevStories)
		}
		// query zipcode with numStoriesInCity + 1 results and take the last one
		zipCodeToken := os.Getenv("ZIP_CODE_TOKEN")
		resp, err := http.Get(fmt.Sprintf("https://app.zipcodebase.com/api/v1/code/city?apikey=%s&city=%s&country=ca&limit=%d", zipCodeToken, city, numStoriesInCity+1))
		if err != nil || resp.StatusCode != 200 {
			api.logger.Infof("B")
			// default to randomizing if there is an error
			stories[i].Latitude, stories[i].Longitude, err = api.randomizePinLocation(city)
			if err != nil {
				return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d has an invalid current city", i), err)
			}
			continue
		}
		defer resp.Body.Close()
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			api.logger.Infof("C")
			// default to randomizing if there is an error
			stories[i].Latitude, stories[i].Longitude, err = api.randomizePinLocation(city)
			if err != nil {
				return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d has an invalid current city", i), err)
			}
			continue
		}
		var zipcodeResp ZipcodeResponse
		err = json.Unmarshal(body, &zipcodeResp)
		if err != nil || zipcodeResp.Results == nil || len(zipcodeResp.Results) == 0 {
			api.logger.Infof("D")
			// default to randomizing if there is an error
			stories[i].Latitude, stories[i].Longitude, err = api.randomizePinLocation(city)
			if err != nil {
				return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d has an invalid current city", i), err)
			}
			continue
		}

		postalCode := zipcodeResp.Results[len(zipcodeResp.Results)-1]
		api.logger.Infof(postalCode)
		coordinates, err := api.locationFinder.GetCityCenter(postalCode)
		if err != nil {
			// default to randomizing if there is an error
			api.logger.Infof("E")
			stories[i].Latitude, stories[i].Longitude, err = api.randomizePinLocation(city)
			if err != nil {
				return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d has an invalid current city", i), err)
			}
			continue
		}
		api.logger.Infof(fmt.Sprintf("lat=%d, lng=%d", coordinates.Latitude, coordinates.Longitude))
		stories[i].Latitude = coordinates.Latitude
		stories[i].Longitude = coordinates.Longitude
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
