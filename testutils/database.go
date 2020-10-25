package testutils

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func CreateMemDatabase() (*gorm.DB, error) {
	gormDB, err := gorm.Open(sqlite.Open(""), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return gormDB, nil
}

func CloseDatabase(db *gorm.DB) error {
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}

	return sqlDB.Close()
}

func DropTables(db *gorm.DB) error {
	if err := db.Migrator().DropTable("authors"); err != nil {
		return err
	}
	if err := db.Migrator().DropTable("stories"); err != nil {
		return err
	}
<<<<<<< HEAD
	if err := db.Migrator().DropTable("users"); err != nil {
		return err
	}
=======
>>>>>>> Create test suite and add helpers for database and router

	return nil
}
