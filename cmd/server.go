package cmd

import (
	"github.com/spf13/cobra"
	"github.com/uwblueprint/shoe-project/config"
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

			// create frontend Router

			// create api Router

			//server.Router.Mount("/", frontEndRouter);
			//server.Router.Mount("/api", apiRouter);

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

// init creates api command
func init() {
	rootCmd.AddCommand(apiCmd)
}
