package migrations

import (
	"github.com/tjarratt/babble"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"gorm.io/gorm"
)

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Story{}, &models.Author{})
}

func Seed(db *gorm.DB) error {
	babbler := babble.NewBabbler()
	babbler.Count = 1

	seed := models.Author{
		FirstName:     babbler.Babble(),
		LastName:      babbler.Babble(),
		Bio:           babbler.Babble(),
		OriginCountry: "United States",
		CurrentCity:   "Toronto",
		Stories: []models.Story{
			{
				Title:   babble.NewBabbler().Babble(),
				Content: babble.NewBabbler().Babble(),
			},
		},
	}

	return db.Create(&seed).Error
}
