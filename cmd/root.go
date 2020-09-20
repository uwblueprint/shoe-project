package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
)

var (
	// root CLI command
	rootCmd = &cobra.Command{}
)

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err.Error())
	}
}
