package restapi

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"math/rand"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
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

func (api api) Login(w http.ResponseWriter, r *http.Request) render.Renderer {
	state, err := generateStateOauthCookie(w)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	url := api.oauthconfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)

	return rest.JSONStatusOK(url)
}

func (api api) AuthCallback(w http.ResponseWriter, r *http.Request) render.Renderer {
	expectedState, _ := r.Cookie("oauthstate")
	if expectedState.Value != r.FormValue("state") {
		return rest.ErrUnauthorized("Invalid oauth state")
	}

	// exchange received authorization code for an access token
	token, err := api.oauthconfig.Exchange(context.Background(), r.FormValue("code"))
	if err != nil {
		return rest.ErrUnauthorized("Invalid authorization code")
	}

	// use access token to create a client which we use to access user info
	user := models.User{}
	client := api.oauthconfig.Client(context.Background(), token)
	response, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		return rest.JSONStatusOK("Invalid access token")
	}
	defer response.Body.Close()
	err = json.NewDecoder(response.Body).Decode(&user)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	// redirect if invalid user
	err = api.database.FirstOrCreate(&user, models.User{Email: user.Email}).Error
	if err != nil {
		http.Redirect(w, r, "/unauthorized", http.StatusTemporaryRedirect)
	}

	// if valid set jwt token in cookie
	err = generateJWTToken(user.Email, w)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK("Authenticated successfully")
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
			http.Redirect(w, r, "/unauthorized", http.StatusTemporaryRedirect)
			return
		}

		if token == nil || !token.Valid {
			http.Redirect(w, r, "/unauthorized", http.StatusTemporaryRedirect)
			return
		}

		// Token is authenticated, pass it through
		next.ServeHTTP(w, r)
	})
}
