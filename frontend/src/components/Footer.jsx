// frontend/src/components/Footer.js

import React from "react";
import { FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import "./Footer.css";
import logo from "./logo.png"; // ✅ since logo.png is directly in src/

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Logo / Brand */}
        <div className="footer-logo">
          <img src={logo} alt="logo "className="footer-logo-img" />
          <h1>
            Picrypt
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="footer-links">
          <a href="/about">About</a>
          <a href="/services">Services</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>

        {/* Social Media with Icons */}
        <div className="footer-social">
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <FaTwitter /> Twitter
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <FaFacebook /> Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <FaInstagram /> Instagram
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Picrypt. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;