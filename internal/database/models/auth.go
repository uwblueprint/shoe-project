package models

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique; not null"`
	Password string `json:"password" gorm:"not null"`
}

type UserV2 struct {
	gorm.Model
	Email string `json:"email" gorm:"unique; not null"`
	Hd    string `json:"hd" gorm:"not null"`
}

// Not persisted in db
type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
