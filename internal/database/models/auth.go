package models

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

// TODO: hash passwords
type User struct {
	gorm.Model
	Username	string	`json:"username"`
	Password	string	`json:"password"`
}

type Claims struct {
	Username	string	`json:"username"`
	jwt.StandardClaims
}
