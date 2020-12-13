package restapi

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

func (api api) ReturnClientTokens(w http.ResponseWriter, r *http.Request) render.Renderer {
	type Tokens struct {
		Mapbox string `json:"mapbox"`
	}

	tokens := Tokens{
		Mapbox: config.GetMapBoxToken(),
	}

	return rest.JSONStatusOK(tokens)
}
