# Proyecto Distribuidora (NestJS + React/Vite)
Sistema de gestión para distribuidora con arquitectura **NestJS** en el backend y **React (Vite + TypeScript)** en el frontend.
---
## 📋 Requisitos Previos
Asegúrate de tener instalado en tu máquina:
- **Node.js** (v20 o superior)
- **Yarn** (`npm install -g yarn`)
- **Docker** y **Docker Compose** (para levantar la base de datos MySQL)
---
## 🚀 Guía Rápida para Levantar en Local
### Paso 1: Base de Datos (MySQL)
Levantá el contenedor de MySQL utilizando Docker Compose desde la carpeta del backend:
```bash
cd backend/proyecto
docker-compose up -d mysql
```
* **Host:** `localhost`
* **Puerto mapeado local:** `3310` (interno del contenedor `3306`)
* **phpMyAdmin (Opcional):** Accedé a `http://localhost:8081` ejecutando `docker-compose up -d`
---
### Paso 2: Backend (NestJS)
1. **Ingresá a la carpeta del backend:**
   ```bash
   cd backend/proyecto
   ```
2. **Instalá las dependencias:**
   ```bash
   yarn install
   ```
3. **Configurá las variables de entorno:**
   Crea o verifica el archivo `.env` en la raíz de `backend/proyecto/`:
   ```env
   DB_TYPE=mysql
   DB_HOST=localhost
   DB_PORT=3310
   DB_USERNAME=admin
   DB_PASSWORD=admin
   DB_DATABASE=gestionBaseT
   PORT=3000
   JWT_SECRET=secreto_super_seguro_desarrollo
   JWT_EXPIRATION_ACCESS=8h
   JWT_EXPIRATION_REFRESH=7d
   PUNTO_VENTA_ACTIVO_ID=1
   ```
4. **Ejecutá las migraciones de la Base de Datos:**
