# Stage 1: Dependencies - Instala las dependencias de desarrollo y producción
FROM node:22-alpine3.20 AS dependencies

WORKDIR /xisti

# Copiar los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar todas las dependencias (producción + desarrollo)
RUN npm install

# Stage 2: Build - Construye la aplicación
FROM node:22-alpine3.20 AS build

WORKDIR /xisti

# Copiar node_modules y archivos de entorno desde la etapa de dependencies
COPY --from=dependencies /xisti/node_modules /xisti/node_modules
COPY package*.json ./

# Copiar el resto de los archivos de la aplicación
COPY . .

# Construir la aplicación (asegúrate de que 'tsconfig.json' y 'src' existan)
RUN npm run build

# Stage 3: Production Dependencies - Instala solo dependencias de producción
FROM node:22-alpine3.20 AS production-dependencies

WORKDIR /xisti

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar solo las dependencias de producción
RUN npm install --production

# Stage 4: Runner - Configura el entorno de producción y ejecuta la aplicación
FROM node:22-alpine3.20 AS runner

WORKDIR /xisti

# Copiar node_modules con dependencias de producción desde la etapa production-dependencies
COPY --from=production-dependencies /xisti/node_modules /xisti/node_modules

# Copiar la carpeta dist y otros archivos necesarios para correr la aplicación desde la etapa build
COPY --from=build /xisti/dist /xisti/dist
COPY --from=build /xisti/package.json /xisti/package.json

# Establecer el entorno de producción
ENV NODE_ENV=production

# Exponer el puerto de la aplicación
EXPOSE 3015

# Ejecuta las migraciones y seed solo en el momento de inicialización del contenedor (si es necesario)
# CMD ["sh", "-c", "npm run migrate:prod && npm run seed:prod && npm start"]
CMD [ "npm", "start" ]
