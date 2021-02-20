package location

// Coordinates is a struct for latitude and longitude coordinates
type Coordinates struct {
	Longitude float64
	Latitude  float64
}

// LocationFinder is a service to find location based on various attributes
type LocationFinder interface {
	// GetCityCenter finds center coordinates based on a city provided
	GetCityCenter(city string) (Coordinates, error)
	GetPostalCode(city string, limit int64) (float64, float64, error)
}
