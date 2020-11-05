package models

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
}

// Not persisted in db
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}
