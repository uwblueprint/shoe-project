package restapi

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func (api api) Login(w http.ResponseWriter, r *http.Request) render.Renderer {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		rest.ErrInvalidRequest(api.logger, "Invalid login payload", err)
	}

	// Find user with username
	var dbUser models.User
	if err = api.database.Where("username=?", user.Username).First(&dbUser).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return rest.ErrNotFound(fmt.Sprintf("Could not find user with username %s", user.Username))
		}
		return rest.ErrInternal(api.logger, err)
	}

	// Validate password
	if err = bcrypt.CompareHashAndPassword([]byte(dbUser.Password), []byte(user.Password)); err != nil {
		return rest.ErrUnauthorized(fmt.Sprintf("Wrong password for username %s", user.Username))
	}

	jwtExpiry, err := config.GetTokenExpiryDuration()
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	claim := &models.Claims{
		Username: user.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(jwtExpiry).Unix(),
			Issuer:    config.GetTokenIssuer(),
		},
	}

	token := config.GetJWTKey()
	_, signedToken, err := token.Encode(claim)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(signedToken)
}
