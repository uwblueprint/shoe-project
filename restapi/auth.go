package restapi

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"gorm.io/gorm"
)

func (api api) Login(w http.ResponseWriter, r *http.Request) render.Renderer {
	var user models.User
	username := chi.URLParam(r, "username")
	password := chi.URLParam(r, "password")

	// Find user with username
	err := api.database.Where("username=?", username).First(&user).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound(fmt.Sprintf("Could not find user with username %s", username))
		}
		return rest.ErrInternal(api.logger, err)
	}

	// Validate password
	if user.Password != password {
		return rest.ErrUnauthorized(fmt.Sprintf("Wrong password for username %s", username))
	}

	// TODO:
	// Set env var with secret token
	// Create & persist JWT token with exp for user
	// Refresh function for token
	// jwtMiddleware() : handlers to extract & validate token from header in request
	// Wrap POST routes with jwtMiddleware() 
	return rest.JSONStatusOK(user)
}


