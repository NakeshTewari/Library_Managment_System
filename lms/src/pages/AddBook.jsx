import Button from "@mui/material/Button";
import axios from "axios";
import React from "react";
import { useState } from "react";
import BookResults from "../components/BookResults";
import AddBookModal from "../components/AddBookModal";


const AddBook = () => {
 
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
   const [selectedBook, setSelectedBook] = useState(null);
   const [showModal, setShowModal] = useState(false); 
 
    

  const handleSearch = async () => {
    const res = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${import.meta.env.VITE_GOOGLE_BOOK_API_KEY}&maxResults=10&langRestrict=en`,
    );
    setResults(res.data.items);
    console.log(res.data.items);
  };

   const handleAddToCatalog = (book) => {
    // console.log(book);
    setSelectedBook(book);
    setShowModal(true);
  };


  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-6">
        Add New Book by using Google Book API
      </h2>

       <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-3 py-2 w-72">
          🔍
          <input
            type="text"
            placeholder="Search books by Book Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="outline-none text-sm text-gray-700 w-full bg-transparent"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Search
        </button>
      </div>

      {/* ✅ Search Results */}
      {results.length > 0 && (
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Search Results (most relevant result shown first)
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {results.map((book, index) => (
              <BookResults
                key={book.id}
                book={book}
                 onAddToCatalog={handleAddToCatalog}
              />
            ))}
          </div>
        </div>
      )}


       {showModal && selectedBook && (
        <AddBookModal
          book={selectedBook}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  
  );
};

export default AddBook;

//  <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 max-w-lg">
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           {/* Book Name */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-600">
//               Book Name <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Enter book name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
//             />
//           </div>

//           {/* Author */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-600">
//               Author <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="author"
//               placeholder="Enter author name"
//               value={author}
//               onChange={(e) => setAuthor(e.target.value)}
//               className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
//             />
//           </div>

//           {/* ISBN */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-600">
//               ISBN Number <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="text"
//               name="isbn"
//               placeholder="Enter ISBN number"
//               value={isbn}
//               onChange={(e) => setIsbn(e.target.value)}
//               className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
//             />
//           </div>

//           {/* Quantity */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-600">
//               Quantity <span className="text-red-400">*</span>
//             </label>
//             <input
//               type="number"
//               name="quantity"
//               placeholder="Enter quantity"
//               value={quantity}
//               onChange={(e) => setQuantity(e.target.value)}
//               min="1"
//               className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
//             />
//           </div>

//           {/* Image URL */}
//           <div className="flex flex-col gap-1">
//             <label className="text-sm text-gray-600">
//               Book Cover Image<span className="text-red-400">*</span>
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleImage}
//               className="border rounded-lg px-4 py-2 text-sm outline-none"
//             />
//           </div>

//           {/* Image preview */}
//           {preview && (
//             <div className="flex items-center gap-3">
//               <img
//                 src={preview}
//                 alt="preview"
//                 className="w-16 h-20 object-cover rounded border"
//               />
//               <p className="text-xs text-gray-400">Cover preview</p>
//             </div>
//           )}

//           {/* Submit button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
//           >
//             {loading ? "Adding..." : "Add Book"}
//           </button>
//         </form>
//       </div>



//  const handleImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       name == "" ||
//       author == "" ||
//       isbn == "" ||
//       quantity == "" ||
//       image == null
//     ) {
//       alert("Please enter all  fields");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("author", author);
//     formData.append("isbn", isbn);
//     formData.append("quantity", quantity);
//     formData.append("image", image);

//     try {
//       setLoading(true);
//       const res = await axios.post(
//         "http://localhost:3000/api/books/addBook",
//         formData,
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "multipart/form-data" },
//         },
//       );

//       setName("");
//       setAuthor("");
//       setIsbn("");
//       setQuantity("");
//       setImage(null);
//       setPreview("");

//       alert("Book added successfully");

//       setLoading(false);
//     } catch (error) {
//       if (error.response.status === 403) {
//         alert("Only admins can add books. Please login with an admin account.");
//       }
//       setLoading(false);
//       console.log("Error:", error);
//     }
//   };


//  const [name, setName] = useState("");
//   const [author, setAuthor] = useState("");
//   const [isbn, setIsbn] = useState("");
//   const [quantity, setQuantity] = useState("");
//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   const [loading, setLoading] = useState(false);