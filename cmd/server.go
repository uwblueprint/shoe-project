package cmd

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/spf13/cobra"
	"github.com/uwblueprint/shoe-project/config"
	"github.com/uwblueprint/shoe-project/internal/database"
	"github.com/uwblueprint/shoe-project/internal/location"
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

			dir := fmt.Sprintf("%s/ui/dist", filepath.Dir(executablePath))
			fs := http.FileServer(http.Dir(dir))
			server.Router.Get("/*", func(w http.ResponseWriter, r *http.Request) {
				if _, err := os.Stat(dir + r.RequestURI); os.IsNotExist(err) {
					http.StripPrefix(r.RequestURI, fs).ServeHTTP(w, r)
				} else {
					fs.ServeHTTP(w, r)
				}
			})

			db, err := database.Connect()
			if err != nil {
				logger.Fatalw("Failed to connect to database", "Err", err)
			}

			locationFinder, err := location.NewMapboxFinder(config.GetMapBoxToken(), "CA")
			if err != nil {
				logger.Fatalw("Failed to initialize Mapbox location finder service")
			}

			apiRouter, err := restapi.Router(db, locationFinder)
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
				case <-config.Stop.Chan():
					logger.Info("Recieved interrupt signal...")

					if err := server.Server.Close(); err != nil {
						logger.Fatalw("Server shutdown", "Err", err)
					}
					break readChannel
				}
			}

			if err := zap.L().Sync(); err != nil { // flush the logger
				fmt.Fprint(os.Stderr, "Could not flush logger", err.Error())
			}

		},
	}
)

// init creates api command
func init() {
	rootCmd.AddCommand(apiCmd)
}
