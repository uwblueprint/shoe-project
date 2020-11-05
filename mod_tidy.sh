#!/usr/bin/env bash
set -e
go mod tidy  # <-- non 0 return code
echo 'run make backend-fmt to tidy moudles'
