package location

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"

	"go.uber.org/zap"

	mapbox "github.com/ryankurte/go-mapbox/lib"
	"github.com/ryankurte/go-mapbox/lib/geocode"
)

const geocodeRequestLimit = 1
const zipCodeURL = "https://app.zipcodebase.com/api/v1/code/city?apikey=%s&city=%s&country=ca&limit=%d"

type zipcodeResponse struct {
	Results []string `json:"results"`
}

type coordinatesFinder struct {
	mapbox       *mapbox.Mapbox
	forwardOpts  geocode.ForwardRequestOpts
	zipCodeToken string
	logger       *zap.SugaredLogger
}

func NewCoordinatesFinder(mapboxToken string, zipcodeToken string, country string) (LocationFinder, error) {
	mapbox, err := mapbox.NewMapbox(mapboxToken)
	if err != nil {
		return nil, err
	}

	forwardOpts := geocode.ForwardRequestOpts{
		Limit:   geocodeRequestLimit,
		Country: country,
	}

	return coordinatesFinder{
		mapbox:       mapbox,
		forwardOpts:  forwardOpts,
		zipCodeToken: zipcodeToken,
		logger:       zap.S(),
	}, err
}

func (finder coordinatesFinder) GetCityCenter(city string) (Coordinates, error) {
	forward, err := finder.mapbox.Geocode.Forward(city, &finder.forwardOpts)
	if err != nil {
		return Coordinates{}, err
	}
	if len(forward.Features) == 0 {
		return Coordinates{}, errors.New("Not a valid city")
	}

	return Coordinates{
		Latitude:  forward.Features[0].Center[1],
		Longitude: forward.Features[0].Center[0],
	}, nil
}

func randomCoords(coordinate float64) float64 {
	num := math.Floor(rand.Float64()*99) + 1
	if math.Round(rand.Float64()) == 1 {
		num *= 1
	}

	return coordinate + 0.003*num
}

func (finder coordinatesFinder) randomizePinLocation(city string) (latitude float64, longitude float64, err error) {
	coordinates, err := finder.GetCityCenter(city)
	if err != nil {
		finder.logger.Info("Error while defaulting to randomized coordinates")
		return 0, 0, err
	}
	latitude = randomCoords(coordinates.Latitude)
	longitude = randomCoords(coordinates.Longitude)
	return latitude, longitude, nil
}

func (finder coordinatesFinder) GetPostalLatitudeAndLongitude(city string, limit int64) (float64, float64, error) {
	// query zipcode with numStoriesInCity + 1 results and take the last one
	resp, err := http.Get(fmt.Sprintf(zipCodeURL, finder.zipCodeToken, city, limit+2))
	if err != nil || resp.StatusCode != 200 {
		// default to randomizing if there is an error
		finder.logger.Info("Error requesting postal codes from the ZipCode API")
		return finder.randomizePinLocation(city)
	}
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		// default to randomizing if there is an error
		finder.logger.Info("Error accessing ZipCode response body")
		return finder.randomizePinLocation(city)
	}
	var zipcodeResp zipcodeResponse
	err = json.Unmarshal(body, &zipcodeResp)
	if err != nil || zipcodeResp.Results == nil || len(zipcodeResp.Results) == 0 {
		// default to randomizing if there is an error
		finder.logger.Info("Error deserializing ZipCode response")
		return finder.randomizePinLocation(city)
	}

	postalCode := zipcodeResp.Results[len(zipcodeResp.Results)-1]
	fmt.Printf("%v", zipcodeResp)
	coordinates, err := finder.GetCityCenter(postalCode)
	if err != nil {
		// default to randomizing if there is an error
		finder.logger.Info("Error getting the coordinates fro the postal code from Mapbox")
		return finder.randomizePinLocation(city)
	}
	return coordinates.Latitude, coordinates.Longitude, nil
}
