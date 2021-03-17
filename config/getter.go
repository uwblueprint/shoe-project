package config

import (
	"time"

	"github.com/go-chi/jwtauth"
	"github.com/spf13/viper"
	str2duration "github.com/xhit/go-str2duration/v2"
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

func GetPort() *int {
	if !viper.IsSet("port") {
		return nil
	}

	port := viper.GetInt("port")
	return &port
}

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

// -- database --
func GetDatabaseUser() string {
	return viper.GetString("database.user")
}

func GetDatabasePassword() string {
	return viper.GetString("database.password")
}

func GetDatabaseName() string {
	return viper.GetString("database.name")
}

func GetDatabasePort() string {
	return viper.GetString("database.port")
}

func GetDatabaseHost() string {
	return viper.GetString("database.host")
}

func GetDatabaseURL() string {
	return viper.GetString("database.url")
}

// -- auth --

func GetJWTKey() *jwtauth.JWTAuth {
	return jwtauth.New("HS256", []byte(viper.GetString("auth.jwt_key")), nil)
}

func GetTokenExpiryDuration() (time.Duration, error) {
	timeProvider := viper.GetString("auth.jwt_expiry")

	return str2duration.ParseDuration(timeProvider)
}

func GetTokenIssuer() string {
	return viper.GetString("auth.jwt_issuer")
}

func GetGoogleClientId() string {
	return viper.GetString("google.client_id")
}

func GetGoogleClientSecret() string {
	return viper.GetString("google.client_secret")
}

func GetMapBoxToken() string {
	return viper.GetString("mapbox.token")
}

func GetZipCodeToken() string {
	return viper.GetString("zipcode.token")
}

func GetAuthRedirectURL() string {
	return viper.GetString("auth.redirect.url")
}

