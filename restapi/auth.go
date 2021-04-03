package restapi

import (
	"context"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/mitchellh/mapstructure"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"google.golang.org/api/idtoken"
)

type GoogleClaims struct {
	Email string `mapstructure:"email"`
	Hd    string `mapstructure:"hd"`
}

func (api api) Login(w http.ResponseWriter, r *http.Request) render.Renderer {

	payload, err := idtoken.Validate(context.TODO(), r.Header.Get("Authorization"), config.GetGoogleClientId())
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Invalid token in header", err)
	}

	googleClaims := GoogleClaims{}
	err = mapstructure.Decode(payload.Claims, &googleClaims)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Could not decode google response", err)
	}
	user := models.User{
		Email: googleClaims.Email,
		Hd:    googleClaims.Hd,
	}

	// create user in database if valid
	err = api.database.FirstOrCreate(&user, models.User{Email: user.Email}).Error
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "User does not have a valid email address", err)
	}

	// if valid set jwt token in cookie
	err = generateJWTToken(user.Email, w)
	if err != nil {
		return rest.ErrInvalidRequest(api.logger, "Could not generate JWT token", err)
	}

	return rest.JSONStatusOK("Authenticated Successfully")
}

func generateJWTToken(email string, w http.ResponseWriter) error {
	jwtExpiry, err := config.GetTokenExpiryDuration()
	if err != nil {
		return err
	}
	expiration := time.Now().Add(jwtExpiry)

	claim := &models.Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiration.Unix(),
			Issuer:    config.GetTokenIssuer(),
		},
	}

	token := config.GetJWTKey()
	_, signedToken, err := token.Encode(claim)
	if err != nil {
		return err
	}

	secure := (config.GetMode() == config.MODE_PROD)

	cookie := http.Cookie{Name: "jwt", Value: signedToken, Expires: expiration, HttpOnly: true, Secure: secure, Path: "/api"}
	http.SetCookie(w, &cookie)

	return nil
}

func Authenticator(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token, _, err := jwtauth.FromContext(r.Context())

		if err != nil {
			http.Error(w, "Could not find JWT token", http.StatusBadRequest)
			return
		}

		if token == nil || !token.Valid {
			http.Error(w, "Invalid JWT token", http.StatusBadRequest)
			return
		}

		// Token is authenticated, pass it through
		next.ServeHTTP(w, r)
	})
}
