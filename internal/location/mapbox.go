package location

import (
	"errors"

	mapbox "github.com/ryankurte/go-mapbox/lib"
	"github.com/ryankurte/go-mapbox/lib/geocode"
)

const geocodeRequestLimit = 1

type mapboxFinder struct {
	mapbox      *mapbox.Mapbox
	forwardOpts geocode.ForwardRequestOpts
}

func NewMapboxFinder(token string, country string) (LocationFinder, error) {
	mapbox, err := mapbox.NewMapbox(token)
	if err != nil {
		return nil, err
	}

	forwardOpts := geocode.ForwardRequestOpts{
		Limit:   geocodeRequestLimit,
		Country: country,
	}

	return mapboxFinder{
		mapbox:      mapbox,
		forwardOpts: forwardOpts,
	}, err
}

func (finder mapboxFinder) GetCityCenter(city string) (Coordinates, error) {
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
