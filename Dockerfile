# Etapa 1: Build
FROM node:22 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: Runtime
FROM node:22-slim
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
