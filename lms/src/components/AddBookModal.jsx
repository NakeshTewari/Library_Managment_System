import React from "react";
import axios from "axios";
import { useState } from "react";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const AddBookModal = ({ book, onClose }) => {
  const b = book.volumeInfo;

  const [title, setTitle] = useState(b.title || "");
  const [author, setAuthor] = useState(b.authors?.[0] || "");
  const [genre, setGenre] = useState(b.categories?.[0] || "");
  const [summary, setSummary] = useState(b.description || "");
  const [isbn, setIsbn] = useState(
    b.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier ||
      b.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier ||
      b.industryIdentifiers?.[0]?.identifier ||
      "",
  );
  const [price, setPrice] = useState(book.saleInfo?.listPrice?.amount || "");
  const [quantity, setQuantity] = useState("");
  const [imageUrl, setImageUrl] = useState(b.imageLinks?.thumbnail || "");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const maxChars = 1500;

  const handleSubmit = async () => {
    if (
      !title ||
      !author ||
      !isbn ||
      !quantity ||
      !imageUrl ||
      !genre ||
      !summary ||
      !price
    ) {
      alert("Please fill all required fields");
      return;
    }

    if (summary.length > 1500) {
      alert("Summary must be less than 1500 characters");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", title);
      formData.append("author", author);
      formData.append("isbn", isbn);
      formData.append("quantity", quantity);
      formData.append("genre", genre);
      formData.append("summary", summary);
      formData.append("price", price);
      formData.append("image", imageUrl);

      const res = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/books/addBook`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.status === 200)
        setAlert({ severity: "success", message: res.data.message });
      else setAlert({ severity: "warning", message: res.data.message });

      onClose();
    } catch (error) {
      setAlert({ severity: "error", message: error.message });

      console.log("Error:", error);
    } finally {
      setTimeout(() => setAlert(null), setLoading(false), 1500);
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
      <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 p-6 relative max-h-[90vh] overflow-y-auto">
   
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Add book</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl font-bold"
            >
              ✕
            </button>
          </div>

    
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Author <span className="text-red-400">*</span>
              </label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Genre <span className="text-red-400">*</span>
              </label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 bg-white"
              >
                <option value="">Select a genre</option>
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
          </div>

      
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-sm text-gray-600">
              Short Summary <span className="text-red-400">*</span>
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value.slice(0, maxChars))}
              rows={4}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
            />
            <p className="text-xs text-gray-400">
              Characters: {summary.length} / {maxChars}
            </p>
          </div>

        
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                ISBN (10 or 13 digits) <span className="text-red-400">*</span>
              </label>
              <input
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Price <span className="text-red-400">*</span>
              </label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600">
                Quantity in Stock <span className="text-red-400">*</span>
              </label>
              <input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                min="1"
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
              />
            </div>
          </div>

     
          <div className="flex flex-col gap-1 mb-2">
            <label className="text-sm text-gray-600">
              Image URL <span className="text-red-400">*</span> (must end in
              '.jpg', '.jpeg', or '.png')
            </label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

   
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddBookModal;
