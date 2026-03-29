import React from "react";
import { useState } from "react";

const BookModal = ({
  book,
  onClose,
  onAddToCart,
  buttonLabel = " Borrow Book",
}) => {
  const [borrowDays, setBorrowDays] = useState(7);
  if (!book) return null;

  console.log("inside book modal", book);

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-[480px] p-5 relative">
     
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-lg font-bold"
        >
          ✕
        </button>

  
        <div className="flex gap-4 mb-4">
          <img
            src={book.image}
            alt="book cover"
            className="w-28 h-40 object-cover rounded"
          />
          <div className="flex flex-col gap-1 flex-1">
            <h2 className="text-base font-bold text-gray-800">{book.name}</h2>
            <p className="text-sm text-gray-400">by {book.author}</p>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-6">
              {book.summary}
            </p>
          </div>
        </div>

        <hr className="border-gray-200 mb-3" />

     
        <div className="flex justify-between text-xs text-gray-600 mb-4">
          <div className="flex flex-col gap-1">
            <p>
              <span className="font-semibold">Genre:</span>{" "}
              {book.genre || "N/A"}
            </p>
            <p>
              <span className="font-semibold">ISBN:</span> {book.isbn}
            </p>
           
          </div>
          <div className="flex flex-col gap-1 text-right">
            <p>
              <span className="font-semibold">Price:</span> ₹
              {book.price || "0.00"}
            </p>
            <p>
              <span className="font-semibold"># in stock:</span>{" "}
              {book.available}
            </p>
          </div>
        </div>

        {!buttonLabel.includes("Return") && (
          <>
            <hr className="border-gray-200 mb-3" />
            <div className="flex gap-3 mb-3">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-xs font-semibold text-gray-600">
                  Borrow Days
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={borrowDays}
                  onChange={(e) => setBorrowDays(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
          </>
        )}

   
        <button
          onClick={() => onAddToCart(book, borrowDays)}
          className="w-full bg-gray-700 hover:bg-gray-800 text-white text-sm py-2 rounded-lg transition"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default BookModal;
