package server

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/http"
	"strconv"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/snowzach/certtools"
	"github.com/snowzach/certtools/autocert"
	"github.com/uwblueprint/shoe-project/config"
	"go.uber.org/zap"
)

type Server struct {
	Logger *zap.SugaredLogger
	Router chi.Router
	Server *http.Server
}

// New will setup Chi API listener
func New() (*Server, error) {
	r := CreateRouter().WithBasicMiddlewares().WithLoggingMiddleware().WithCORS()

	s := &Server{
		Logger: zap.S(),
		Router: r,
	}

	return s, nil
}

// ListenAndServe will listen for requests
func (s *Server) ListenAndServe(errChan chan error) error {
	portToUse := config.GetServerPort()
	if config.GetPort() != nil {
		portToUse = *config.GetPort()
	}

	s.Server = &http.Server{
		Addr:    net.JoinHostPort(config.GetServerHost(), strconv.Itoa(portToUse)),
		Handler: s.Router,
	}

	logger := s.Logger.With("Address", s.Server.Addr)

	listener, err := net.Listen("tcp", s.Server.Addr)
	if err != nil {
		return fmt.Errorf("could not listen on %s: %v", s.Server.Addr, err)
	}

	// Enable TLS?
	if config.IsServerTLSEnabled() {
		var cert tls.Certificate
		if config.IsServerTLSUseDevCert() {
			cert, err = autocert.New(autocert.InsecureStringReader("localhost"))
			if err != nil {
				return fmt.Errorf("could not autocert generate server certificate: %v", err)
			}
			logger.Warn("Server is using an insecure development TLS certificate")
		} else {
			// Load keys from file
			cert, err = tls.LoadX509KeyPair(config.GetServerCertFile(), config.GetServerKeyFile())
			if err != nil {
				return fmt.Errorf("could not load server certificate: %v", err)
			}
		}

		// Enabed Certs
		s.Server.TLSConfig = &tls.Config{
			Certificates: []tls.Certificate{cert},
			MinVersion:   certtools.SecureTLSMinVersion(),
			CipherSuites: certtools.SecureTLSCipherSuites(),
		}
		// Wrap the listener in a TLS Listener
		listener = tls.NewListener(listener, s.Server.TLSConfig)
	}

	go func() {
		if err = s.Server.Serve(listener); err != nil {
			errChan <- err
		}
		close(errChan)
	}()

	logger.Infow("Server Listening",
		"Host", config.GetServerHost(),
		"Port", portToUse,
		"TLS", config.IsServerTLSEnabled(),
	)

	// enable profiler
	if config.IsProfilerEnabled() && config.GetProfilerPath() != "" {
		profilerPath := config.GetProfilerPath()

		s.Logger.Debugw("Enable Profiler on API Server", "Path", profilerPath)
		s.Router.Mount(profilerPath, middleware.Profiler())
	}

	return nil
}
