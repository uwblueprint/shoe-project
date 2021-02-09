package restapi

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

var oauthconfig *oauth2.Config

func generateStateOauthCookie(w http.ResponseWriter) (string, error) {
	duration, err := config.GetTokenExpiryDuration()
	if err != nil {
		return "", err
	}
	var expiration = time.Now().Add(duration)

	b := make([]byte, 16)
	rand.Read(b)
	state := base64.URLEncoding.EncodeToString(b)
	fmt.Println(state)
	cookie := http.Cookie{Name: "oauthstate", Value: state, Expires: expiration, HttpOnly: true} // in prod, set Secure to true
	http.SetCookie(w, &cookie)

	return state, nil
}

func (api api) Login(w http.ResponseWriter, r *http.Request) render.Renderer {
	oauthconfig = &oauth2.Config{
		ClientID:     config.GetGoogleClientId(),
		ClientSecret: config.GetGoogleClientSecret(),
		RedirectURL:  "http://localhost:8900/api/auth/callback",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}

	state, err := generateStateOauthCookie(w)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	url := oauthconfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)

	return rest.JSONStatusOK(url)
}

func (api api) AuthCallback(w http.ResponseWriter, r *http.Request) render.Renderer {
	expectedState, _ := r.Cookie("oauthstate")
	if expectedState.Value != r.FormValue("state") {
		return rest.ErrUnauthorized("Invalid oauth state")
	}

	// exchange received authorization code for an access token
	token, err := oauthconfig.Exchange(context.Background(), r.FormValue("code"))
	if err != nil {
		return rest.ErrUnauthorized("Invalid authorization code")
	}

	// use access token to create a client which we use to access user info
	client := oauthconfig.Client(context.Background(), token)
	response, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		return rest.JSONStatusOK("Invalid access token")
	}
	defer response.Body.Close()
	user := models.User{}
	err = json.NewDecoder(response.Body).Decode(&user)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	// redirect if invalid
	if user.Hd != "uwblueprint.org" && user.Hd != "theshoeproject.online" {
		http.Redirect(w, r, "/api/unauthorized", http.StatusTemporaryRedirect)
	}

	// if valid, save to db and create jwt token
	api.database.FirstOrCreate(&user)
	jwtToken, err := generateJWTToken(user.Email)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	return rest.JSONStatusOK(jwtToken)
}

func generateJWTToken(email string) (string, error) {
	jwtExpiry, err := config.GetTokenExpiryDuration()
	if err != nil {
		return "", err
	}

	claim := &models.Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(jwtExpiry).Unix(),
			Issuer:    config.GetTokenIssuer(),
		},
	}

	token := config.GetJWTKey()
	_, signedToken, err := token.Encode(claim)
	if err != nil {
		return "", err
	}

	return signedToken, nil
}
