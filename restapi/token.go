package restapi

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

type tokens struct {
	Mapbox         string `json:"mapbox"`
	Zipcode        string `json:"zipcode"`
	GoogleClientID string `json:"google_client_id"`
}

func (api api) ReturnClientTokens(w http.ResponseWriter, r *http.Request) render.Renderer {
	tokens := tokens{
		Mapbox:         config.GetMapBoxToken(),
		Zipcode:        config.GetZipCodeToken(),
		GoogleClientID: config.GetGoogleClientId(),
	}

	return rest.JSONStatusOK(tokens)
}
