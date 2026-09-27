# Library Management System

A comprehensive web-based library management system built with a modern Polyglot architecture (**Node.js Express + Go + React + MySQL**) that enables efficient management of books, users, inventory, and concurrent circulation workflows.

---

## Overview

This Library Management System is a full-stack, distributed application designed to streamline library operations including book cataloging, user management, and high-concurrency circulation workflows (hold queues and reservations).

- **Core Web API & Gateway (Node.js / Express)**: Coordinates user authentication, session cookies (`express-mysql-session`), database CRUD operations, and transaction management.
- **Circulation & Queue Engine (Go)**: High-performance, in-memory FIFO queue microservice (`circulation_service`) managing reservation queues, active 48-hour holds, and queue state.
- **Frontend Portal (React / Vite)**: Single-page catalog and borrowing dashboard styled with TailwindCSS and Material UI.
- **Relational Storage (MySQL / MariaDB)**: ACID-compliant relational persistence with full multilingual support (`utf8mb4` encoding).

---

## Features

- 📚 **Book Catalog Management**: Full CRUD operations for library books with genre, summary, ISBN, pricing, and cover assets.
- 👥 **User & Session Management**: Secure registration, login, and cookie-based sessions with role-based access control (`admin`, `user`).
- 🔄 **Circulation & Borrowing**: Track loan periods, checkouts, returns, and automatic late fee calculations ($5/day).
- ⏱️ **Hold & Reservation Queue**: Thread-safe FIFO queue engine for high-demand books when stock is depleted.
- 🔒 **Concurrency & Inventory Locking**: Atomic stock decrementing and transactional state synchronization.
- 🌐 **Multilingual Database Support**: Database schema configured with `utf8mb4_unicode_ci` for international book titles and authors.

---

## Tech Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS, Axios, Material UI | User interface and catalog interaction |
| **Backend API** | Node.js (v20+), Express.js | Auth, session store, business logic & API gateway |
| **Circulation Service** | Go 1.22+ | In-memory thread-safe FIFO queue engine |
| **Database** | MySQL 8.0+ / MariaDB 10.5+ | Relational schema with `utf8mb4` character set |
| **Containerization** | Docker (Multi-stage offline build) | Hermetic container runtime with local MariaDB |

---

## Project Structure

```
Library_Managment_System/
├── backend_lms/               # Backend Express API and gateway
│   ├── controllers/           # Route controllers (userControllers, bookControllers)
│   ├── database/              # Schema DDL (schema.sql) and seeds (seeds.sql)
│   ├── routes/                # Express route definitions (userRoutes, bookRoutes)
│   ├── uploads/               # Uploaded book cover images
│   ├── app.js                 # Express application entrypoint
│   ├── package.json
│   └── .env.example
├── circulation_service/       # Go Circulation & Queue Microservice
│   ├── handler/               # HTTP endpoints (/api/queue/*)
│   ├── models/                # Reservation models with strict JSON struct tags
│   ├── queue/                 # Thread-safe in-memory FIFO queue (sync.RWMutex)
│   ├── main.go                # HTTP daemon entrypoint (:8080)
│   ├── queue_test.go          # Go concurrency & FIFO unit tests
│   └── go.mod
├── lms/                       # Frontend React application (Vite)
│   ├── src/                   # React components, pages, context
│   ├── package.json
│   └── .env.example
├── Dockerfile                 # Multi-stage offline build & test configuration
├── .dockerignore
├── PROPOSAL.md                # FrontierCode evaluation proposal
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher) & **npm**
- **Go** (v1.22 or higher)
- **MySQL Server** (v8.0+) or **MariaDB** (v10.5+)

---

### Database Initialization

1. Start your local MySQL server.
2. Initialize the database schema and sample seed data:
   ```bash
   mysql -u root -p < backend_lms/database/schema.sql
   mysql -u root -p mysql_db < backend_lms/database/seeds.sql
   ```

---

### Starting the Services

#### 1. Start the Go Circulation Microservice
```bash
cd circulation_service
go run main.go
# Microservice listens on http://localhost:8080
```

#### 2. Start the Backend Express API
```bash
cd backend_lms
npm install
cp .env.example .env
# Configure your MySQL credentials in .env
npm start
# API Gateway runs on http://localhost:3000
```

#### 3. Start the Frontend React Client
```bash
cd lms
npm install
cp .env.example .env
npm run dev
# Frontend runs on http://localhost:5173
```

---

## API Endpoints Reference

### 1. Authentication & User Routes (`backend_lms` :3000)
- `POST /api/users/register` — Register a new user account
- `POST /api/users/login` — Authenticate credentials and establish session
- `GET /api/users/me` — Retrieve current authenticated session profile
- `POST /api/users/logout` — Invalidate session and destroy cookie

### 2. Catalog & Circulation Routes (`backend_lms` :3000)
- `GET /api/books/` — Retrieve catalog books
- `POST /api/books/add` — Add a new book (Admin only)
- `PUT /api/books/:id` — Update book details or stock (Admin only)
- `DELETE /api/books/:id` — Delete a book from catalog (Admin only)
- `POST /api/books/borrow/:id` — Borrow an available book
- `POST /api/books/return/:id` — Return a book, calculate late fines, and release holds
- `GET /api/books/mybooks` — List active loans for the current user

### 3. Queue & Hold Endpoints (`circulation_service` :8080)
- `POST /api/queue/reserve` — Enqueue user for a book with 0 available inventory
- `POST /api/queue/dequeue` — Pop top-queued user and transition book to 48-hour hold
- `GET /api/queue/status/:bookId` — Inspect queue length, next in line, and active hold status
- `GET /health` — Service health check

---

## Testing & Offline Verification

### Run Go Unit & Concurrency Tests
```bash
cd circulation_service
go test -v ./...
```

### Run Backend API Integration Tests
```bash
cd backend_lms
npm test
```

### Hermetic Offline Docker Build (`--network none`)
To verify that the complete polyglot application builds and tests 100% offline:
```bash
docker build -t lms-task .
docker run --rm --network none lms-task
```

---

## License

This project is licensed under the **MIT License**.

## Author

**Nakesh Tewari**
- GitHub: [@NakeshTewari](https://github.com/NakeshTewari)
