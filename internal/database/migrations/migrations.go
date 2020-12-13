package migrations

import (
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"syreclabs.com/go/faker"
)

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Author{}, &models.Story{}, &models.User{})
}

func CreateSuperUser(db *gorm.DB) error {
	// Clear current superuser if any
	db.Where("username = ?", config.GetSuperUserUsername()).Delete(models.User{})

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(config.GetSuperUserPassword()), 10)
	superUser := models.User{
		Username: config.GetSuperUserUsername(),
		Password: string(hashedPassword),
	}
	return db.Create(&superUser).Error
}

func Seed(db *gorm.DB) error {
	seed := models.Author{
		FirstName:     faker.Name().FirstName(),
		LastName:      faker.Name().LastName(),
		Bio:           faker.Name().Title(),
		OriginCountry: faker.Address().Country(),
		Stories: []models.Story{
			{
				Title:       faker.Hacker().Noun(),
				Content:     faker.Hacker().SaySomethingSmart(),
				CurrentCity: "Toronto",
				Date:        "October 2011",
				Summary:     faker.Hacker().SaySomethingSmart(),
				Latitude:    float64(faker.Address().Latitude()),
				Longitude:   float64(faker.Address().Longitude()),
				ImageURL:    "https://exampleurl.com",
			},
		},
	}

	return db.Create(&seed).Error
}
