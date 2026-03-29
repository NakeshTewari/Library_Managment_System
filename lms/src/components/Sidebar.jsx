import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const Sidebar = () => {
  const { currentUser } = useAuth();

  return (
    <aside className="w-56 min-h-screen flex flex-col p-4 bg-gray-50 border-r border-gray-200">
      <ul className="flex flex-col gap-1">
        {
          currentUser?.role === "admin" ? ( <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition"
          >
             <span className="text-sm font-medium">All Books</span>
          </Link>

          <Link
            to="/addbook"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition"
          >
             <span className="text-sm font-medium">Add Book</span>
          </Link>

          <Link
            to="/adminViewPage"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition"
          >
             <span className="text-sm font-medium">Admin View Page</span>
          </Link>
        </li>

        ):(
          <li>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition"
          >
             <span className="text-sm font-medium">All Books</span>
          </Link>
          <Link
            to="/borrowed"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition"
          >
             <span className="text-sm font-medium">Borrowed Books</span>
          </Link>
        </li>
        )
        }
        
        
        
      </ul>
    </aside>
  );
};

export default Sidebar;
