import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const Login = () => {
  const navigate = useNavigate();

  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const login_response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/login`,
        { email, password },
        { withCredentials: true },
      );

      if (login_response.status === 200) {
        setAlert({ severity: "success", message: login_response.data.message });
        setCurrentUser(login_response.data.user);
        console.log(login_response.data.user);
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      setAlert({
        severity: "error",
        message: error.response?.data?.message || "Login failed. Try again.",
      });
    }
  };

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
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Login Card */}
      <div className="relative z-10 bg-white rounded-xl p-8 w-96 shadow-lg">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Welcome Back
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Login to your library account
        </p>

        <Collapse in={!!alert}>
          {alert && (
            <Alert
              severity={alert.severity}
              onClose={() => setAlert(null)}
              sx={{ mb: 2, fontSize: "0.8rem" }}
            >
              {alert.message}
            </Alert>
          )}
        </Collapse>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          {/* Forgot password */}
          <p className="text-right text-xs text-blue-500 cursor-pointer hover:underline">
            Forgot password?
          </p>

          {/* Login button */}
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Login
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-500 cursor-pointer hover:underline font-medium"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
