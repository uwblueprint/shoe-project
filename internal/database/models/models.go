package models

import (
	"gorm.io/gorm"
)

type Author struct {
	gorm.Model
	FirstName     string  `gorm:"not null" json:"first_name"`
	LastName      string  `json:"last_name"`
	Bio           string  `gorm:"type:text" json:"bio"`
	OriginCountry string  `gorm:"not null" json:"origin_country"`
	CurrentCity   string  `gorm:"not null" json:"current_city"`
	Stories       []Story `gorm:"foreignKey:AuthorID;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"stories,omitempty"`
}

type Story struct {
	gorm.Model
	Title    string `gorm:"not null" json:"title"`
	Content  string `gorm:"type:text;not null" json:"content"`
	AuthorID uint   `json:"author_id"`
	Author   Author `json:"author"`
}
