package testutils

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

<<<<<<< HEAD
func MockDatabase() (*gorm.DB, error) {
=======
func CreateMemDatabase() (*gorm.DB, error) {
>>>>>>> 25efa23828a1a4ae53d0144c6d913ad02abec4a1
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

	return nil
}
