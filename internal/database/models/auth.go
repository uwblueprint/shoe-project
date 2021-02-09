package models

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

// User stores all users that have ever signed in with a
// uwblueprint or theshoeproject domains (stored in Hd field)
type User struct {
	gorm.Model
	Email string `json:"email" gorm:"unique; not null"`
	Hd    string `json:"hd" gorm:"not null"`
}

// Claims is a custom JWT claim type
// not persisted in db
type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
