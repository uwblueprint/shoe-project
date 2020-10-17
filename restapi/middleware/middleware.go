package middleware

import (
	"context"
	"net/http"
	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
)

func VerifyToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Parse token signed string from the header
		// Sample request after successful login:
		// curl -H 'Accept: application/json' -H "Token: ${TOKEN}" <url>
		tokenString, err := request.HeaderExtractor{"Token"}.ExtractToken(r)
		if err != nil {
			http.Error(w, http.StatusText(401), 401)
			return
		}
		claim := &models.Claims{}
		token, err := jwt.ParseWithClaims(tokenString, claim, func(token *jwt.Token) (interface{}, error) {
			return config.GetJWTKey(), nil
		})

		// Validate
		if !token.Valid {
			if ve, ok := err.(*jwt.ValidationError); ok {
				if ve.Errors&jwt.ValidationErrorMalformed != 0 {
					http.Error(w, "That's not even a token. Please login.", 401)
					return
				} else if ve.Errors&(jwt.ValidationErrorExpired|jwt.ValidationErrorNotValidYet) != 0 {
					// Token is either expired or not active yet
					http.Error(w, "Timing is everything. Please login.", 401)
					return
				} else {
					http.Error(w, http.StatusText(401), 401)
					return
				}
			} else {
				http.Error(w, http.StatusText(400), 400)
				return
			}
		}

		ctx := context.WithValue(r.Context(), "user", claim.Username)
		r = r.WithContext(ctx)
		next.ServeHTTP(w,r)
	})
}
