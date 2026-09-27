# Library Management System

A comprehensive web-based library management system built with JavaScript that enables efficient management of books, users, and library operations.

---

## Overview

This Library Management System is a full-stack application designed to streamline library operations including book cataloging, inventory management, user management, and circulation workflows.

## Features

- 📚 **Book Management**: Add, update, and delete books from the library catalog
- 👥 **User Management**: Manage library members and authentication sessions
- 🔄 **Circulation Management**: Track book checkouts, returns, due dates, and fine calculations
- 🔍 **Search & Filter**: Search books by title, author, ISBN, or genre
- 📊 **Inventory Tracking**: Monitor book availability and stock levels
- 🔐 **Session Authentication**: Secure user login with cookie-based session management (`express-mysql-session`)

## Tech Stack

- **Frontend**: React, Vite, TailwindCSS, Axios, Material UI
- **Backend**: Node.js, Express.js
- **Database**: MySQL / MariaDB (with `utf8mb4` character set)
- **Deployment**: Vercel

---

## Project Structure

```
Library_Managment_System/
├── backend_lms/          # Backend Express API and server logic
│   ├── controllers/      # Route controllers (user, book, auth)
│   ├── database/         # Schema DDL (schema.sql) and seeds (seeds.sql)
│   ├── routes/           # Express route definitions
│   ├── app.js            # Express application entrypoint
│   └── package.json
├── lms/                  # Frontend React application (Vite)
│   ├── src/              # React components, pages, context
│   └── package.json
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL Server (v8.0+) or MariaDB (v10.5+)

### Database Setup

1. Start your local MySQL server.
2. Initialize the database schema and sample data:
   ```bash
   mysql -u root -p < backend_lms/database/schema.sql
   mysql -u root -p mysql_db < backend_lms/database/seeds.sql
   ```

### Backend Installation & Start

1. Navigate to the backend directory:
   ```bash
   cd backend_lms
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   # Update .env with your MySQL credentials
   ```
3. Start the server:
   ```bash
   npm start
   # Server runs on http://localhost:3000
   ```

### Frontend Installation & Start

1. In a new terminal, navigate to the frontend directory:
   ```bash
   cd lms
   npm install
   ```
2. Copy environment template:
   ```bash
   cp .env.example .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

---

## API Endpoints

### Authentication & Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - User login & create session
- `GET /api/users/me` - Get authenticated user profile
- `POST /api/users/logout` - Destroy session & clear cookie

### Books & Circulation
- `GET /api/books/` - Get all catalog books
- `POST /api/books/add` - Add a new book (Admin)
- `PUT /api/books/:id` - Update book information (Admin)
- `DELETE /api/books/:id` - Remove book (Admin)
- `POST /api/books/borrow/:id` - Borrow a book
- `POST /api/books/return/:id` - Return a book & calculate late fines
- `GET /api/books/mybooks` - Get list of books borrowed by current user

---

## Testing & Quality

Run backend tests:
```bash
cd backend_lms
npm test
```

---

## Author

**Nakesh Tewari**
- GitHub: [@NakeshTewari](https://github.com/NakeshTewari)
