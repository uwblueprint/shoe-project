package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/render"
	mapbox "github.com/ryankurte/go-mapbox/lib"
	"github.com/ryankurte/go-mapbox/lib/geocode"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

func (api api) CreateAuthors(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Author struct.
	var authors []models.Author

	// respond to the client with the error message and a 400 status code.
	if err := json.NewDecoder(r.Body).Decode(&authors); err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid payload", err)
	}

	token := os.Getenv("MAPBOX_TOKEN")
	mapBox, err := mapbox.NewMapbox(token)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid mapbox token", err)
	}

	var forwardOpts geocode.ForwardRequestOpts
	forwardOpts.Limit = 1
	forwardOpts.Country = "CA"

	for i := range authors {
		place := authors[i].CurrentCity
		fmt.Printf("%+v\n", authors[i])
		forward, err := mapBox.Geocode.Forward(place, &forwardOpts)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %s is has an invalid current city", i), err)
		}
		center := forward.Features[0].Center
		authors[i].Latitude = float32(center[0])
		authors[i].Longitude = float32(center[1])
	}

	if err := api.database.Create(&authors).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.MsgStatusOK("Authors added successfully")
}
