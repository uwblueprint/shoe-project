package server

import (
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/cors"
	"github.com/go-chi/render"
	"github.com/uwblueprint/shoe-project/config"
)

type Router struct {
	chi.Router
}

// CreatCreateRouter creates router with custom configurations
func CreateRouter() Router {
	r := chi.NewRouter()

	return Router{
		Router: r,
	}
}

// WithBasicMiddlewares adds basic needed middlewares to the router
func (r Router) WithBasicMiddlewares() Router {
	r.Use(
		middleware.RequestID,
		middleware.Recoverer,
		render.SetContentType(render.ContentTypeJSON),
	)

	return r
}

// WithLoggingMiddleware adds HTTP request logging
func (r Router) WithLoggingMiddleware() Router {
	// Log Requests - use appropriate format depending on the encoding
	if config.IsLoggerLoggingServerRequests() {
		logRequestsBody := config.IsLoggerLoggingServerRequestsBody()
		disabledEndpoints := config.GetLoggerDisabledServerEndpoints()

		r.Use(loggerHTTPMiddlewareDefault(logRequestsBody, disabledEndpoints))
	}

	return r
}

// WithCORS adds CORS config to the router
func (r Router) WithCORS() Router {
	r.Use(cors.New(cors.Options{
		AllowedOrigins:   config.GetServerCorsAllowedOrigins(),
		AllowedMethods:   config.GetServerCorsAllowedMethods(),
		AllowedHeaders:   config.GetServerCorsAllowedHeaders(),
		AllowCredentials: config.IsServerCorsCredentialsAllowed(),
		MaxAge:           config.GetServerCorsMaxAge(),
	}).Handler)

	return r
}
