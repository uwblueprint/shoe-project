package migrations

import (
	"math/rand"
	"strconv"
	"time"

	"github.com/uwblueprint/shoe-project/internal/database/models"
	"gorm.io/gorm"
)

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Story{}, &models.Author{})
}

func Seed(db *gorm.DB) error {
	rand.Seed(time.Now().Unix())
	randNum := rand.Int()

	seed := models.Author{
		FirstName:     "Grace " + strconv.Itoa(randNum),
		LastName:      "Hopper",
		Bio:           "pioneer",
		OriginCountry: "United States",
		CurrentCity:   "Memory",
		Stories: []models.Story{
			{
				Title:   "Test title",
				Content: "sample text",
			},
			{
				Title:   "Test title 2",
				Content: "sample text 2",
			},
		},
	}

	return db.Create(&seed).Error
}
