package restapi

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/restapi/rest"
)

func (api api) UnauthorizedPage(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.JSONStatusOK("Unauthorized!")
}
