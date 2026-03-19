import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import userImage from "../assets/pngegg.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  useEffect(() => {
    const current_user = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/users/current_user",
          {
            withCredentials: true,
          },
        );
        console.log("User data:", res.data.user);
        setUser(res.data.user);
      } catch (error) {
        console.log("Error:", error.response.data.message);
      }
    };
    current_user();
  }, []);

  return (
    <nav className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <h1 className="text-lg font-bold text-gray-800">
        📚 Library Management System
      </h1>

      {/*  User image + name */}
      <div className="flex items-center gap-3">
        <img
          src={userImage}
          alt="user"
          className="w-9 h-9 rounded-full border border-gray-300"
        />

        {/* Username */}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">
            {user?.name}
          </span>
          <span className="text-xs text-gray-400">{user?.role}</span>
        </div>

        {/* Logout button */}
        <button
          onClick={() => navigate("/")}
          className="ml-2 text-sm text-red-500 hover:text-red-700 border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
