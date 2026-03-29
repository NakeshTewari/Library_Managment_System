import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import AddBook from "./pages/AddBook";
import Borrowedbooks from "./pages/Borrowedbooks";
import AdminViewPage from "./pages/AdminViewPage";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/borrowed"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Borrowedbooks />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/addbook"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AddBook />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/adminViewPage"
              element={
                <ProtectedRoute>
                  <Layout>
                    <AdminViewPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
