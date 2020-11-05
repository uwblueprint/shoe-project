package restapi

import (
	"encoding/json"
	"net/http"
	"sort"

	"github.com/biter777/countries"
	"github.com/go-chi/render"
	"github.com/thoas/go-funk"
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

	// validate the country
	for _, author := range authors {
		country := countries.ByName(author.OriginCountry)
		if country == countries.Unknown {
			return rest.ErrInvalidRequest(api.logger, "Unknown origin country", nil)
		}
	}

	if err := api.database.Create(&authors).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.MsgStatusOK("Authors added successfully")
}

func (api api) ReturnAllCountries(w http.ResponseWriter, r *http.Request) render.Renderer {
	var authors []models.Author
	countries := make(map[string]bool)

	err := api.database.Find(&authors).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	for _, entry := range authors {
		if entry.OriginCountry != "" {
			countries[entry.OriginCountry] = true
		} else {
			api.logger.Debug("Empty origin country")
		}
	}

	listOfCountries := funk.Keys(countries)
	sort.Strings(listOfCountries.([]string))

	return rest.JSONStatusOK(listOfCountries)
}
