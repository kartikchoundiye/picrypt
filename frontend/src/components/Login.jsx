// frontend/src/components/Login.jsx

import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";

// const API_BASE = "http://localhost:8000/api/auth";

const API_BASE = (() => {
  if (window.location.hostname === "localhost") return "http://localhost:8000/api/auth";
  // if (window.location.hostname.startsWith("192.168.")) return `http://${window.location.hostname}:8000/api/auth`;
  if (window.location.hostname.startsWith("192.168.")) return `http://192.168.43.38:8000/api/auth`;
  // TODO: replace with actual backend domain after deployment
  return "https://your-production-backend.com/api/auth";
})();

function parseJwt(token) {
  // Basic JWT payload parsing without external libs (no signature verify)
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(
      decoded.split("").map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join("")
    ));
  } catch (e) {
    return null;
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // If already logged in, redirect to home
  const token = localStorage.getItem("access_token");
  if (token) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      // Simple: send username field as credential (your backend expects username==email)
      const res = await axios.post(`${API_BASE}/token/`, {
        username: credential,
        password: password,
      }, {
        headers: { "Content-Type": "application/json" }
      });

      // expected res.data: { access: '...', refresh: '...', user: {...} } (MyTokenObtainPairSerializer returns user)
      const { access: access_token, refresh: refresh_token, user } = res.data;

      // store tokens & user
      localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

      // if backend returned user info, store it; otherwise parse access token
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        const payload = parseJwt(access_token);
        if (payload) {
          const u = { username: payload.username || payload.user_id || "" };
          localStorage.setItem("user", JSON.stringify(u));
        }
      }

      setMessage("Login successful — redirecting...");
      setError("");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 900);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.detail || err.response?.data || "Login failed. Check credentials.";
      setError(typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg));
      setMessage("");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen pt-20 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-200">

        <h2 className="text-2xl font-bold text-teal-600 text-center mb-4">Sign in to PICRYPT</h2>

        {message && <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg">{message}</div>}
        {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email ID </label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium shadow-md ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-center text-sm text-gray-600">
          Don't have an account ? <Link to="/register" className="text-teal-600 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
}

