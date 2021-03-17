package restapi

import (
	"encoding/base64"
	"math/rand"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"google.golang.org/api/idtoken"
	"golang.org/x/oauth2"
	"github.com/mitchellh/mapstructure"
)

func generateStateOauthCookie(w http.ResponseWriter) (string, error) {
	duration, err := config.GetTokenExpiryDuration()
	if err != nil {
		return "", err
	}
	var expiration = time.Now().Add(duration)
	secure := (config.GetMode() == config.MODE_PROD)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	cookie := http.Cookie{Name: "oauthstate", Value: state, Expires: expiration, HttpOnly: true, Secure: secure}
	http.SetCookie(w, &cookie)

	return state, nil
}

type GoogleClaims struct {
	Email string `mapstructure:"email"`
	Hd    string `mapstructure:"hd"`
}

func (api api) Login(w http.ResponseWriter, r *http.Request) render.Renderer {

	payload, err := idtoken.Validate(oauth2.NoContext, r.Header.Get("Authorization"), config.GetGoogleClientId())
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	googleClaims := GoogleClaims{}
	mapstructure.Decode(payload.Claims, &googleClaims)
	user := models.User{
		Email: googleClaims.Email,
		Hd: googleClaims.Hd,
	}

	// create user in database if valid
	err = api.database.FirstOrCreate(&user, models.User{Email: user.Email}).Error
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	// if valid set jwt token in cookie
	err = generateJWTToken(user.Email, w)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
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
