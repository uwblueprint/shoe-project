package rest

import (
	"fmt"
	"net/http"

	"github.com/go-chi/render"
)

// MsgResponse is a generic message response by the API server
type MsgResponse struct {
	HTTPStatusCode int `json:"-"` // http response status code

	Message string `json:"message"`        // message for user
	AppCode int64  `json:"code,omitempty"` // application-specific message code
}

// JSONResponse is json response payload
type JSONResponse struct {
	HTTPStatusCode int         `json:"-"`                // http response status code
	Status         string      `json:"status,omitempty"` // http status message
	Payload        interface{} `json:"payload"`          // application-specific JSON payload
}

// Render is the Renderer for the MsgResponse struct
func (m *MsgResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, m.HTTPStatusCode)
	return nil
}

// Render is the Renderer for the JSONResponse struct
func (j *JSONResponse) Render(w http.ResponseWriter, r *http.Request) error {
	render.Status(r, j.HTTPStatusCode)
	return nil
}

// MsgStatusOK is a message with 200 http code
func MsgStatusOK(msg string) render.Renderer {
	return &MsgResponse{
		HTTPStatusCode: http.StatusOK,
		Message:        msg,
	}
}

// MsgStatusOKf is a format specifier version of MsgStatusOK
func MsgStatusOKf(msg string, a ...interface{}) render.Renderer {
	return MsgStatusOK(fmt.Sprintf(msg, a...))
}

// MsgWithStatus is a message with provide http code
func MsgWithStatus(code int, msg string) render.Renderer {
	return &MsgResponse{
		HTTPStatusCode: code,
		Message:        msg,
	}
}

// MsgWithStatusf is a format specifier version of MsgStatus
func MsgWithStatusf(code int, msg string, a ...interface{}) render.Renderer {
	return MsgWithStatus(code, fmt.Sprintf(msg, a...))
}

// JSONStatusOK is a message with JSON payload and 200 http code
func JSONStatusOK(payload interface{}) render.Renderer {
	return &JSONResponse{
		HTTPStatusCode: http.StatusOK,
		Status:         http.StatusText(http.StatusOK),
		Payload:        payload,
	}
}

// JSONWithStatus is a JSON payload with provided status
func JSONWithStatus(payload interface{}, code int) render.Renderer {
	return &JSONResponse{
		HTTPStatusCode: code,
		Status:         http.StatusText(code),
		Payload:        payload,
	}
}
