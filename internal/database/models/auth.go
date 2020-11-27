package models

import (
	"github.com/dgrijalva/jwt-go"
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Username string `json:"username" gorm:"unique"`
	Password string `json:"password"`
	RoleID   int
	Role     Role
}

type Role struct {
	ID   int    `gorm:"autoIncrement:true"`
	Role string `gorm:"unique"`
}

// Claims not persisted in db
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}
