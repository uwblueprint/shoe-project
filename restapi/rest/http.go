package rest

import (
	"net/http"

	"github.com/go-chi/chi"
	"github.com/go-chi/render"
)

// Custom router handler that allows returning render error
type routeHandler func(w http.ResponseWriter, r *http.Request) render.Renderer

// Custom ServeHTTP that handlers custom render errors
func (fn routeHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if renderer := fn(w, r); renderer != nil {
		render.Render(w, r, renderer)
	}
}

// GetHandler is a GET handler using routeHandler
func GetHandler(r chi.Router, pattern string, handler routeHandler) {
	r.Method(http.MethodGet, pattern, handler)
}

// PostHandler is a POST handler using routeHandler
func PostHandler(r chi.Router, pattern string, handler routeHandler) {
	r.Method(http.MethodPost, pattern, handler)
}

// PutHandler is a PUT handler using routeHandler
func PutHandler(r chi.Router, pattern string, handler routeHandler) {
	r.Method(http.MethodPut, pattern, handler)
}

// DeleteHandler is a DELETE handler using routeHandler
func DeleteHandler(r chi.Router, pattern string, handler routeHandler) {
	r.Method(http.MethodDelete, pattern, handler)
}
