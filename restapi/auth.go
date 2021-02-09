package restapi

import (
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

// What is state?
// Since your redirect_uri can be guessed, using a state value can increase your assurance that
// an incoming connection is the result of an authentication request.
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

	// switch to using session storage instead of cookie?
	state, err := generateStateOauthCookie(w)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	url := oauthconfig.AuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)

	// TODO: figure out to stop html char escaping in url in json response
	// bf := bytes.NewBuffer([]byte{})
	// jsonEncoder := json.NewEncoder(bf)
	// jsonEncoder.SetEscapeHTML(false)
	// jsonEncoder.Encode(url)
	// fmt.Println(url)

	return rest.JSONStatusOK(url)
}

func (api api) AuthCallback(w http.ResponseWriter, r *http.Request) render.Renderer {
	expectedState, _ := r.Cookie("oauthstate")
	if expectedState.Value != r.FormValue("state") {
		return rest.ErrUnauthorized("Invalid oauth state")
	}

	// request from google has an authorization code that
	// we exchange the code for an access token and a refresh token
	token, err := oauthconfig.Exchange(oauth2.NoContext, r.FormValue("code"))
	if err != nil {
		return rest.ErrUnauthorized("Invalid authorization code")
	}

	// we use the access token to create a google client which we use to access user info
	client := oauthconfig.Client(oauth2.NoContext, token)
	response, err := client.Get("https://www.googleapis.com/oauth2/v3/userinfo")
	if err != nil {
		return rest.JSONStatusOK("Invalid access token")
	}
	defer response.Body.Close()
	user := models.UserV2{}
	err = json.NewDecoder(response.Body).Decode(&user)

	// redirect if invalid
	if user.Hd != "uwblueprint.org" && user.Hd != "theshoeproject.online" {
		return rest.ErrUnauthorized("Please use your Blueprint or ShoeProject email.")
	}

	// if valid, firstOrCreate user then call createJWTToken function, the redirect
	api.database.FirstOrCreate(&user)
	jwtToken, err := generateJWTToken(user.Email)
	if err != nil {
		return rest.ErrInternal(api.logger, err)
	}

	// http.Redirect(w, r, "/api/tempredirect", http.StatusTemporaryRedirect)
	return rest.JSONStatusOK(jwtToken)
}

func (api api) TempRedirect(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.JSONStatusOK("ok")
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
