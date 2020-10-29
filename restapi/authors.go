package restapi

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

func (api api) CreateAuthors(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Author struct.
	var author []models.Author

	// respond to the client with the error message and a 400 status code.
	if err := json.NewDecoder(r.Body).Decode(&author); err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid payload", err)
	}

	if err := api.database.Create(&author).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.MsgStatusOK("Authors added successfully")
}

func (api api) ReturnAllCountries(w http.ResponseWriter, r *http.Request) render.Renderer {
	var author []models.Author
	keys := make(map[string]bool)
	countries := []string{}

	err := api.database.Find(&author).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	for _, entry := range author {
		if _, value := keys[entry.OriginCountry]; !value {
			keys[entry.OriginCountry] = true
			if entry.OriginCountry != "" {
				countries = append(countries, entry.OriginCountry)
			}

		}
	}

	return rest.JSONStatusOK(countries)
}
