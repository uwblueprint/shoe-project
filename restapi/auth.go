package restapi

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/dgrijalva/jwt-go"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"gorm.io/gorm"
)

type claims struct {
	Username	string	`json:"username"`
	jwt.StandardClaims
}

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

	// Create JWT token with 5 minutes expiry for user
	expirationTime := time.Now().Add(5 * time.Minute)
	claim := &claims {
		Username: username,
		StandardClaims: jwt.StandardClaims {
			ExpiresAt: expirationTime.Unix(),
		},
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	signedToken, err := token.SignedString(config.GetJWTKey())
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	// Persist user's JWT token as a cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "token",
		Value:   signedToken,
		Expires: expirationTime,
	})

	// TODO:
	// Refresh function for token
	// jwtMiddleware() : handlers to extract & validate token from header in request
	// Wrap POST routes with jwtMiddleware() 
	return rest.JSONStatusOK(signedToken)
}


