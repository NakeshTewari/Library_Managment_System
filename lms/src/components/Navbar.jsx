import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import userImage from "../assets/pngegg.png";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useAuth();
  const [alert, setAlert] = useState(null);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/logout`,
        {},
        { withCredentials: true },
      );
      setCurrentUser(null);
      localStorage.setItem("logout-event", Date.now()); // Signal to other tabs

      navigate("/login");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };
  return (
    <>
     
      <nav className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">
          📚 Library Management System
        </h1>

        <div className="flex items-center gap-3">
          <img
            src={userImage}
            alt="user"
            className="w-9 h-9 rounded-full border border-gray-300"
          />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {currentUser?.name}
            </span>
            <span className="text-xs text-gray-400">{currentUser?.role}</span>
          </div>

      
          <button
            onClick={handleLogout}
            className="ml-2 text-sm text-red-500 hover:text-red-700 border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
