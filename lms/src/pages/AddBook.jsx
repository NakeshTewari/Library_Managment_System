import axios from "axios";
import React from "react";
import { useState } from "react";
const AddBook = () => {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name == "" || author == "" || isbn == "" || quantity == "" || image==null) {
      alert("Please enter all  fields");
      return;
    }

   const formData = new FormData();
   formData.append("name", name);
   formData.append("author", author);
    formData.append("isbn", isbn);
    formData.append("quantity", quantity);
    formData.append("image", image);
    
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/books/addBook",
        formData,
        { withCredentials: true , headers: { "Content-Type": "multipart/form-data" } },
      );

      setName("");
      setAuthor("");
      setIsbn("");
      setQuantity("");
      setImage(null);
      setPreview("");
      alert(res.data.message);

      
      alert("Book added successfully");
      
      setLoading(false);
    } catch (error) {
      if(error.response.status === 403){
        alert("Only admins can add books. Please login with an admin account.");
      }
      setLoading(false);
      console.log("Error:", error);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-6">Add New Book</h2>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Book Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Book Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter book name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Author */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Author <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="author"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* ISBN */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              ISBN Number <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="isbn"
              placeholder="Enter ISBN number"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">
              Quantity <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Image URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Book Cover Image<span className="text-red-400">*</span></label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="border rounded-lg px-4 py-2 text-sm outline-none"
            />
          </div>

          {/* Image preview */}
          {preview && (
            <div className="flex items-center gap-3">
              <img
                src={preview}
                alt="preview"
                className="w-16 h-20 object-cover rounded border"
              />
              <p className="text-xs text-gray-400">Cover preview</p>
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
