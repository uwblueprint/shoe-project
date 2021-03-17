package restapi

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

func (api api) ReturnAllCountries(w http.ResponseWriter, r *http.Request) render.Renderer {
	var countries []models.Country
	err := api.database.Find(&countries).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}
	names := make([]string, len(countries))
	for i, t := range countries {
		names[i] = t.Name
	}
	return rest.JSONStatusOK(names)
}

func (api api) AddCountries(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Country struct.
	var countries []models.Country

	// respond to the client with the error message and a 400 status code.
	if err := json.NewDecoder(r.Body).Decode(&countries); err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid payload", err)
	}

	if err := api.database.Create(&countries).Error; err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.MsgStatusOK("Countries added successfully")
}
