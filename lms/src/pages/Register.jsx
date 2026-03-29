import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [alert, setAlert] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      name == "" ||
      email == "" ||
      password == "" ||
      confirmPassword == "" ||
      role == ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const userData = {
      name,
      email,
      password,
      role,
    };

    try {
      const register_response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/users/register`,
        {
          name: name,
          email: email,
          password: password,
          role: role,
        },
      );

      if (register_response.status === 200) {
        setAlert({
          severity: "success",
          message: register_response.data.message,
        });

        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      setAlert({
        severity: "error",
        message: error.response?.data?.message,
      });
      console.log("Registration error:", error);
    }

    console.log("User Data:", userData);
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

      {/* Register Card */}
      <div className="relative z-10 bg-white rounded-xl p-8 w-96 shadow-lg">
        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">
          Create Account
        </h2>
        <p className="text-center text-gray-400 text-sm mb-6">
          Register to access the library
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
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
       
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

 
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

   
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

    
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

       
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-lg px-4 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

      
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition"
          >
            Register
          </button>
        </form>

    
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 cursor-pointer hover:underline font-medium"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
