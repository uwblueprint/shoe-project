package migrations

import (
	"github.com/casbin/casbin/v2"
	gormadapter "github.com/casbin/gorm-adapter/v3"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
	"syreclabs.com/go/faker"
)

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Author{}, &models.Story{}, &models.User{})
}

func DropTables(db *gorm.DB) error {
	return db.Migrator().DropTable(&models.Author{}, &models.Story{}, &models.User{})
}

func CreateSuperUser(db *gorm.DB, casbinFilePath string) error {
	// Clear current superuser if any
	db.Where("username = ?", config.GetSuperUserUsername()).Delete(models.User{})

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(config.GetSuperUserPassword()), 10)
	superUser := models.User{
		Username: config.GetSuperUserUsername(),
		Password: string(hashedPassword),
	}

	if err := db.Create(&superUser).Error; err != nil {
		return err
	}

	a, _ := gormadapter.NewAdapterByDB(db)
	e, _ := casbin.NewCachedEnforcer(casbinFilePath, a)

	if _, err := e.AddPolicy(config.GetSuperUserUsername(), "/*", "*"); err != nil {
		return err
	}
	e.InvalidateCache()

	return nil
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
				ImageURL:    "https://exampleurl.com",
			},
		},
	}

	return db.Create(&seed).Error
}
