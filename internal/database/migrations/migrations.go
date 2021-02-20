package migrations

import (
	"encoding/json"
	"io/ioutil"

	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/internal/location"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func CreateTables(db *gorm.DB) error {
	return db.AutoMigrate(&models.Author{}, &models.Story{}, &models.User{})
}

func DropAllTables(db *gorm.DB) error {
	err := db.Migrator().DropTable(&models.User{})
	if err != nil {
		return err
	}
	err = db.Migrator().DropTable(&models.Story{})
	if err != nil {
		return err
	}
	return db.Migrator().DropTable(&models.Author{})
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

func parseJson(filename string, obj interface{}) error {
	file, err := ioutil.ReadFile(filename)
	if err != nil {
		return err
	}
	err = json.Unmarshal(file, obj)
	if err != nil {
		return err
	}
	return nil
}

func Seed(db *gorm.DB, locationFinder location.LocationFinder) error {
	// read in the authors file from authors.json
	var authors []models.Author
	err := parseJson("data/authors.json", &authors)
	if err != nil {
		return err
	}

	// read in the stories file from stories.json
	var stories []models.Story
	err = parseJson("data/stories.json", &stories)
	if err != nil {
		return err
	}

	// create authors and stories in DB
	err = db.Create(&authors).Error
	if err != nil {
		return err
	}

	// set lat long for coordinates
	for i, story := range stories {
		coordinates, err := locationFinder.GetCityCenter(story.CurrentCity)
		if err != nil {
			return err
		}
		stories[i].Latitude = coordinates.Latitude
		stories[i].Longitude = coordinates.Longitude
		// Make sure all stories are public for initially seeded stories
		stories[i].IsVisible = true
	}

	return db.Create(&stories).Error
}
