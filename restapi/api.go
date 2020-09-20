package restapi

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"github.com/uwblueprint/shoe-project/server"
)

// namespace api
type api struct{}

func Router() (http.Handler, error) {
	r := server.CreateRouter()
	api := api{}

	rest.GetHandler(r, "/health", api.health)

	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hi")
}
