# Distribuidora BV - Sistema de Gestión

Backend para el sistema de gestión integral de una distribuidora. Construido con NestJS, TypeScript y MySQL, siguiendo una arquitectura modular con patrones de diseño orientados al dominio.

---

## Stack tecnológico

- **Framework**: NestJS 11.x
- **Lenguaje**: TypeScript 5.7
- **Base de datos**: MySQL 8.0 + TypeORM 0.3.22
- **Autenticación**: JWT + bcrypt
- **Documentación API**: Swagger / OpenAPI
- **Procesamiento de archivos**: Multer, Sharp, Tesseract.js (OCR), XLSX
- **Generación de PDFs**: PDFKit, PDFMake
- **Email**: Nodemailer
- **Testing**: Jest + ts-jest
- **Linting/Formato**: ESLint + Prettier
- **Infraestructura**: Docker + Docker Compose
- **Analytics**: Metabase

---

## Estructura del proyecto

```
distribuidora-bv/
├── src/
│   ├── main.ts                        # Bootstrap de la aplicación
│   ├── app.module.ts                  # Módulo raíz
│   ├── index.ts                       # Exportación central de entidades
│   ├── migrations/                    # Migraciones de base de datos
│   └── modules/
│       ├── gestion-usuario/           # Usuarios, autenticación, roles
│       ├── gestion-productos/         # Catálogo, stock, precios
│       ├── gestion-documentos/        # Facturas, pedidos, remitos, notas
│       ├── gestion-cobros-pagos/      # Cobros, pagos, cajas, cheques, tarjetas
│       ├── gestion-cuenta/            # Cuentas corrientes de clientes
│       ├── gestion-bancos/            # Bancos, movimientos, documentos bancarios
│       ├── gestion-sistema/           # Configuración, notificaciones, auditoría
│       ├── gestion-despacho/          # Despacho y logística
│       ├── organizacion/              # Clientes, proveedores, personal, zonas
│       ├── afip/                      # Integración AFIP (WSAA, WSFE)
│       ├── impresion/                 # Generación de reportes e impresión
│       ├── gutil/                     # Utilidades: provincias, localidades, IVA
│       └── common/                    # Filtros, pipes, decoradores, seeds
├── test/                              # Tests E2E
├── uploads/                           # Archivos subidos
├── tessdata/                          # Datos de entrenamiento OCR
├── assets/                            # Recursos estáticos
├── fuentes/                           # Fuentes tipográficas
├── orm.config.ts                      # Configuración DataSource TypeORM
├── docker-compose.yml                 # Servicios Docker
├── Dockerfile                         # Build multi-stage
├── .env                               # Variables de entorno
└── tsconfig.json                      # Configuración TypeScript
```

### Estructura interna de cada módulo

Cada módulo sigue la misma convención:

```
modulo/
├── domain/
│   └── entities/        # Entidades TypeORM
├── application/         # Servicios y casos de uso
├── infraestructure/     # Repositorios y acceso a datos
├── dto/                 # Data Transfer Objects
└── *.module.ts          # Definición del módulo NestJS
```

---

## Módulos principales

| Módulo | Descripción |
|---|---|
| `gestion-usuario` | Usuarios, autenticación JWT, roles y permisos |
| `gestion-productos` | Marcas, líneas, productos, stock, historial de precios |
| `gestion-documentos` | Facturas de venta/compra, pedidos, remitos, notas de crédito/débito |
| `gestion-cobros-pagos` | Cajas, cobros, pagos, cheques, tarjetas de crédito |
| `gestion-cuenta` | Cuentas corrientes, detalles, saldos impagos |
| `gestion-bancos` | Bancos, familias de banco, movimientos bancarios |
| `gestion-sistema` | Configuración del sistema, auditoría, notificaciones |
| `gestion-despacho` | Gestión de despacho y entregas |
| `organizacion` | Clientes, proveedores, personal, puntos de venta, zonas |
| `afip` | Integración con AFIP: WSAA, WSFE, parámetros fiscales |
| `impresion` | Generación de PDFs y reportes imprimibles |
| `gutil` | Provincias, localidades, condiciones de IVA, domicilios |
| `common` | Seeds, filtros globales, pipes, decoradores, excepciones |

---

## Configuración

### Variables de entorno (`.env`)

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=admin
DB_DATABASE=distribuidora

PORT=3000
DB_TYPE=mysql
JWT_SECRET=<secret>
JWT_EXPIRATION_ACCESS=60s
JWT_EXPIRATION_REFRESH=7d
PUNTO_VENTA_ACTIVO_ID=2
GOOGLE_CLIENT_ID=<google_client_id>
```

---

## Instalación y ejecución

### Con Docker (recomendado)

Levanta MySQL, phpMyAdmin y Metabase:

```bash
docker-compose up -d
```

| Servicio | URL |
|---|---|
| API | http://localhost:3000 |
| phpMyAdmin | http://localhost:8081 |
| Metabase | http://localhost:3002 |
| MySQL | localhost:3310 |

### Local

```bash
# Instalar dependencias
yarn install

# Desarrollo con hot-reload
yarn start:dev

# Producción
yarn build
yarn start:prod
```

---

## Scripts disponibles

```bash
yarn start              # Iniciar en modo normal
yarn start:dev          # Iniciar con watch mode
yarn build              # Compilar TypeScript
yarn lint               # Corregir errores de linting
yarn test               # Ejecutar tests unitarios
yarn test:e2e           # Ejecutar tests E2E
yarn test:cov           # Cobertura de tests
yarn migration:generate # Generar migración
yarn migration:run      # Ejecutar migraciones
yarn migration:revert   # Revertir última migración
```

---

## Documentación API

Una vez levantada la aplicación, la documentación Swagger está disponible en:

```
http://localhost:3000/api
```

Todos los endpoints tienen el prefijo `/api`.

---

## Convenciones de código

- **Módulos y archivos**: kebab-case (`gestion-usuario`, `factura-venta.service.ts`)
- **Clases y entidades**: PascalCase (`FacturaVenta`, `Usuario`)
- **Tablas en BD**: snake_case (`factura_venta`, `tipo_movimiento_bancario`)
- **DTOs**: validados con `class-validator`, con whitelist estricto
- **Excepciones**: manejadas por filtro global (`GlobalExceptionFilter`)
- **Body limit**: 50MB para JSON y URL-encoded
