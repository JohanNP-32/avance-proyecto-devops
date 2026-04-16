# Avance Proyecto

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

---

# Automatización 
El proyecto incluye scripts de Bash para automatizar el encendido, apagado y respaldo de la aplicación, optimizando el uso de recursos en AWS.

1. Scripts Disponibles
* start_app.sh: Detecta el sistema operativo, navega al directorio del proyecto e inicia los contenedores.
* stop_app.sh: Detiene los servicios y limpia los recursos de Docker.


2. Configuración de Tareas Programadas (Cron)
Para automatizar la ejecución (Se uso el horario de Monterrey 8:00 AM - 8:00 PM), se configuró el crontab de la siguiente manera:

En AWS EC2 (Horario UTC):
```bash
# Iniciar la app (08:00 CST -> 14:00 UTC)
0 14 * * * /home/ec2-user/avance-proyecto-devops/start_app.sh

# Detener la app (20:00 CST -> 02:00 UTC)
0 2 * * * /home/ec2-user/avance-proyecto-devops/stop_app.sh
```

En Entorno Local (macOS):

```bash
# Iniciar a las 8:00 AM
0 8 * * * "/Users/johannunezpulido/.../start_app.sh"

# Detener a las 8:00 PM
0 20 * * * "/Users/johannunezpulido/.../stop_app.sh"
```

