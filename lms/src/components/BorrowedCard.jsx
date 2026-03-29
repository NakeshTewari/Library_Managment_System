import { useState } from "react";
import BookModal from "./BookModal";

const BorrowedCard = ({ book, onReturn, loading }) => {
  const [showModal, setShowModal] = useState(false);
  

  return (
    <>
      <div className="border border-gray-300 rounded-lg w-72 overflow-hidden shadow-sm">
        <div className="flex border-b border-gray-300">
          <img
            src={`${book.image}`}
            alt="book cover"
            className="w-28 h-36 object-cover border-r border-gray-300"
          />

          <div className="flex flex-col flex-1">
            <div className="flex border-b border-gray-300 h-1/2">
              <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-24 shrink-0 flex items-center">
                Book Name
              </p>
              <p className="text-xs text-gray-500 px-3 py-2 flex items-center">
                {book.name}
              </p>
            </div>

            <div className="flex h-1/2">
              <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-24 shrink-0 flex items-center">
                Author
              </p>
              <p className="text-xs text-gray-500 px-3 py-2 flex items-center">
                {book.author}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex border-b border-gray-300">
            <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-28 shrink-0">
              ISBN Number
            </p>
            <p className="text-xs text-gray-500 px-3 py-2">{book.isbn}</p>
          </div>

          <div className="flex border-b border-gray-300">
            <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-28 shrink-0">
              Book Quantity
            </p>
            <p className="text-xs text-gray-500 px-3 py-2">{book.quantity}</p>
          </div>

          <div className="flex border-b border-gray-300">
            <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-28 shrink-0">
              Available Book Quantity
            </p>
            <p className="text-xs text-gray-500 px-3 py-2">{book.available}</p>
          </div>

       
          <button
            onClick={() => setShowModal(true)}
            disabled={loading}
            className="text-xs bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Returning..." : "Return Book"}
          </button>
        </div>
      </div>

      {showModal && (
        <BookModal
          book={book}
          onClose={() => setShowModal(false)}
          buttonLabel="↩️ Confirm Return"
          onAddToCart={(book) => {
            onReturn(book);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default BorrowedCard;
