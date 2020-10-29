package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/render"
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

	for i := 0; i < len(authors); i++ {
		city := authors[i].CurrentCity
		coordinates, err := api.locationFinder.GetCityCenter(city)
		if err != nil {
			return rest.ErrInvalidRequest(api.logger, fmt.Sprintf("Story %d is has an invalid current city", i), err)
		}
		authors[i].Latitude = coordinates.Latitude
		authors[i].Longitude = coordinates.Longitude
	}

	if err := api.database.Create(&authors).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.MsgStatusOK("Authors added successfully")
}
