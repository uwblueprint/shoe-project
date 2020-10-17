package migrations

import (
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"gorm.io/gorm"
	"syreclabs.com/go/faker"
	"golang.org/x/crypto/bcrypt"
)

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Author{}, &models.Story{}, &models.User{})
}

func CreateSuperUser(db *gorm.DB) error {
	// Clear current superuser if any
	db.Where("username = ?", "admin").Delete(models.User{})
	
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(config.GetSuperUserPassword()), 8);
	superUser := models.User {
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
