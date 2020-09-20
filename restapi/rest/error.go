package rest

import (
	"net/http"

	"github.com/go-chi/render"
	"go.uber.org/zap"
)

// ErrResponse is a generic struct for returning a standard error document
type ErrResponse struct {
	Logger         *zap.SugaredLogger `json:"-"` // logger to use
	Err            error              `json:"-"` // low-level runtime error
	HTTPStatusCode int                `json:"-"` // http response status code

	StatusText string `json:"status"`          // user-level status message
	AppCode    int64  `json:"code,omitempty"`  // application-specific error code
	ErrorText  string `json:"error,omitempty"` // application-level error message, for debugging
}

// Render is the Renderer for ErrResponse struct
func (e *ErrResponse) Render(w http.ResponseWriter, r *http.Request) error {
	if e.Err != nil {
		e.Logger.Errorw("API Error", "Err", e.Err.Error())
	}
	render.Status(r, e.HTTPStatusCode)
	return nil
}

// ErrInvalidRequest is used to indicate an error on user input (with wrapped error)
func ErrInvalidRequest(logger *zap.SugaredLogger, errText string, err error) render.Renderer {
	if errText == "" && err != nil {
		errText = err.Error()
	}

	return &ErrResponse{
		Logger:         logger,
		Err:            err,
		HTTPStatusCode: http.StatusBadRequest,
		StatusText:     "Invalid request.",
		ErrorText:      errText,
	}
}

// ErrInternal returns a generic server error to the user
func ErrInternal(logger *zap.SugaredLogger, err error) render.Renderer {
	return &ErrResponse{
		Logger:         logger,
		Err:            err,
		HTTPStatusCode: http.StatusInternalServerError,
		StatusText:     "Server Error.",
	}
}

// ErrUnauthorized returns server error with unathorized status code
func ErrUnauthorized(msg string) render.Renderer {
	return &ErrResponse{
		HTTPStatusCode: http.StatusUnauthorized,
		StatusText:     "Unathorized.",
		ErrorText:      msg,
	}
}

// ErrNotFound returns server error with not found status code
func ErrNotFound(msg string) render.Renderer {
	return &ErrResponse{
		HTTPStatusCode: http.StatusNotFound,
		StatusText:     "Resource Not Found.",
		ErrorText:      msg,
	}
}
