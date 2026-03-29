import Card from "../components/Card";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import BookModal from "../components/BookModal";
import UpdateBookModal from "../components/UpdateBookModal";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const { currentUser } = useAuth();
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState(null);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [bookToBorrow, setBookToBorrow] = useState(null);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [filterGenre, setFilterGenre] = useState("");

  const getBooksResponse = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/books/getBooks`);
    console.log(res.data);
    setBooks(res.data);
  };

  const getBorrowedBooks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/books/borrowedBooks`,
        { withCredentials: true },
      );
      setBorrowedBooks(res.data);
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
    }
  };

  useEffect(() => {
    getBooksResponse();
    getBorrowedBooks();
  }, []);

  const filteredBooks = books.filter(
    (book) =>
      (book.name.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.isbn.toLowerCase().includes(search.toLowerCase())) &&
      (filterGenre === "" || book.genre?.toLowerCase() === filterGenre),
  );

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/books/deleteBook/${id}`,
        { withCredentials: true },
      );
      if (res.status === 200) {
        setAlert({ severity: "success", message: res.data.message });
        getBooksResponse();
      } else {
        setAlert({ severity: "warning", message: res.data.message });
      }
    } catch (error) {
      console.error("Error deleting book:", error);
    } finally {
      setTimeout(() => setAlert(null), 1500);
    }
  };

  const handleEdit = (book) => {
    setEditBook(book);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", editBook.name);
    formData.append("author", editBook.author);
    formData.append("isbn", editBook.isbn);
    formData.append("quantity", editBook.quantity);
    formData.append("available", editBook.available);
    formData.append("genre", editBook.genre);
    formData.append("summary", editBook.summary);
    formData.append("price", editBook.price);
    if (editBook.newImage) formData.append("image", editBook.newImage);

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/books/updateBook/${editBook.id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (res.status === 200)
        setAlert({ severity: "success", message: res.data.message });
      else setAlert({ severity: "warning", message: res.data.message });
      setEditBook(null);
      getBooksResponse();
    } catch (error) {
      setAlert({ severity: "error", message: error.message });
    } finally {
      setTimeout(() => setAlert(null), 1500);
    }
  };

  const handleBorrow = async (book, borrowDays) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/books/borrowBook/${book.id}`,
        {
          borrowDays,
        },
        { withCredentials: true },
      );
      
      if (res.status === 200)
        setAlert({ severity: "success", message: res.data.message });
      else setAlert({ severity: "warning", message: res.data.message });
      getBooksResponse();
      getBorrowedBooks();
    } catch (error) {
      setAlert({ severity: "error", message: error.response?.data?.message });
    } finally {
      setTimeout(() => setAlert(null), 1500);
    }
  };

  const handleOpenBorrowModal = (book) => {
    const isAlreadyBorrowed = borrowedBooks.some(
      (borrowedBook) => borrowedBook.bookid === book.id,
    );
    if (isAlreadyBorrowed) {
      setAlert({
        severity: "info",
        message: "You have already borrowed this book.",
      });
      setTimeout(() => setAlert(null), 2000);
    } else {
      setBookToBorrow(book);
      setShowBorrowModal(true);
    }
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-96">
        <Collapse in={!!alert}>
          {alert && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(null)}
              sx={{ boxShadow: 4, borderRadius: 2 }}
            >
              {alert.message}
            </Alert>
          )}
        </Collapse>
      </div>

      <div>
        {showBorrowModal && bookToBorrow && (
          <BookModal
            book={bookToBorrow}
            onClose={() => {
              setShowBorrowModal(false);
              setBookToBorrow(null);
            }}
            buttonLabel="Confirm Borrow"
            onAddToCart={(book,borrowDays) => {
              handleBorrow(book,borrowDays);
              setShowBorrowModal(false);
              setBookToBorrow(null);
            }}
          />
        )}

        {editBook && (
          <UpdateBookModal
            editBook={editBook}
            setEditBook={setEditBook}
            onUpdate={handleUpdate}
          />
        )}

        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-72">
            🔍
            <input
              type="text"
              placeholder="Search books by name, author, or ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm text-gray-700 w-full bg-transparent"
            />
          </div>

          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 text-gray-700"
          >
            <option value="">All Genres</option>
            <option value="fiction">Fiction</option>
            <option value="adventure">Adventure</option>
            <option value="fantasy">Fantasy</option>
            <option value="romance">Romance</option>
            <option value="thriller">Thriller</option>
            <option value="mystery">Mystery</option>
            <option value="sci-fi">Sci-Fi</option>
            <option value="horror">Horror</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-6">
          {filteredBooks.map((book, ind) => (
            <Card
              key={ind}
              book={book}
              onDelete={handleDelete}
              onEdit={handleEdit}
              currentUser={currentUser}
              onBorrow={handleOpenBorrowModal}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
