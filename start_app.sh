#!/bin/bash
cd "$(dirname "$0")"
docker-compose up -d
echo "Aplicación iniciada en segundo plano."