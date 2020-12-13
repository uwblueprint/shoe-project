package database

import (
	"fmt"
	"strings"

	"github.com/uwblueprint/shoe-project/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func Connect() (*gorm.DB, error) {
	dsn := strings.TrimSpace(config.GetDatabaseURL())
	if dsn == "" {
		dsn = fmt.Sprintf("postgres://%s:%s@%s:%s/%s",
			config.GetDatabaseUser(),
			config.GetDatabasePassword(),
			config.GetDatabaseHost(),
			config.GetDatabasePort(),
			config.GetDatabaseName(),
		)
	}

	return gorm.Open(postgres.Open(dsn), &gorm.Config{})
}
