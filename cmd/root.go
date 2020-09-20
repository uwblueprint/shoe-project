package cmd

import (
	"fmt"
	"os"
	"strings"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"github.com/uwblueprint/shoe-project/config"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var (
	configFile string
	logger     *zap.Logger

	// root CLI command
	rootCmd = &cobra.Command{}
)

// init initializes config, and logs
func init() {
	cobra.OnInitialize(initConfig, initLogger)
	rootCmd.PersistentFlags().StringVarP(&configFile, "config", "c", "", "Config file for the server")
}

// initConfig reads in config file provided and ENV variables if set
func initConfig() {
	viper.SetTypeByDefaultValue(true)
	viper.AutomaticEnv()
	viper.SetEnvKeyReplacer(strings.NewReplacer(".", "_"))

	if configFile != "" {
		viper.SetConfigFile(configFile)
		if err := viper.ReadInConfig(); err != nil {
			fmt.Fprintf(os.Stderr, "Could not read config file %s: %v\n", configFile, err.Error())
			os.Exit(1)
		}
	}
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintf(os.Stderr, "%s\n", err.Error())
	}
}

// initLogger sets up logger based on configuration provided
func initLogger() {
	var logConfig zap.Config

	if config.GetMode() == config.MODE_PROD {
		logConfig = zap.NewProductionConfig()
	} else {
		logConfig = zap.NewDevelopmentConfig()
	}

	var logLevel zapcore.Level
	if err := logLevel.Set(config.GetLoggerLevel()); err != nil {
		fmt.Fprintf(os.Stderr, "Logger level setup error: %v\n", err)
		os.Exit(1)
	}
	logConfig.Level.SetLevel(logLevel)

	// Settings
	logConfig.Encoding = config.GetLoggerEncoding()
	logConfig.Development = config.GetMode() == config.MODE_DEV
	logConfig.DisableCaller = false
	logConfig.DisableStacktrace = config.IsLoggerStacktraceDisabled()

	// Enable Color
	if config.IsLoggerColored() {
		logConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}

	// Use sane timestamp when logging to console
	if logConfig.Encoding == config.LOGGER_ENCODING_CONSOLE {
		logConfig.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	}

	// JSON Fields
	logConfig.EncoderConfig.MessageKey = "msg"
	logConfig.EncoderConfig.LevelKey = "level"
	logConfig.EncoderConfig.CallerKey = "caller"

	// Build the logger
	globalLogger, err := logConfig.Build()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Logger build error: %v\n", err)
		os.Exit(1)
	}
	zap.ReplaceGlobals(globalLogger)
}
