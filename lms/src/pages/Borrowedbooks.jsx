import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import BorrowedCard from "../components/BorrowedCard";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const Borrowedbooks = () => {
  const [books, setBooks] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  console.log("inside borrowed books");

  const getBorrowedBooks = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/books/borrowedBooks`,
      {
        withCredentials: true,
      },
    );

    console.log("borrowed books", res.data);

    setBooks(res.data);
  };

  const handleReturnBooks = async (book) => {
    setLoadingId(book.bookid);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/books/returnBook/${book.bookid}`,
        {},
        { withCredentials: true },
      );

      if (res.status === 200)
        setAlert({ severity: "success", message: res.data.message });
      else setAlert({ severity: "warning", message: res.data.message });
      setTimeout(() => {
        setAlert(null);
        setBooks((prev) => prev.filter((b) => b.bookid !== book.bookid));
      }, 1500);
    } catch (error) {
      setAlert({
        severity: "error",
        message: error.response?.data?.message || "Failed to return book.",
      });
      setTimeout(() => setAlert(null), 1500);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    getBorrowedBooks();
  }, []);

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-96">
        <Collapse in={!!alert}>
          {alert && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(null)}
              sx={{ boxShadow: 3 }}
            >
              {alert.message}
            </Alert>
          )}
        </Collapse>
      </div>
      <div className="flex flex-wrap gap-6">
        {books.map((book, ind) => (
          <BorrowedCard
            key={ind}
            book={book}
            onReturn={handleReturnBooks}
            loading={loadingId === book.bookid}
          />
        ))}
      </div>
    </>
  );
};

export default Borrowedbooks;
