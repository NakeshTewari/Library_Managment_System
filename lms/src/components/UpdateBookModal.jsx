import React from 'react'

const UpdateBookModal = ({ editBook, setEditBook, onUpdate }) => {
   if (!editBook) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[700px] shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-base font-semibold text-gray-700 mb-4">Edit Book</h2>

        <form onSubmit={onUpdate} className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Book Name <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={editBook.name}
              onChange={(e) => setEditBook({ ...editBook, name: e.target.value })}
              placeholder="Book Name"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Author <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={editBook.author}
              onChange={(e) => setEditBook({ ...editBook, author: e.target.value })}
              placeholder="Author"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">ISBN <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={editBook.isbn}
              onChange={(e) => setEditBook({ ...editBook, isbn: e.target.value })}
              placeholder="ISBN"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Genre <span className="text-red-400">*</span></label>
            <select
              value={editBook.genre || ""}
              onChange={(e) => setEditBook({ ...editBook, genre: e.target.value })}
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

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Quantity <span className="text-red-400">*</span></label>
            <input
              type="number"
              value={editBook.quantity}
              onChange={(e) => setEditBook({ ...editBook, quantity: e.target.value })}
              placeholder="Quantity"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Available <span className="text-red-400">*</span></label>
            <input
              type="number"
              value={editBook.available}
              onChange={(e) => setEditBook({ ...editBook, available: e.target.value })}
              placeholder="Available"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Price <span className="text-red-400">*</span></label>
            <input
              type="number"
              value={editBook.price || ""}
              onChange={(e) => setEditBook({ ...editBook, price: e.target.value })}
              placeholder="Price"
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditBook({ ...editBook, newImage: e.target.files[0] })}
              className="text-sm border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {(editBook.newImage || editBook.image) && (
            <div className="col-span-2">
              <img
                src={editBook.newImage ? URL.createObjectURL(editBook.newImage) : editBook.image}
                alt="Book cover"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm text-gray-600">Summary <span className="text-red-400">*</span></label>
            <textarea
              value={editBook.summary || ""}
              onChange={(e) => setEditBook({ ...editBook, summary: e.target.value })}
              placeholder="Book summary..."
              rows={4}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
            />
          </div>

          <div className="col-span-2 flex gap-2 mt-1">
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
  );
}

export default UpdateBookModal
