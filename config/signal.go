package config

import (
	"os"
	"os/signal"
	"syscall"
)

type stop struct {
	c chan bool
}

// Stop is a global stop instance
var Stop = &stop{
	c: make(chan bool),
}

// Handles all incoming signals
func init() {
	signalChannel := make(chan os.Signal, 1)
	signal.Notify(signalChannel, os.Interrupt, syscall.SIGTERM)

	go func() {
		<-signalChannel
		close(Stop.c)
	}()
}

// Chan returns a read only channel that is closed when program should exist
func (s *stop) Chan() <-chan bool {
	return s.c
}
