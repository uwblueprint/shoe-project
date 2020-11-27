package migrations

import (
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"syreclabs.com/go/faker"
)

func DropTables(db *gorm.DB) error {
	return db.Migrator().DropTable(&models.Author{}, &models.Story{}, &models.User{}, &models.Role{})
}

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Author{}, &models.Story{}, &models.User{}, &models.Role{})
}

func PopulateUserRoles(db *gorm.DB) error {
	roles := []models.Role{{Role: "admin"}, {Role: "member"}}
	return db.Create(&roles).Error
}

func CreateSuperUser(db *gorm.DB) error {
	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(config.GetSuperUserPassword()), 10)
	superUser := models.User{
		Username: config.GetSuperUserUsername(),
		Password: string(hashedPassword),
		RoleID:   1,
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
				Summary:     faker.Hacker().SaySomethingSmart(),
				Latitude:    float64(faker.Address().Latitude()),
				Longitude:   float64(faker.Address().Longitude()),
			},
		},
	}

	return db.Create(&seed).Error
}
