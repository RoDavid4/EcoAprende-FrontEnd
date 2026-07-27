# EcoAprende Frontend

Este repositorio contiene la aplicacion cliente de EcoAprende, desarrollada con Angular y SCSS.

## Requisitos previos

- Docker y Docker Compose instalados en el entorno de desarrollo.
- Node.js v20 (si se desea ejecutar de manera local sin contenedores).

## Instrucciones de ejecucion

El entorno de desarrollo esta dockerizado y expone el servidor de desarrollo de Angular para facilitar el recargado automatico (hot-reload) durante la programacion.

1. Construir y levantar el contenedor:
   ```bash
   docker compose up --build
   ```
2. La aplicacion estara accesible en `http://localhost:4200`.

## Scripts disponibles

Los comandos principales definidos en `package.json` para uso local son:

- `npm start`: Levanta el servidor de desarrollo en `localhost:4200`.
- `npm run build`: Compila la aplicacion en el directorio de salida (`/dist`) para su despliegue en produccion.
- `npm run test`: Ejecuta las pruebas unitarias.

## Consideraciones de Entorno

La instalacion de paquetes se ejecuta dinamicamente al levantar el contenedor de Docker (`npm install`). Este proceso esta abstraido a traves de `docker-compose.yml` para asegurar que el aislamiento del contenedor proteja la compatibilidad binaria frente al sistema anfitrion local.
