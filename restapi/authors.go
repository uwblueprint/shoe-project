package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/render"
	"github.com/ryankurte/go-mapbox/lib/geocode"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

const geocodeRequestLimit = 1
const geocodeRequestCountry = "CA"

func (api api) CreateAuthors(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Author struct.
	var authors []models.Author

	// respond to the client with the error message and a 400 status code.
	if err := json.NewDecoder(r.Body).Decode(&authors); err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid payload", err)
	}

	forwardOpts := geocode.ForwardRequestOpts{Limit: geocodeRequestLimit, Country: geocodeRequestCountry}

	for i := 0; i < len(authors); i++ {
		place := authors[i].CurrentCity
		forward, err := api.mapBox.Geocode.Forward(place, &forwardOpts)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d is has an invalid current city", i), err)
		}
		authors[i].Latitude = forward.Features[0].Center[0]
		authors[i].Longitude = forward.Features[0].Center[1]
	}

	if err := api.database.Create(&authors).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.MsgStatusOK("Authors added successfully")
}
