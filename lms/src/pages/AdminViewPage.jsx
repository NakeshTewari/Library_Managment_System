import React, { useState, useEffect } from "react";
import axios from "axios";
import Allborrowedbooks from "../components/Allborrowedbooks.jsx";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const AdminViewPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [alert, setAlert] = useState(null);

  const applyDateFilter = (book) => {
    const borrowedDate = new Date(book.borrowed_at);
    const today = new Date();

    if (dateFilter === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(today.getDate() - 7);
      return borrowedDate >= weekAgo;
    }

    if (dateFilter === "today") {
      return borrowedDate.toDateString() === today.toDateString();
    }
    return true;
  };

  const getallBorrowedBooks = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/books/allborrowedBooks`,
        { withCredentials: true },
      );
      console.log(res.data);
      setBooks(res.data);
    } catch (err) {
      setAlert({ severity: "error", message: error.message });
    } finally {
      setTimeout(() => setAlert(null), setLoading(false), 1500);
    }
  };

  useEffect(() => {
    getallBorrowedBooks();
  }, []);

 
  const dateFilteredBooks = books.filter(applyDateFilter);

  
  const totalBooksBorrowed = dateFilteredBooks.length;
  const uniqueStudents = new Set(dateFilteredBooks.map((book) => book.username))
    .size;
  const overDueBooksCount = dateFilteredBooks.filter((book) => {
    const dueDate = new Date(book.due_date);
    return new Date() > dueDate;
  }).length;

 
  const filteredBooks = dateFilteredBooks.filter(
    (book) =>
      book.username?.toLowerCase().includes(search.toLowerCase()) ||
      book.bookname?.toLowerCase().includes(search.toLowerCase()) ||
      book.author?.toLowerCase().includes(search.toLowerCase()),
  );

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

      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
      
        <div className="flex items-center gap-3 mb-4">
      
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-72">
            🔍
            <input
              type="text"
              placeholder="Search books by Username, Bookname..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm text-gray-700 w-full bg-transparent"
            />
          </div>

   
          <div className="flex items-center gap-2">
            {["all", "today", "week"].map((filter) => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
                  ${
                    dateFilter === filter
                      ? "bg-indigo-600 text-white"
                      : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {filter === "all" && "All Time"}
                {filter === "today" && "Today"}
                {filter === "week" && "This Week"}
              </button>
            ))}
          </div>
        </div>

      
        {!loading && (
          <div className="grid grid-cols-4 gap-4">
            {/* Total Books Borrowed */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Total Borrowed
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {totalBooksBorrowed}
                  </p>
                </div>
              </div>
            </div>

     
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Unique Students
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {uniqueStudents}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">
                    Overdue Books
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {overDueBooksCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
      
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Borrowed Books</h1>
            <p className="text-sm text-gray-500 mt-1">
              All currently borrowed books by students
            </p>
          </div>

          <div className="bg-indigo-600 text-white rounded-t-xl px-6 py-3 flex text-sm font-semibold uppercase tracking-wide">
            <span className="flex-1">Username</span>
            <span className="flex-1">Book Name</span>
            <span className="flex-1">Author</span>
            <span className="flex-1">Borrowed At</span>
            <span className="flex-1">Due Date</span>
          </div>

          <div className="bg-white rounded-b-xl shadow divide-y divide-gray-100">
            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading...</div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                No borrowed books found.
              </div>
            ) : (
              filteredBooks.map((book, ind) => (
                <Allborrowedbooks key={ind} book={book} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminViewPage;
