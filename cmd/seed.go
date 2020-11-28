package cmd

import (
	"github.com/spf13/cobra"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database"
	"github.com/uwblueprint/shoe-project/internal/database/migrations"
	"go.uber.org/zap"
)

var (
	seedCmd = &cobra.Command{
		Use:   "seed",
		Short: "Seed database",
		Long:  "Seed database",
		Run: func(cmd *cobra.Command, args []string) {
			logger := zap.S()

			if config.GetMode() != config.MODE_DEV {
				logger.Fatalw("Seed and migration can only be done in dev mode")
			}

			db, err := database.Connect()
			if err != nil {
				logger.Fatalw("Failed to connect to database", "Err", err)
			}

			if err := migrations.DropTables(db); err != nil {
				logger.Fatalw("Failed to drop existing tables in database", "Err", err)
			}

			if err := migrations.CreateTables(db); err != nil {
				logger.Fatalw("Database table creation failed", "Err", err)
			}

			if err := migrations.CreateSuperUser(db); err != nil {
				logger.Fatalw("Super user creation failed", "Err", err)
			}

			if err := migrations.Seed(db); err != nil {
				logger.Fatalw("Database seed failed", "Err", err)
			}

			logger.Info("Finished applying migrations and seeding!")
		},
	}
)

func init() {
	rootCmd.AddCommand(seedCmd)
}
