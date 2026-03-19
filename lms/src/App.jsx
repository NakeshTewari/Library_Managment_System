import "./App.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import AddBook from "./pages/AddBook";

function App() {
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
           <Route path="/addbook" element={<Layout><AddBook /></Layout>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
