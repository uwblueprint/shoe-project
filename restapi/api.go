package restapi

import (
	"net/http"

	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/restapi/rest"
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

	rest.GetHandler(r, "/health", api.health)
	rest.GetHandler(r, "/stories", api.ReturnAllStories)
	rest.GetHandler(r, "/story/{storyID}", api.ReturnStoryByID)

	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}
