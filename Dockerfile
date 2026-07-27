FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

# Usamos el servidor de desarrollo por defecto para permitir hot-reload
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
