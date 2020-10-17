package models

import (
	"gorm.io/gorm"
)

// TODO: hash passwords
type User struct {
	gorm.Model
	Username	string	`json:"username"`
	Password	string	`json:"password"`
}

