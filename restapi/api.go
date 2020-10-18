package restapi

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"github.com/uwblueprint/shoe-project/server"
	"github.com/uwblueprint/shoe-project/config"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// namespace api
type api struct {
	database *gorm.DB
	logger   *zap.SugaredLogger
}

func Router(db *gorm.DB) (http.Handler, error) {
	r := server.CreateRouter()
	api := api{
		database: db,
		logger:   zap.S(),
	}

	// Public API
	r.Group(func(r chi.Router) {
		rest.GetHandler(r, "/health", api.health)
		rest.GetHandler(r, "/stories", api.ReturnAllStories)
		rest.GetHandler(r, "/story/{storyID}", api.ReturnStoryByID)
		rest.PostHandler(r, "/login", api.Login)
	})
	
	// Private API
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(config.GetJWTKey()))
		r.Use(jwtauth.Authenticator)
		// Add protected endpoints here, e.g.:
		// rest.PostHandler(r, "/story", api.CreateStory)
	})

	rest.PostHandler(r, "/authors", api.CreateAuthors)
	rest.PostHandler(r, "/stories", api.CreateStories)
	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}
