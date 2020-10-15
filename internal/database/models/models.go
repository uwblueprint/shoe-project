package models

import (
	"gorm.io/gorm"
)

type Author struct {
	gorm.Model
	FirstName     string `gorm:"not null"`
	LastName      string
	Bio           string  `gorm:"type:text"`
	OriginCountry string  `gorm:"not null"`
	CurrentCity   string  `gorm:"not null"`
	Stories       []Story `gorm:"foreignKey:AuthorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
}

type Story struct {
	gorm.Model
	Title    string `gorm:"not null"`
	Content  string `gorm:"type:text;not null"`
	AuthorID uint
	Author   Author
}
