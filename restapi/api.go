package restapi

import (
	"net/http"

	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
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
	enforcer       *casbin.CachedEnforcer
	logger         *zap.SugaredLogger
	locationFinder location.LocationFinder
}

func Router(db *gorm.DB, locationFinder location.LocationFinder) (http.Handler, error) {
	r := server.CreateRouter()
	a, _ := gormadapter.NewAdapterByDB(db)
	e, _ := casbin.NewCachedEnforcer("auth_model.conf", a)
	api := api{
		database:       db,
		enforcer:       e,
		logger:         zap.S(),
		locationFinder: locationFinder,
	}

	// Grant the superuser access to everything, regardless of whether the db has been seeded
	if _, err := api.enforcer.AddPolicy(config.GetSuperUserUsername(), "/*", "*"); err != nil {
		return r, err
	}
	api.enforcer.InvalidateCache()

	// Public API
	r.Group(func(r chi.Router) {
		rest.GetHandler(r, "/health", api.health)
		rest.GetHandler(r, "/stories", api.ReturnAllStories)
		rest.GetHandler(r, "/stories/{countries}", api.ReturnStoriesByCountries)
		rest.GetHandler(r, "/story/{storyID}", api.ReturnStoryByID)
		rest.GetHandler(r, "/authors/origin_countries", api.ReturnAllCountries)
		rest.PostHandler(r, "/login", api.Login)
	})

	// Private API
	r.Group(func(r chi.Router) {
		r.Use(jwtauth.Verifier(config.GetJWTKey()))
		r.Use(jwtauth.Authenticator)
		r.Use(api.PermissionAuthenticator())

		rest.PostHandler(r, "/stories", api.CreateStories)
		rest.PostHandler(r, "/authors", api.CreateAuthors)
	})
	return r, nil
}

func (api api) health(w http.ResponseWriter, r *http.Request) render.Renderer {
	return rest.MsgStatusOK("Hello World")
}
