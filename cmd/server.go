package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var (
	apiCmd = &cobra.Command{
		Use:   "server",
		Short: "Start server",
		Long:  "Start server",
		Run: func(cmd *cobra.Command, args []string) {
			fmt.Println("Hello World")
		},
	}
)

// init creates api command
func init() {
	rootCmd.AddCommand(apiCmd)
}
