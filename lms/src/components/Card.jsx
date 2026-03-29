import React from "react";
import {useState} from 'react';

const Card = ({ book, onDelete,onEdit ,currentUser, onBorrow}) => {

  return (
    <div className="border border-gray-300 rounded-lg w-72 overflow-hidden shadow-sm">

      <div className="flex border-b border-gray-300">

      
        <img
          src={`${book.image}`}
          alt="book cover"
          className="w-28 h-36 object-cover border-r border-gray-300"
        />

     
        <div className="flex flex-col flex-1">

          <div className="flex border-b border-gray-300 h-1/2">
            <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-24 shrink-0 flex items-center">Book Name</p>
            <p className="text-xs text-gray-500 px-3 py-2 flex items-center">{book.name}</p>
          </div>

          <div className="flex h-1/2">
            <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-24 shrink-0 flex items-center">Author</p>
            <p className="text-xs text-gray-500 px-3 py-2 flex items-center">{book.author}</p>
          </div>

        </div>
      </div>


      <div className="flex flex-col">

        <div className="flex border-b border-gray-300">
         
          <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-28 shrink-0">ISBN Number</p>
          <p className="text-xs text-gray-500 px-3 py-2">{book.isbn}</p>
        </div>

        <div className="flex border-b border-gray-300">
          <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-28 shrink-0">Book Quantity</p>
          <p className="text-xs text-gray-500 px-3 py-2">{book.quantity}</p>
        </div>

        <div className="flex">
          <p className="text-xs font-semibold text-gray-700 px-3 py-2 border-r border-gray-300 w-28 shrink-0">Available Book Quantity</p>
          <p className="text-xs text-gray-500 px-3 py-2">{book.available}</p>
        </div>

      </div>


       
      <div className="flex gap-2 p-3">

        {// If role is admin
        currentUser?.role === "admin" ? (
          <>
            <button
              onClick={() => onEdit(book)}
              className="flex-1 text-xs bg-blue-500 hover:bg-blue-600 text-white py-1.5 rounded-lg transition"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(book.id)}
              className="flex-1 text-xs bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-lg transition"
            >
              Delete
            </button>
          </>
        ) : (
          // If role is user
          <button
            onClick={() => onBorrow(book)}
            disabled={book.available === 0}
            className="flex-1 text-xs bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {book.available === 0 ? "Not Available" : "Borrow"}
          </button>
        )}

      </div>
    </div>
  );
};

export default Card;
