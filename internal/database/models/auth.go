package models

import (
	"gorm.io/gorm"
	"github.com/dgrijalva/jwt-go"
)

// TODO: hash passwords
type User struct {
	gorm.Model
	Username	string	`json:"username"`
	Password	string	`json:"password"`
}

// Not persisted in db
type Claims struct {
	Username	string	`json:"username"`
	jwt.StandardClaims
}
