package testutils

import "github.com/uwblueprint/shoe-project/internal/location"

type MockLocationFinder struct{}

func (finder MockLocationFinder) GetCityCenter(city string) (location.Coordinates, error) {
	return location.Coordinates{
		Latitude:  1,
		Longitude: 1,
	}, nil
}
