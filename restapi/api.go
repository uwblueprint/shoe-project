package restapi

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"github.com/uwblueprint/shoe-project/restapi/middleware"
	"github.com/uwblueprint/shoe-project/server"
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
		rest.GetHandler(r, "/login/{username}/{password}", api.Login)
		rest.GetHandler(r, "/story/{storyID}", api.ReturnStoryByID)
	})
	
	// Private API
	r.Group(func(r chi.Router) {
		r.Use(middleware.VerifyToken)
		rest.GetHandler(r, "/stories", api.ReturnAllStories)
	})

	rest.PostHandler(r, "/authors", api.CreateAuthors)
	rest.PostHandler(r, "/stories", api.CreateStories)
	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}
