# frontend/Dockerfile.dev
FROM node:20-alpine

# Instalar inotify-tools para que Vite pueda detectar cambios
RUN apk add --no-cache inotify-tools

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de definición de dependencias
COPY package*.json ./

# Instalar dependencias con npm
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer el puerto que usa Vite por defecto
EXPOSE 5173

# Comando para iniciar Vite en modo desarrollo
CMD ["npm", "run", "dev"]
