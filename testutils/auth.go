package testutils

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/jwtauth"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	str2duration "github.com/xhit/go-str2duration/v2"
)

var JWTKey = "random"
var JWTExpiry = "2h"
var JWTIssuer = "test_endpoints"

func generateJWTToken(email string) (string, error) {
	jwtExpiry, err := str2duration.ParseDuration(JWTExpiry)
	if err != nil {
		return "", err
	}
	expiration := time.Now().Add(jwtExpiry)

	claim := &models.Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiration.Unix(),
			Issuer:    JWTIssuer,
		},
	}

	token := jwtauth.New("HS256", []byte(JWTKey), nil)
	_, signedToken, err := token.Encode(claim)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}

func ValidToken() (string, error) {
	token, err := generateJWTToken("user@blueprint.org")
	if err != nil {
		return "", err
	}

	return token, err
}
