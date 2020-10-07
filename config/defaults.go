package config

import (
	"net/http"

	"github.com/spf13/viper"
)

func init() {
	// Logger Defaults
	viper.SetDefault("mode", "dev")
	viper.SetDefault("logger.disable_stacktrace", false)
	viper.SetDefault("logger.log_server_requests", true)
	viper.SetDefault("logger.log_server_requests_body", false)
	viper.SetDefault("logger.disabled_server_endpoints", []string{})

	// Profiler Defaults
	viper.SetDefault("profiler.enabled", false)
	viper.SetDefault("profiler.path", "/debug")

	// Server Defaults
	viper.SetDefault("server.host", "")
	viper.SetDefault("server.port", 8900)
	viper.SetDefault("server.tls.enabled", false)
	viper.SetDefault("server.tls.devcert", false)
	viper.SetDefault("server.tls.certfile", "server.crt")
	viper.SetDefault("server.tls.keyfile", "server.key")
	viper.SetDefault("server.cors.allowed_origins", []string{"*"})
	viper.SetDefault("server.cors.allowed_methods", []string{http.MethodGet, http.MethodPost, http.MethodPut, http.MethodDelete})
	viper.SetDefault("server.cors.allowed_headers", []string{"Host", "Authorization", "Content-Type", "Content-Length", "Connection"})
	viper.SetDefault("server.cors.allowed_credentials", true)
	viper.SetDefault("server.cors.max_age", 300)

	// Database Defaults
	viper.SetDefault("database.user", "user")
	viper.SetDefault("database.password", "password")
	viper.SetDefault("database.name", "test")
	viper.SetDefault("database.port", "5432")
	viper.SetDefault("database.host", "localhost")
}
