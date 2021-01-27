package restapi

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/location"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"github.com/uwblueprint/shoe-project/server"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// namespace api
type api struct {
	database       *gorm.DB
	logger         *zap.SugaredLogger
	locationFinder location.LocationFinder
}

func Router(db *gorm.DB, locationFinder location.LocationFinder) (http.Handler, error) {
	r := server.CreateRouter()
	api := api{
		database:       db,
		logger:         zap.S(),
		locationFinder: locationFinder,
	}

	// Public API
	r.Group(func(r chi.Router) {
		rest.GetHandler(r, "/health", api.health)
		rest.GetHandler(r, "/stories", api.ReturnAllStories)
		rest.GetHandler(r, "/stories/{countries}", api.ReturnStoriesByCountries)
		rest.GetHandler(r, "/story/{storyID}", api.ReturnStoryByID)
		rest.GetHandler(r, "/authors/origin_countries", api.ReturnAllCountries)
		rest.PostHandler(r, "/login", api.Login)
		rest.PostHandler(r, "/upload", api.UploadToS3)
		rest.GetHandler(r, "/client_tokens", api.ReturnClientTokens)
	})

	// Private API
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(config.GetJWTKey()))
		r.Use(jwtauth.Authenticator)

		rest.PostHandler(r, "/stories", api.CreateStories)
		rest.PostHandler(r, "/authors", api.CreateAuthors)
	})
	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}
