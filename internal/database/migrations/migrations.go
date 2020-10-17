package migrations

import (
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"gorm.io/gorm"
	"syreclabs.com/go/faker"
)

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Story{}, &models.Author{})
}

func Seed(db *gorm.DB) error {
	seed := models.Author{
		FirstName:     faker.Name().FirstName(),
		LastName:      faker.Name().LastName(),
		Bio:           faker.Name().Title(),
		OriginCountry: faker.Address().Country(),
		CurrentCity:   "Toronto",
		Stories: []models.Story{
			{
				Title:   faker.Hacker().Noun(),
				Content: faker.Hacker().SaySomethingSmart(),
			},
		},
	}

	return db.Create(&seed).Error
}
