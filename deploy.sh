#!/bin/bash
# Script de Despliegue - Avance Proyecto DevOps

REPO_URL="https://github.com/JohanNP-32/avance-proyecto-devops.git"
PROJECT_DIR="avance-proyecto-devops"

echo "🛠️ Instalando dependencias requeridas por la rúbrica..."

# 1. Instalar Git y Docker
sudo yum update -y
sudo yum install -y git docker

# 2. Configurar y encender Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# 3. Instalar Docker Compose (v2)
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

echo "📂 Gestionando repositorio..."

# 4. Clonar o actualizar repositorio
if [ ! -d "$PROJECT_DIR" ]; then
    git clone $REPO_URL
fi

cd $PROJECT_DIR
git pull origin main

# 5. Levantar contenedores
echo "Iniciando contenedores en EC2..."
sudo /usr/local/bin/docker-compose up -d --build

echo "Proceso completado exitosamente."