// frontend/src/components/Login.jsx

import { useState, useEffect, useRef, memo } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import axios from "axios";

import { ENDPOINTS } from "../utils/api";

const API_BASE = ENDPOINTS.AUTH;

function parseJwt(token) {
  // Basic JWT payload parsing without external libs (no signature verify)
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(
      decodeURIComponent(
        decoded
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      )
    );
  } catch (_e) {
    return null;
  }
}

/**
 * CyberGridBackground:
 * Subtle cybersecurity animated background featuring a radial dark backdrop,
 * perspective floor grid scrolling toward the viewer, horizontal glowing scan line,
 * and drifting network nodes with connection lines.
 */
const CyberGridBackground = memo(() => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = null;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 30 small drifting network nodes (1.5 to 2.5 px, #67e8f9 or #38bdf8)
    const NODE_COUNT = 30;
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      radius: Math.random() * 1.0 + 1.5,
      color: Math.random() > 0.5 ? "#67e8f9" : "#38bdf8",
    }));

    let gridOffset = 0;
    let scanY = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Radial gradient background from #0c1629 at center to #050a16 at edges
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      bgGrad.addColorStop(0, "#0c1629");
      bgGrad.addColorStop(1, "#050a16");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Perspective Floor Grid scrolling toward the viewer
      const horizonY = height * 0.44;
      const floorH = height - horizonY;

      // Radial perspective lines from vanishing point
      const radGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      radGrad.addColorStop(0, "rgba(103, 232, 249, 0)");
      radGrad.addColorStop(0.35, "rgba(103, 232, 249, 0.04)");
      radGrad.addColorStop(1, "rgba(103, 232, 249, 0.12)");
      ctx.strokeStyle = radGrad;
      ctx.lineWidth = 1;

      const numRadials = 28;
      for (let i = -numRadials / 2; i <= numRadials / 2; i++) {
        const bottomX = width * 0.5 + i * (width * 0.075);
        ctx.beginPath();
        ctx.moveTo(width * 0.5, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      // Horizontal grid lines scrolling toward the viewer, fading toward horizon
      if (!prefersReducedMotion) {
        gridOffset = (gridOffset + 0.004) % 1;
      }
      const numTransverse = 15;
      for (let k = 0; k <= numTransverse; k++) {
        const d = (k + gridOffset) / numTransverse;
        if (d <= 0.02) continue;
        const y = horizonY + floorH * Math.pow(d, 2.3);
        const alpha = Math.min(0.12, 0.12 * Math.pow(d, 1.8));

        ctx.strokeStyle = `rgba(103, 232, 249, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Network nodes drifting + thin lines closer than 140px
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 140 * 140) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 140) * 0.15;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.lineWidth = 0.9;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        if (!prefersReducedMotion) {
          node.x += node.vx;
          node.y += node.vy;
          if (node.x < 0) node.x = width;
          if (node.x > width) node.x = 0;
          if (node.y < 0) node.y = height;
          if (node.y > height) node.y = 0;
        }

        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Horizontal scan line with soft glow (shadowBlur: 12)
      if (!prefersReducedMotion) {
        scanY = (scanY + 1.2) % height;
      }
      ctx.save();
      ctx.shadowColor = "rgba(103, 232, 249, 0.75)";
      ctx.shadowBlur = 12;
      ctx.strokeStyle = "rgba(103, 232, 249, 0.35)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.stroke();
      ctx.restore();
    };

    const render = () => {
      drawFrame();
      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
});

CyberGridBackground.displayName = "CyberGridBackground";

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
      const res = await axios.post(
        `${API_BASE}/token/`,
        {
          username: credential,
          password: password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { access: access_token, refresh: refresh_token, user } = res.data;

      localStorage.setItem("access_token", access_token);
      if (refresh_token) localStorage.setItem("refresh_token", refresh_token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        const payload = parseJwt(access_token);
        if (payload) {
          const u = { username: payload.username || payload.user_id || "" };
          localStorage.setItem("user", JSON.stringify(u));
        }
      }

      setMessage("Login successful - redirecting...");
      setError("");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 900);
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      const serverMsg =
        err.response?.data?.detail ||
        err.response?.data ||
        "Login failed. Check credentials.";
      setError(
        typeof serverMsg === "string" ? serverMsg : JSON.stringify(serverMsg)
      );
      setMessage("");
    } finally {
      setLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center py-10 sm:py-16 px-4 relative overflow-hidden">
      <CyberGridBackground />
      <div className="relative z-10 w-full max-w-md p-6 sm:p-8 space-y-6 bg-[#0c1629]/90 border border-cyan-500/30 shadow-[0_15px_45px_rgba(0,0,0,0.7)] rounded-2xl backdrop-blur-xl text-white">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            SECURE ACCESS // PORTAL
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Sign in to PICRYPT
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Enter your credentials to access encrypted steganography features
          </p>
        </div>

        {message && (
          <div className="p-3 text-sm text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-xl font-mono">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 text-sm text-red-300 bg-red-950/60 border border-red-500/30 rounded-xl font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300">
              Email ID
            </label>
            <input
              type="text"
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-[#070e1c] border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-[#070e1c] border border-cyan-500/30 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm uppercase tracking-wider shadow-md transition-all cursor-pointer ${
              loading
                ? "bg-slate-700/60 border border-slate-600 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] hover:shadow-[0_0_28px_rgba(6,182,212,0.55)]"
            }`}
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-400 pt-2 border-t border-cyan-500/15">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
