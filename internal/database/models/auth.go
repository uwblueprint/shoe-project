package models

import (
	"errors"

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

// BeforeCreate validates that a user email belongs to either uwblueprint or theshoeproject
func (user *User) BeforeCreate(tx *gorm.DB) (err error) {
	if user.Hd != "uwblueprint.org" && user.Hd != "theshoeproject.online" {
		return errors.New("Invalid email domain")
	}
	return nil
}

// Claims is a custom JWT claim type
// not persisted in db
type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}
