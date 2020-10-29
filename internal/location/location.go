package location

type Coordinates struct {
	Longitude float64
	Latitude  float64
}

type LocationFinder interface {
	GetCityCenter(city string) (Coordinates, error)
}
