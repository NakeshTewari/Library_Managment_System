# Stage 1: Build Go Microservice
FROM golang:1.22-bookworm AS go-builder
WORKDIR /app/circulation_service
COPY circulation_service/go.mod ./
COPY circulation_service/ ./
RUN CGO_ENABLED=0 GOOS=linux go test -v ./...
RUN CGO_ENABLED=0 GOOS=linux go build -o /circulation-service .

# Stage 2: Runtime with Node.js & Local MariaDB
FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y mariadb-server && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY --from=go-builder /circulation-service /usr/local/bin/circulation-service

# Pre-install Node.js dependencies
COPY backend_lms/package*.json ./backend_lms/
WORKDIR /app/backend_lms
RUN npm ci || npm install

WORKDIR /app
COPY . .

# Run DB migration, start Go service, and run tests completely offline
CMD ["sh", "-c", "circulation-service & service mariadb start && mysql -u root -e 'CREATE DATABASE IF NOT EXISTS mysql_db CHARACTER SET utf8mb4;' && mysql -u root mysql_db < backend_lms/database/schema.sql && npm test --prefix backend_lms"]
