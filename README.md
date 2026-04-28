# Library Management System

A comprehensive web-based library management system built with JavaScript that enables efficient management of books, users, and library operations. Powered by Gemini AI for intelligent search and recommendations.

**Live Demo:** [https://library-managment-system-sable.vercel.app](https://library-managment-system-sable.vercel.app)

## Overview

This Library Management System is a full-stack application designed to streamline library operations including book cataloging, inventory management, user management, and circulation workflows. It integrates Google's Gemini AI API to provide intelligent book recommendations and enhanced search capabilities.

## Features

- 📚 **Book Management**: Add, update, and delete books from the library catalog
- 👥 **User Management**: Manage library members and their profiles
- 🔄 **Circulation Management**: Track book checkouts, returns, and due dates
- 🔍 **Search & Filter**: Easily find books by title, author, ISBN, or category
- 🤖 **AI-Powered Recommendations**: Gemini AI provides personalized book recommendations based on user preferences
- 💡 **Intelligent Search**: Natural language search queries using Gemini AI for better results
- 📊 **Inventory Tracking**: Monitor book availability and stock levels
- 📈 **Reports**: Generate library statistics and circulation reports
- 🔐 **Authentication**: Secure user login and role-based access control

## Tech Stack

- **Frontend**: JavaScript, HTML5, CSS3
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (or your database choice)
- **AI Integration**: Google Gemini AI API
- **Deployment**: Vercel

## Project Structure

```
Library_Managment_System/
├── backend_lms/          # Backend API and server logic
├── lms/                  # Frontend application
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for local development)
- Google Gemini AI API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NakeshTewari/Library_Managment_System.git
   cd Library_Managment_System
   ```

2. **Install dependencies for backend:**
   ```bash
   cd backend_lms
   npm install
   ```

3. **Install dependencies for frontend:**
   ```bash
   cd ../lms
   npm install
   ```

### Configuration

1. Create a `.env` file in the `backend_lms` directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/library_management
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=development
   ```

2. Create a `.env` file in the `lms` directory if needed for frontend API endpoints.

### Gemini AI API Setup

1. **Get your API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create or select an existing Google Cloud project
   - Enable the Generative Language API
   - Generate an API key and add it to your `.env` file

2. **Install Gemini SDK:**
   ```bash
   npm install @google/generative-ai
   ```

### Running the Application

**Start the backend server:**
```bash
cd backend_lms
npm start
```

**Start the frontend development server (in a new terminal):**
```bash
cd lms
npm start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Sign Up/Login**: Create a new account or login with existing credentials
2. **Browse Books**: Navigate through the catalog and view book details
3. **Manage Books**: (Admin only) Add new books, update information, or remove books
4. **Checkout Books**: Select books and complete the checkout process
5. **Return Books**: Return books and view return status
6. **View History**: Check your borrowing history and due dates
7. **Get AI Recommendations**: Receive personalized book recommendations powered by Gemini AI
8. **AI-Powered Search**: Use natural language to search for books with intelligent results

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Books
- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Add new book (Admin)
- `PUT /api/books/:id` - Update book (Admin)
- `DELETE /api/books/:id` - Delete book (Admin)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile

### Transactions
- `POST /api/transactions/checkout` - Checkout a book
- `POST /api/transactions/return` - Return a book
- `GET /api/transactions/history` - View transaction history

### AI Features (Gemini API)
- `POST /api/ai/recommendations` - Get personalized book recommendations
- `POST /api/ai/search` - Perform intelligent book search using natural language
- `POST /api/ai/suggest` - Get suggestions based on reading history

## Gemini AI Integration

The Library Management System uses Google's Gemini AI API to enhance user experience:

- **Book Recommendations**: Analyzes user reading history and preferences to suggest relevant books
- **Natural Language Search**: Converts natural language queries into precise book searches
- **Content Summary**: Generates book summaries and reviews
- **Smart Suggestions**: Recommends books based on categories, genres, and user behavior

For more information about Gemini AI, visit [Google AI](https://ai.google.dev/).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is currently unlicensed. Feel free to add a license of your choice.

## Support

For support, please open an issue on the [GitHub Issues](https://github.com/NakeshTewari/Library_Managment_System/issues) page.

## Author

**Nakesh Tewari**
- GitHub: [@NakeshTewari](https://github.com/NakeshTewari)

## Project Status

Active development - Currently maintained and regularly updated.

---

**Last Updated:** April 28, 2026
