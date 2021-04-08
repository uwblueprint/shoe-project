package migrations

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"math/rand"

	"github.com/biter777/countries"
	"github.com/uwblueprint/shoe-project/internal/database/models"
	"github.com/uwblueprint/shoe-project/internal/location"
	"gorm.io/gorm"
)

func RunMigration(db *gorm.DB) error {
	return db.AutoMigrate(&models.Author{}, &models.Story{}, &models.User{}, &models.Tag{}, &models.Country{})
}

func CreateTables(db *gorm.DB) error {
	return RunMigration(db)
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
	err = db.Migrator().DropTable(&models.Tag{})
	if err != nil {
		return err
	}
	err = db.Migrator().DropTable(&models.Country{})
	if err != nil {
		return err
	}
	return db.Migrator().DropTable(&models.Author{})
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

func ChooseRandomTag() string {
	tagChoice := []string{"EDUCATION", "REFUGEE", "IMMIGRATION"}
	randomIndex := rand.Intn(len(tagChoice))
	pick := tagChoice[randomIndex]
	return pick
}

func Seed(db *gorm.DB, locationFinder location.LocationFinder) error {
	var Countries = countries.All()
	for _, name := range Countries {
		country := models.Country{
			Name: fmt.Sprint(name),
		}
		err := db.Create(&country).Error
		if err != nil {
			return err
		}
	}

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
	for index, story := range stories {
		lat, lng, err := locationFinder.GetPostalLatitudeAndLongitude(story.CurrentCity, int64(index))
		if err != nil {
			return err
		}
		story.Latitude = lat
		story.Longitude = lng
		story.IsVisible = true
		err = db.Create(&story).Error
		if err != nil {
			return err
		}
		tag := models.Tag{
			Name:    ChooseRandomTag(),
			StoryID: story.ID,
		}
		err = db.Create(&tag).Error
		if err != nil {
			return err
		}
	}

	return nil
}
