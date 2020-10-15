package cmd

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database"
	"github.com/uwblueprint/shoe-project/internal/database/migrations"
	"github.com/uwblueprint/shoe-project/restapi"
	"github.com/uwblueprint/shoe-project/server"
	"go.uber.org/zap"
)

var (
	apiCmd = &cobra.Command{
		Use:   "server",
		Short: "Start server",
		Long:  "Start server",
		Run: func(cmd *cobra.Command, args []string) {
			logger := zap.S()

			server, err := server.New()
			if err != nil {
				logger.Fatalw("Create Server", "Err", err)
			}

			executablePath, err := os.Executable()
			if err != nil {
				logger.Fatalw("Get Executable Path", "Err", err)
			}

			// create and mount ui handler
			server.Router.Mount("/", uiHandler(fmt.Sprintf("%s/ui/dist", filepath.Dir(executablePath))))

			db, err := database.Connect()
			if err != nil {
				logger.Fatalw("Failed to connect to database", "Err", err)
			}

			// initialize tables and seed the database (dev mode only)
			if config.GetMode() == config.MODE_DEV {
				if err := migrations.CreateTables(db); err != nil {
					logger.Fatalw("Database table creation failed", "Err", err)
				}

				if err := migrations.Seed(db); err != nil {
					logger.Fatalw("Database seed failed", "Err", err)
				}
			}

			apiRouter, err := restapi.Router(db)
			if err != nil {
				logger.Fatalw("API Router Mount", "Err", err)
			}

			server.Router.Mount("/api", apiRouter)

			// Start the server
			errChan := make(chan error)
			err = server.ListenAndServe(errChan)
			if err != nil {
				logger.Fatalw("Start Server", "Err", err)
			}

		readChannel:
			for {
				select {
				case err, ok := <-errChan:
					if ok {
						logger.Fatalw("Server listen and serve", "Err", err)
					}
					break readChannel
				case _ = <-config.Stop.Chan():
					logger.Info("Recieved interrupt signal...")

					if err := server.Server.Close(); err != nil {
						logger.Fatalw("Server shutdown", "Err", err)
					}
					break readChannel
				}
			}

			zap.L().Sync() // flush the logger

		},
	}
)

func uiHandler(dir string) http.Handler {
	return http.FileServer(http.Dir(dir))
}

// init creates api command
func init() {
	rootCmd.AddCommand(apiCmd)
}
