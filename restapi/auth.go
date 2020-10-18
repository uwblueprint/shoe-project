package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"go.uber.org/zap"
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
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		rest.ErrInvalidRequest(zap.S(), "Invalid login payload", err)
	}

	// Find user with username
	var dbUser models.User
	err = api.database.Where("username=?", user.Username).First(&dbUser).Error
	if err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound(fmt.Sprintf("Could not find user with username %s", user.Username))
		}
		return rest.ErrInternal(api.logger, err)
	}

	// Validate password
	if err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); err != nil {
		return rest.ErrUnauthorized(fmt.Sprintf("Wrong password for username %s", user.Username))
	}

	// Create JWT token with 15 minutes expiry for user
	expirationTime := time.Now().Add(15 * time.Minute)
	claim := &models.Claims {
		Username: user.Username,
		StandardClaims: jwt.StandardClaims {
			ExpiresAt: expirationTime.Unix(),
			Issuer: config.GetTokenIssuer(),
		},
	}
	
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claim)
	signedToken, err := token.SignedString(config.GetJWTKey())
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(signedToken)
}

