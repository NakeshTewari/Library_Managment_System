import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Home = () => {
  // const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1600')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl font-bold text-white leading-tight mb-4">
          <span className="text-yellow-400">Library Management System</span>
        </h1>

        <p className="text-white text-lg mb-8 max-w-xl mx-auto">
          "A reader lives a thousand lives before he dies." — George R.R. Martin
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/login">
            <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium transition">
              🔑 Login
            </button>
          </Link>

          <Link to="/register">
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-md text-lg font-medium transition">
              📝 Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
