package models

import (
	"time"

	"gorm.io/gorm"
)

// Author struct describes a story author
type Author struct {
	CreatedAt     time.Time
	UpdatedAt     time.Time
	DeletedAt     gorm.DeletedAt `gorm:"index"`
	FirstName     string         `gorm:"primaryKey;not null" json:"first_name"`
	LastName      string         `gorm:"primaryKey" json:"last_name"`
	Bio           string         `gorm:"type:text" json:"bio"`
	OriginCountry string         `gorm:"primaryKey;not null" json:"origin_country"`
	Stories       []Story        `gorm:"foreignKey:AuthorFirstName,AuthorLastName,AuthorCountry;references:FirstName,LastName,OriginCountry;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;" json:"stories,omitempty"`
}

// Story struct describes a story rendered on the map
type Story struct {
	gorm.Model
	Title           string  `gorm:"not null" json:"title"`
	Content         string  `gorm:"type:text;not null" json:"content"`
	CurrentCity     string  `gorm:"not null" json:"current_city"`
	Year            uint    `gorm:"not null" json:"year"`
	IsVisible       bool    `gorm:"default:false" json:"is_visible"`
	Summary         string  `gorm:"type:text" json:"summary"`
	Latitude        float64 `gorm:"not null" json:"latitude"`
	Longitude       float64 `gorm:"not null" json:"longitude"`
	ImageURL        string  `gorm:"type:text" json:"image_url"`
	VideoURL        string  `gorm:"type:text" json:"video_url"`
	AuthorFirstName string  `json:"author_first_name"`
	AuthorLastName  string  `json:"author_last_name"`
	AuthorCountry   string  `json:"author_country"`
	Author          Author  `gorm:"foreignKey:AuthorFirstName,AuthorLastName,AuthorCountry;references:FirstName,LastName,OriginCountry" json:"author"`
}

type Tag struct {
	gorm.Model
	Name    string `gorm:"primaryKey;not null" json:"name"`
	StoryID uint   `gorm:"primaryKey;not null" json:"story_id"`
	Story   Story  `gorm:"foreignKey:StoryID" json:"story"`
}

type Country struct {
	gorm.Model
	Name string `gorm:"primaryKey;not null" json:"country_name"`
}
