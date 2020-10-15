package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"

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

	rest.PostHandler(r, "/authors", api.authorCreate)
	return r, nil
}

func (api api) authorCreate(w http.ResponseWriter, r *http.Request) render.Renderer {
	// Declare a new Story struct.
	var s []models.Author

	// Try to decode the request body into the struct. If there is an error,
	// respond to the client with the error message and a 400 status code.
	err := json.NewDecoder(r.Body).Decode(&s)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return rest.MsgStatusOK("Error")
	}

	if err := api.database.Create(&s).Error; err != nil {
		return rest.ErrInternal(zap.S(), err)
	}

	// Do something with the Author struct...
	fmt.Fprintf(w, "Author: %+v", s)
	return rest.MsgStatusOK("Hello World")
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}
