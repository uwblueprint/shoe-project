package restapi

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"github.com/uwblueprint/shoe-project/server"
	"go.uber.org/zap"
	"gorm.io/gorm"
)

// namespace api
type api struct {
	database *gorm.DB
}

func Router(db *gorm.DB) (http.Handler, error) {
	r := server.CreateRouter()
	api := api{
		database: db,
	}

	rest.GetHandler(r, "/health", api.health)
	rest.GetHandler(r, "/stories", api.returnAllStories)
	rest.GetHandler(r, "/story/{storyID}", api.returnStoryByID)

	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}

func (api api) returnAllStories(w http.ResponseWriter, r *http.Request) render.Renderer {
	var stories []models.Story
	err := api.database.Find(&stories).Error

	if err != nil {
		logger := zap.S()
		return rest.ErrInternal(logger, err)
	}

	return rest.JSONStatusOK(stories)
}

func (api api) returnStoryByID(w http.ResponseWriter, r *http.Request) render.Renderer {
	var story models.Story
	id := chi.URLParam(r, "storyID")
	err := api.database.Where("id=?", id).First(&story).Error

	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound("Could not find story with ID: " + id)
		}
		logger := zap.S()
		return rest.ErrInternal(logger, err)
	}

	return rest.JSONStatusOK(story)
}
