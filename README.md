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

---
### Paso 3: Frontend (React + Vite)
1. **En una nueva terminal, ingresá a la carpeta del frontend:**
   ```bash
   cd frontend
   ```
2. **Instalá las dependencias:**
   ```bash
   yarn install
   ```
3. **Verificá las variables de entorno:**
   Asegúrate de que el archivo `.env.development` contenga:
   ```env
   VITE_API_URL="http://localhost:3000/api"
   ```
4. **Levantá el servidor de desarrollo:**
   ```bash
   yarn dev
   ```
   El frontend estará disponible en **`http://localhost:5173`**.
---
## 🔑 Credenciales de Acceso por Defecto
Una vez ejecutado el Seed, podés ingresar al sistema desde `http://localhost:5173/login`:
* **Correo:** `admin@gmail.com`
* **Contraseña:** `admin`
* **Empresa:** Seleccionar la empresa generada en el menú desplegable.
---
## 🧪 Pruebas y Testing
### Backend
* **Ejecutar tests unitarios:** `cd backend/proyecto && yarn test`
* **Ver cobertura de código:** `cd backend/proyecto && yarn test:cov`
* **Ejecutar tests E2E:** `cd backend/proyecto && yarn test:e2e`
### Frontend
* **Verificar linter de sintaxis:** `cd frontend && yarn lint`
* **Checklist de pruebas manuales:** Ver guía completa en [`frontend/TESTING_CHECKLIST.md`](./frontend/TESTING_CHECKLIST.md).
---
## 📁 Estructura del Repositorio
```text
.
├── backend/
│   └── proyecto/          # API Rest NestJS (TypeORM, Auth JWT, MySQL)
├── frontend/              # Aplicación Web React (Vite, Tailwind, TypeScript)
└── README.md              # Documentación principal del proyecto
```
