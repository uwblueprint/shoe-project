package testutils

import "github.com/uwblueprint/shoe-project/internal/location"

type MockLocationFinder struct{}

func (finder MockLocationFinder) GetCityCenter(city string) (location.Coordinates, error) {
	return location.Coordinates{
		Latitude:  1,
		Longitude: 1,
	}, nil
}

func (finder MockLocationFinder) GetLatitudeAndLongitude(city string, limit int64) (float64, float64, error) {
	return 0, 0, nil
}
