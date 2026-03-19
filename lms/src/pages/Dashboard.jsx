import Card from "../components/Card";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const getBooksResponse = async () => {
    const res = await axios.get("http://localhost:3000/api/books/getBooks");
    console.log(res.data);
    setBooks(res.data);
  };

  const getCurrentUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/current_user", {
        withCredentials: true,
      });
      setCurrentUser(res.data.user);
      console.log("Current user:", res.data.user);
    } catch (error) {
      console.log("Error:", error.response.data.message);
    }
  };


  useEffect(() => {
    getBooksResponse();
    getCurrentUser();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/books/deleteBook/${id}`,
        { withCredentials: true },
      );

      if (res.status === 200) {
        alert("Book deleted successfully");
        getBooksResponse();
      }
      
    } catch (error) {
      console.error("Error deleting book:", error);
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
    if (editBook.newImage) formData.append("image", editBook.newImage);

    try {
      const res = await axios.put(
        `http://localhost:3000/api/books/updateBook/${editBook.id}`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message);
      setEditBook(null);
      getBooksResponse();
    } catch (error) {
      console.error("Error updating book:", error);
    }
  };

 
  const handleBorrow = async (book) => {
    console.log(book);
    
    try {
      const res = await axios.post(
        `http://localhost:3000/api/books/borrowBook/${book.id}`,
        {},
        { withCredentials: true }
      );
      alert(res.data.message);
      getBooksResponse();
    } catch (error) {
      alert(error.response.data.message );
    }
  };

  return (
    <div>
      {editBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-base font-semibold text-gray-700 mb-4">
              Edit Book
            </h2>

            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <input
                type="text"
                value={editBook.name}
                onChange={(e) =>
                  setEditBook({ ...editBook, name: e.target.value })
                }
                placeholder="Book Name"
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />

              <input
                type="text"
                value={editBook.author}
                onChange={(e) =>
                  setEditBook({ ...editBook, author: e.target.value })
                }
                placeholder="Author"
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />

              <input
                type="text"
                value={editBook.isbn}
                onChange={(e) =>
                  setEditBook({ ...editBook, isbn: e.target.value })
                }
                placeholder="ISBN"
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />

              <input
                type="number"
                value={editBook.quantity}
                onChange={(e) =>
                  setEditBook({ ...editBook, quantity: e.target.value })
                }
                placeholder="Quantity"
                className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setEditBook({ ...editBook, newImage: e.target.files[0] })
                }
                className="text-sm"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm transition"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={() => setEditBook(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {books.map((book, ind) => (
          <Card
            key={ind}
            book={book}
            onDelete={handleDelete}
            onEdit={handleEdit}
            currentUser={currentUser}
            onBorrow={handleBorrow}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
