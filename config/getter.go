package config

import (
	"github.com/spf13/viper"
)

// app wide
func GetMode() string {
	return viper.GetString("mode")
}

// --- logger ---

func GetLoggerLevel() string {
	if viper.IsSet("logger.level") {
		return viper.GetString("logger.level")
	}

	if GetMode() == MODE_DEV {
		return LOGGER_LEVEL_DEBUG
	} else {
		return LOGGER_LEVEL_INFO
	}
}

func GetLoggerEncoding() string {
	if viper.IsSet("logger.encoding") {
		return viper.GetString("logger.encoding")
	}

	switch GetMode() {
	case MODE_DEV:
		return LOGGER_ENCODING_CONSOLE
	default:
		return LOGGER_ENCODING_JSON
	}
}

func IsLoggerColored() bool {
	if viper.IsSet("logger.color") {
		return viper.GetBool("logger.color")
	}

	switch GetMode() {
	case MODE_DEV:
		return true
	default:
		return false
	}
}

func IsLoggerStacktraceDisabled() bool {
	return viper.GetBool("logger.disable_stacktrace")
}

func IsLoggerLoggingServerRequests() bool {
	return viper.GetBool("logger.log_server_requests")
}

func IsLoggerLoggingServerRequestsBody() bool {
	return viper.GetBool("logger.log_server_requests_body")
}

func GetLoggerDisabledServerEndpoints() []string {
	return viper.GetStringSlice("logger.disabled_server_endpoints")
}

// --- profiler ---

func IsProfilerEnabled() bool {
	return viper.GetBool("profiler.enabled")
}

func GetProfilerPath() string {
	return viper.GetString("profiler.path")
}

// -- server --

func GetServerHost() string {
	return viper.GetString("server.host")
}

func GetServerPort() int {
	return viper.GetInt("server.port")
}

func IsServerTLSEnabled() bool {
	return viper.GetBool("server.tls.enabled")
}

func IsServerTLSUseDevCert() bool {
	return viper.GetBool("server.tls.devcert")
}

func GetServerCertFile() string {
	return viper.GetString("server.tls.certfile")
}

func GetServerKeyFile() string {
	return viper.GetString("server.tls.keyfile")
}

func GetServerCorsAllowedOrigins() []string {
	return viper.GetStringSlice("server.cors.allowed_origins")
}

func GetServerCorsAllowedMethods() []string {
	return viper.GetStringSlice("server.cors.allowed_methods")
}

func GetServerCorsAllowedHeaders() []string {
	return viper.GetStringSlice("server.cors.allowed_headers")
}

func IsServerCorsCredentialsAllowed() bool {
	return viper.GetBool("server.cors.allowed_credentials")
}

func GetServerCorsMaxAge() int {
	return viper.GetInt("server.cors.max_age")
}
