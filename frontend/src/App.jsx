// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './modules/Home';
import About from './modules/About';
import Contact from './modules/Contact';
import Register from "./components/Register";
import Login from "./components/Login";
import EncryptDecrypt from './modules/EncryptDecrypt';
import Dashboard from './modules/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        
        {/* Main Content Area - Padding top is for fixed navbar */}
        <main className="pt-16"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crypt" element={<EncryptDecrypt />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
