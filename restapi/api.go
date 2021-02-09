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
	"gorm.io/gorm"
)

// namespace api
type api struct {
	database       *gorm.DB
	logger         *zap.SugaredLogger
	locationFinder location.LocationFinder
	s3config       *aws.Config
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

	// Public API
	r.Group(func(r chi.Router) {
		rest.GetHandler(r, "/health", api.health)
		rest.GetHandler(r, "/stories", api.ReturnAllStories)
		rest.GetHandler(r, "/stories/{countries}", api.ReturnStoriesByCountries)
		rest.GetHandler(r, "/story/{storyID}", api.ReturnStoryByID)
		rest.GetHandler(r, "/authors/origin_countries", api.ReturnAllCountries)
		rest.GetHandler(r, "/tags", api.ReturnAllUniqueTags)
		rest.PostHandler(r, "/login", api.Login)
		rest.PostHandler(r, "/story", api.CreateStoriesFormData)

		rest.GetHandler(r, "/auth/callback", api.AuthCallback)
		rest.GetHandler(r, "/client_tokens", api.ReturnClientTokens)
		rest.GetHandler(r, "/unauthorized", api.UnauthorizedPage)

		// TODO: move these back to private api once https://github.com/uwblueprint/shoe-project/issues/204 is closed
		rest.PostHandler(r, "/stories", api.CreateStories)
		rest.PostHandler(r, "/authors", api.CreateAuthors)
	})

	// Private API
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(config.GetJWTKey()))
		r.Use(jwtauth.Authenticator)

		// dummy call to check auth flow
		rest.GetHandler(r, "/checkauth", api.checkAuthDummy)
	})
	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}

func (api api) checkAuthDummy(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Working!")
}
