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
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

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

func (api api) LoginV2(w http.ResponseWriter, r *http.Request) render.Renderer {
	oauthconfig := &oauth2.Config{
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
	// http.Redirect(w, r, "/api/tempredirect", http.StatusTemporaryRedirect)
	return rest.JSONStatusOK(expectedState)
}

func (api api) TempRedirect(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.JSONStatusOK("ok")
}

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
