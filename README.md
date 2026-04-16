# Descripción del Proyecto

Aplicación de Bitácora de Eventos diseñada para el registro y visualización de notas en tiempo real.

---

# Tecnologías Utilizadas

Frontend: React + Vite.

Backend: Node.js + Express.

Base de Datos: MongoDB.

Infraestructura: AWS (EC2, S3, CloudFormation).

DevOps: Docker, Docker Compose, Bash Scripting.

---

# Instrucciones de Ejecución Local

Clonar el repositorio:  
```bash
git clone <url-repo>
```

Crear archivo frontend/.env con:
```bash
VITE_API_URL=http://localhost:3000
```

Ejecutar:
```bash
docker-compose up -d --build
```

Acceder a:
```bash
http://localhost:5173
```

---

# Instrucciones de Despliegue en EC2
Conectarse vía SSH a la instancia.

Realizar un pull
```bash
git pull origin main
```

Crear archivo frontend/.env con la IP pública: VITE_API_URL=http://<IP-PUBLICA>:3000.

Ejecutar 
```bash
sudo docker-compose up -d --build.
```


