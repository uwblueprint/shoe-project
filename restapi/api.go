package restapi

import (
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/go-chi/chi"
	"github.com/go-chi/jwtauth"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/location"
	"github.com/uwblueprint/shoe-project/restapi/rest"
	"github.com/uwblueprint/shoe-project/server"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"gorm.io/gorm"
)

// namespace api
type api struct {
	database       *gorm.DB
	logger         *zap.SugaredLogger
	locationFinder location.LocationFinder
	s3config       *aws.Config
	oauthconfig    *oauth2.Config
}

// Router sets up the go-chi routes for the server
func Router(db *gorm.DB, locationFinder location.LocationFinder) (http.Handler, error) {
	r := server.CreateRouter()
	api := api{
		database:       db,
		logger:         zap.S(),
		locationFinder: locationFinder,
		s3config: &aws.Config{
			Credentials:      credentials.NewStaticCredentials(os.Getenv("B2_KEY_ID"), os.Getenv("B2_APP_KEY"), ""),
			Endpoint:         aws.String(os.Getenv("BUCKET_ENDPOINT")),
			Region:           aws.String(os.Getenv("BUCKET_REGION")),
			S3ForcePathStyle: aws.Bool(true),
		},
	}

	api.oauthconfig = &oauth2.Config{
		ClientID:     config.GetGoogleClientId(),
		ClientSecret: config.GetGoogleClientSecret(),
		RedirectURL:  "http://localhost:8900/api/auth/callback",
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
		},
		Endpoint: google.Endpoint,
	}

	// Public API
	r.Group(func(r chi.Router) {
		rest.GetHandler(r, "/health", api.health)
		rest.GetHandler(r, "/stories", api.ReturnAllStories)
		rest.GetHandler(r, "/stories/{countries}", api.ReturnStoriesByCountries)
		rest.GetHandler(r, "/story/{storyID}", api.ReturnStoryByID)
		rest.DeleteHandler(r, "/story/{storyID}", api.DeleteStoryByID)
		rest.PutHandler(r, "/story/{storyID}", api.EditStoryByID)
		rest.GetHandler(r, "/authors/origin_countries", api.ReturnAllCountries)
		rest.GetHandler(r, "/tags", api.ReturnAllUniqueTags)
		rest.GetHandler(r, "/login", api.Login)
		rest.GetHandler(r, "/auth/callback", api.AuthCallback)
		rest.GetHandler(r, "/client_tokens", api.ReturnClientTokens)

		// TODO: move back to protected endpoints
		rest.PostHandler(r, "/stories", api.CreateStories)
		rest.PostHandler(r, "/story", api.CreateStoriesFormData)
		rest.PostHandler(r, "/authors", api.CreateAuthors)
	})

	// Private API
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(config.GetJWTKey()))
		r.Use(Authenticator)

		// rest.PostHandler(r, "/stories", api.CreateStories)
		// rest.PostHandler(r, "/story", api.CreateStoriesFormData)
		// rest.PostHandler(r, "/authors", api.CreateAuthors)
	})
	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}
