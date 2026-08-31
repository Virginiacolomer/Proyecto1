
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
