#!/bin/bash
REPO_URL="https://github.com/JohanNP-32/avance-proyecto-devops.git"
PROJECT_DIR="avance-proyecto-devops"

if [ ! -d "$PROJECT_DIR" ]; then
    git clone $REPO_URL
fi

cd $PROJECT_DIR
git pull origin main
docker-compose up -d --build