package database

import (
	"fmt"
	"strings"

	"github.com/uwblueprint/shoe-project/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	dsn := config.GetDatabaseURL()
	if strings.TrimSpace(dsn) == "" {
		dsn = fmt.Sprintf("user=%s password=%s dbname=%s port=%s sslmode=disable host=%s", config.GetDatabaseUser(),
			config.GetDatabasePassword(), config.GetDatabaseName(), config.GetDatabasePort(), config.GetDatabaseHost())
	}
	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}
