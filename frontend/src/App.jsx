// frontend/src/App.jsx

// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './modules/Home';
import About from './modules/About';
import Contact from './modules/Contact';
import Register from "./components/Register";
import Login from "./components/Login";
import EncryptDecrypt from './modules/EncryptDecrypt';
import Dashboard from './modules/Dashboard';
import Profile from './modules/Profile';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        
        {/* Main Content Area - Padding top is for fixed navbar */}
        <main className="pt-16 flex-grow"> 
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crypt" element={<EncryptDecrypt />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Profile defaultTab="logs" />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
