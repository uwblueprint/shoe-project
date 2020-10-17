package restapi

import (
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
	"github.com/uwblueprint/shoe-project/config"
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
	if err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return rest.ErrUnauthorized(fmt.Sprintf("Wrong password for username %s", username))
	}

	// Create JWT token with 15 minutes expiry for user
	expirationTime := time.Now().Add(15 * time.Minute)
	claim := &models.Claims {
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

	return rest.JSONStatusOK(signedToken)
}

