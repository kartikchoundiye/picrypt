// frontend/src/modules/About.jsx

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileCode,
  FaFileAlt,
  FaDatabase,
  FaChevronDown,
} from "react-icons/fa";

/**
 * PICRYPT — ABOUT PAGE (PREMIUM CYBERSECURITY REDESIGN)
 *
 * Enhanced Border Lighting System:
 * 1. Continuous 360° Flowing Liquid Conic-Gradient Neon Aura Rim
 * 2. Dual Counter-Traveling Pulsing Laser Beams (Clockwise & Counter-Clockwise intersecting)
 * 3. Rhythmic Breathing Perimeter Track Glow
 * 4. Animated Cyber Corner Brackets with Luminous Glow
 * 5. 6 Unique Individual Category Animations inside Cards
 */

const CATEGORIES = [
  {
    title: "Image Data",
    icon: FaFileImage,
    extensions: [".png", ".jpeg", ".jpg"],
    accent: "#00D9F5",
    accentSecondary: "#398BFF",
    glowColor: "rgba(0, 217, 245, 0.45)",
    tag: "VISUAL_CARRIER",
    palette: ["#00D9F5", "#398BFF", "#06B6D4", "#22D3EE"],
  },
  {
    title: "Video Data",
    icon: FaFileVideo,
    extensions: [".mp4", ".mov", ".avi", ".mkv"],
    accent: "#ED63CE",
    accentSecondary: "#F43F5E",
    glowColor: "rgba(237, 99, 206, 0.45)",
    tag: "STREAM_PAYLOAD",
    palette: ["#ED63CE", "#F43F5E", "#FB7185", "#E11D48"],
  },
  {
    title: "Audio Data",
    icon: FaFileAudio,
    extensions: [".mp3", ".wav", ".ogg", ".wma"],
    accent: "#9065F5",
    accentSecondary: "#A855F7",
    glowColor: "rgba(144, 101, 245, 0.45)",
    tag: "ACOUSTIC_CIPHER",
    palette: ["#9065F5", "#A855F7", "#C084FC", "#7C3AED"],
  },
  {
    title: "Program Files",
    icon: FaFileCode,
    extensions: [".c", ".java", ".py", ".jsx", ".js"],
    accent: "#00D6A0",
    accentSecondary: "#10B981",
    glowColor: "rgba(0, 214, 160, 0.45)",
    tag: "BINARY_SOURCE",
    palette: ["#00D6A0", "#10B981", "#34D399", "#059669"],
  },
  {
    title: "Documents",
    icon: FaFileAlt,
    extensions: [".doc", ".txt", ".xlsx"],
    accent: "#F59E0B",
    accentSecondary: "#F97316",
    glowColor: "rgba(245, 158, 11, 0.45)",
    tag: "DOCUMENT_ARCHIVE",
    palette: ["#F59E0B", "#F97316", "#FBBF24", "#EA580C"],
  },
  {
    title: "Database / Data Files",
    icon: FaDatabase,
    extensions: [".xml", ".db", ".sql", ".sqlite", ".json"],
    accent: "#38BDF8",
    accentSecondary: "#6366F1",
    glowColor: "rgba(56, 189, 248, 0.45)",
    tag: "STRUCTURED_STORAGE",
    palette: ["#38BDF8", "#6366F1", "#3B82F6", "#0284C7"],
  },
];

const PARTICLES = [
  { size: 3, top: "14%", left: "8%", color: "#00D9F5", dur: "4.5s", delay: "0s" },
  { size: 4, top: "22%", left: "88%", color: "#398BFF", dur: "5.2s", delay: "1.2s" },
  { size: 2.5, top: "48%", left: "5%", color: "#9065F5", dur: "4.8s", delay: "0.6s" },
  { size: 3.5, top: "62%", left: "94%", color: "#00D6A0", dur: "5.5s", delay: "1.8s" },
  { size: 3, top: "80%", left: "12%", color: "#ED63CE", dur: "4.2s", delay: "2.4s" },
  { size: 2.5, top: "86%", left: "82%", color: "#00D9F5", dur: "5.0s", delay: "1.0s" },
];

const About = () => {
  // Independent View More / View Less state for each category card
  const [expandedCards, setExpandedCards] = useState({});

  const toggleCardExpand = (idx, e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    setExpandedCards((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  return (
    <div className="cyber-about-root relative w-full bg-[#070D1A] text-[#F1F5FF] overflow-hidden pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* ── EMBEDDED SCOPED STYLES ── */}
      <style>{`
        .cyber-about-root {
          background-color: #070D1A !important;
        }

        /* ── UNIQUE ANIMATED PROTOCOL BADGE BOX ── */
        .about-protocol-pill {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.5rem 1.25rem;
          background: linear-gradient(135deg, rgba(13, 27, 51, 0.92) 0%, rgba(7, 14, 28, 0.97) 100%);
          border-radius: 9999px;
          border: 1px solid rgba(0, 217, 245, 0.25);
          color: #00D9F5;
          font-family: monospace;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 0 20px rgba(0, 217, 245, 0.2), inset 0 0 10px rgba(0, 217, 245, 0.1);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .about-protocol-pill:hover {
          transform: translateY(-2px) scale(1.03);
          border-color: #00D9F5;
          box-shadow: 0 0 30px rgba(0, 217, 245, 0.5), inset 0 0 15px rgba(0, 217, 245, 0.25);
        }

        .about-pill-scan {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 217, 245, 0.4), transparent);
          transform: skewX(-20deg);
          animation: aboutPillLaserSweep 4s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes aboutPillLaserSweep {
          0%, 30% { left: -100%; }
          60%, 100% { left: 200%; }
        }

        .about-pill-border-beam {
          animation: aboutPillBeamTravel 4s linear infinite;
        }

        @keyframes aboutPillBeamTravel {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -100; }
        }

        /* ── UNIQUE HOLOGRAPHIC HEADING & GLITCH PULSE ── */
        .about-heading-box {
          position: relative;
          display: inline-block;
          overflow: visible;
          padding: 8px 24px;
        }

        .about-heading-gradient {
          background: linear-gradient(
            90deg,
            #00D9F5 0%,
            #398BFF 25%,
            #9065F5 50%,
            #ED63CE 75%,
            #00D9F5 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          display: inline-block;
          letter-spacing: -0.02em;
          animation: aboutGradShift 5s linear infinite, aboutHoloGlitchPulse 7s ease-in-out infinite;
          filter: drop-shadow(0 0 22px rgba(0, 217, 245, 0.55)) drop-shadow(0 0 45px rgba(144, 101, 245, 0.35));
        }

        @keyframes aboutHoloGlitchPulse {
          0%, 92%, 100% {
            transform: translate(0, 0) skew(0deg);
            filter: drop-shadow(0 0 22px rgba(0, 217, 245, 0.55)) drop-shadow(0 0 45px rgba(144, 101, 245, 0.35));
          }
          93% {
            transform: translate(-2px, 1px) skew(-0.5deg);
            filter: drop-shadow(-3px 0 0 #00D9F5) drop-shadow(3px 0 0 #ED63CE);
          }
          95% {
            transform: translate(2px, -1px) skew(0.5deg);
            filter: drop-shadow(3px 0 0 #00D9F5) drop-shadow(-3px 0 0 #9065F5);
          }
          97% {
            transform: translate(0, 0) skew(0deg);
            filter: drop-shadow(0 0 30px rgba(0, 217, 245, 0.8)) drop-shadow(0 0 55px rgba(144, 101, 245, 0.5));
          }
        }

        .about-heading-beam {
          position: absolute;
          top: 0;
          left: -100%;
          width: 55%;
          height: 100%;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(0, 217, 245, 0.12) 25%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(144, 101, 245, 0.3) 75%,
            transparent 100%
          );
          transform: skewX(-25deg);
          animation: aboutLightSweep 5.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          mix-blend-mode: color-dodge;
        }

        @keyframes aboutLightSweep {
          0%, 18% { left: -100%; opacity: 0; }
          22% { opacity: 1; }
          40% { left: 200%; opacity: 0; }
          100% { left: 200%; opacity: 0; }
        }

        @keyframes aboutGradShift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }



        /* Dynamic Keyword Illumination */
        .about-text-glow-cyan {
          color: #00D9F5;
          font-weight: 600;
          text-shadow: 0 0 12px rgba(0, 217, 245, 0.6);
        }

        .about-text-glow-emerald {
          color: #00D6A0;
          font-weight: 600;
          text-shadow: 0 0 12px rgba(0, 214, 160, 0.6);
        }

        .about-text-glow-blue {
          color: #398BFF;
          font-weight: 600;
          text-shadow: 0 0 12px rgba(57, 139, 255, 0.6);
        }

        .about-text-glow-gradient {
          background: linear-gradient(90deg, #00D9F5, #398BFF, #9065F5, #ED63CE, #00D9F5);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          font-weight: 700;
          animation: aboutGradShift 4.5s linear infinite;
          filter: drop-shadow(0 0 10px rgba(0, 217, 245, 0.5));
        }

        /* Ambient floating particles */
        .about-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: aboutParticleFloat 4.5s ease-in-out infinite alternate;
        }

        @keyframes aboutParticleFloat {
          0% {
            transform: translateY(0px) scale(0.9);
            opacity: 0.35;
          }
          100% {
            transform: translateY(-16px) scale(1.15);
            opacity: 0.75;
          }
        }

        /* Cyber Glass Cards */
        .about-cyber-card {
          position: relative;
          background: linear-gradient(145deg, rgba(16, 26, 48, 0.92) 0%, rgba(8, 15, 29, 0.98) 100%);
          border-radius: 1rem;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.75);
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1),
                      box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1);
        }

        .about-cyber-card:hover {
          transform: translateY(-6px);
        }

        /* ── 1. CONTINUOUS 360° ROTATING CONIC NEON AURA RIM ── */
        .about-conic-glow-border {
          position: absolute;
          inset: -1.5px;
          border-radius: 1.08rem;
          pointer-events: none;
          z-index: 10;
          padding: 1.5px;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            var(--conic-accent-1) 50deg,
            transparent 110deg,
            var(--conic-accent-2) 180deg,
            transparent 240deg,
            var(--conic-accent-3) 300deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          animation: aboutConicRotate 5.5s linear infinite;
          opacity: 0.65;
          transition: opacity 0.3s ease, filter 0.3s ease;
        }

        .about-cyber-card:hover .about-conic-glow-border {
          opacity: 1;
          animation-duration: 3.2s;
          filter: drop-shadow(0 0 8px var(--conic-accent-1));
        }

        @keyframes aboutConicRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* ── 2. DUAL COUNTER-TRAVELING LASER BORDER BEAMS ── */
        .about-border-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 12;
          overflow: visible;
        }

        .about-border-track {
          fill: none;
          stroke-width: 1.2;
          animation: aboutTrackPulse 3.5s ease-in-out infinite alternate;
        }
        @keyframes aboutTrackPulse {
          0% { opacity: 0.35; }
          100% { opacity: 0.85; }
        }

        .about-dynamic-beam {
          fill: none;
          stroke-linecap: round;
          transition: stroke-width 0.3s ease;
        }

        /* Beam 1: Clockwise high-energy primary laser */
        .about-dynamic-beam.beam-cw {
          stroke-width: 2.4;
          stroke-dasharray: 200 800;
          animation: aboutBeamTravelCW 5.2s linear infinite;
        }

        /* Beam 2: Counter-Clockwise intersecting secondary laser */
        .about-dynamic-beam.beam-ccw {
          stroke-width: 1.8;
          stroke-dasharray: 140 860;
          animation: aboutBeamTravelCCW 4.2s linear infinite;
          opacity: 0.85;
        }

        .about-cyber-card:hover .about-dynamic-beam.beam-cw {
          stroke-width: 3.4;
          animation-duration: 3.2s;
        }

        .about-cyber-card:hover .about-dynamic-beam.beam-ccw {
          stroke-width: 2.6;
          animation-duration: 2.6s;
          opacity: 1;
        }

        @keyframes aboutBeamTravelCW {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }

        @keyframes aboutBeamTravelCCW {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 1000; }
        }

        /* ── 3. CYBERNETIC CORNER BRACKETS ── */
        .about-corner {
          position: absolute;
          width: 10px;
          height: 10px;
          pointer-events: none;
          z-index: 14;
          transition: width 0.3s ease, height 0.3s ease, filter 0.3s ease;
        }
        .about-cyber-card:hover .about-corner {
          width: 14px;
          height: 14px;
          filter: drop-shadow(0 0 6px currentColor);
        }
        .about-corner.tl { top: 6px; left: 6px; border-top: 2px solid; border-left: 2px solid; }
        .about-corner.tr { top: 6px; right: 6px; border-top: 2px solid; border-right: 2px solid; }
        .about-corner.bl { bottom: 6px; left: 6px; border-bottom: 2px solid; border-left: 2px solid; }
        .about-corner.br { bottom: 6px; right: 6px; border-bottom: 2px solid; border-right: 2px solid; }

        /* Stable icon pod (inner animations removed) */
        .about-icon-pod {
          position: relative;
        }

        /* ── CYBER VIEW MORE / VIEW LESS CONTROL ── */
        .about-view-toggle-btn {
          cursor: pointer;
          user-select: none;
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.32rem 0.85rem;
          border-radius: 9999px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .about-view-toggle-btn:hover {
          transform: translateY(-1.5px) scale(1.02);
        }
        .about-view-toggle-btn:active {
          transform: translateY(0px) scale(0.97);
        }

        /* ── UNIQUE CLOSING QUOTE BOX & TEXT ANIMATIONS ── */
        .about-quote-card {
          position: relative;
          background: linear-gradient(135deg, rgba(14, 25, 48, 0.92) 0%, rgba(8, 14, 28, 0.97) 100%);
          border-radius: 1.25rem;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.65), 0 0 25px rgba(0, 217, 245, 0.15);
          overflow: hidden;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .about-quote-card:hover {
          transform: translateY(-4px) scale(1.015);
          box-shadow: 0 16px 45px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 217, 245, 0.35);
        }

        .about-quote-conic-rim {
          position: absolute;
          inset: -1.5px;
          border-radius: 1.32rem;
          pointer-events: none;
          z-index: 10;
          padding: 1.5px;
          background: conic-gradient(
            from 0deg,
            transparent 0deg,
            #00D9F5 60deg,
            transparent 120deg,
            #00D6A0 180deg,
            transparent 240deg,
            #9065F5 300deg,
            transparent 360deg
          );
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          animation: aboutQuoteConicSpin 6s linear infinite;
          opacity: 0.65;
          transition: opacity 0.3s ease;
        }

        .about-quote-card:hover .about-quote-conic-rim {
          opacity: 1;
          animation-duration: 3.5s;
          filter: drop-shadow(0 0 8px #00D9F5);
        }

        @keyframes aboutQuoteConicSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .about-quote-laser-beam-1 {
          stroke-dasharray: 180 820;
          animation: aboutQuoteBeamCW 5.2s linear infinite;
        }

        .about-quote-laser-beam-2 {
          stroke-dasharray: 120 880;
          animation: aboutQuoteBeamCCW 4.4s linear infinite;
          opacity: 0.8;
        }

        @keyframes aboutQuoteBeamCW {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }

        @keyframes aboutQuoteBeamCCW {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 1000; }
        }

        .about-quote-lock-pod {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 9999px;
          background: radial-gradient(circle at 35% 35%, rgba(18, 32, 60, 0.95), rgba(7, 13, 26, 0.98));
          border: 1.5px solid #00D9F5;
          box-shadow: 0 0 16px rgba(0, 217, 245, 0.5), inset 0 0 10px rgba(0, 217, 245, 0.3);
          flex-shrink: 0;
        }

        /* Crisp, Bold & Clearly Visible Tagline */
        .about-quote-tagline {
          color: #FFFFFF;
          font-weight: 700;
          letter-spacing: 0.015em;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9), 0 0 10px rgba(255, 255, 255, 0.4);
        }

        .about-quote-guarantee-soft {
          color: #22D3EE;
          font-weight: 800;
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.9), 0 0 8px rgba(34, 211, 238, 0.45);
        }
      `}</style>

      {/* ── 1. BACKGROUND AURORA GLOWS ── */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ── 2. FAINT DIGITAL CIRCUIT BACKDROP ── */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="none" className="w-full h-full">
          <path d="M 0 120 L 300 120 L 360 180 L 720 180 L 780 240 L 1440 240" fill="none" stroke="#00D9F5" strokeWidth="1" strokeDasharray="6 6" />
          <path d="M 1440 450 L 1100 450 L 1020 530 L 600 530 L 540 590 L 0 590" fill="none" stroke="#9065F5" strokeWidth="1" strokeDasharray="8 4" />
          <circle cx="360" cy="180" r="4" fill="#00D9F5" opacity="0.6" />
          <circle cx="780" cy="240" r="4" fill="#398BFF" opacity="0.6" />
          <circle cx="1020" cy="530" r="4" fill="#9065F5" opacity="0.6" />
        </svg>
      </div>

      {/* ── 3. FLOATING DIGITAL PARTICLES ── */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="about-particle"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            backgroundColor: p.color,
            boxShadow: `0 0 8px ${p.color}`,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* ── 4. MAIN FOREGROUND CONTENT CONTAINER ── */}
      <div className="max-w-6xl mx-auto text-center relative z-10">

        {/* SECURITY PROTOCOL BADGE BOX (UNIQUE ANIMATION) */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-block"
        >
          <div className="about-protocol-pill group cursor-pointer select-none">
            {/* Pill Laser Scanline */}
            <div className="about-pill-scan" aria-hidden="true" />

            {/* Traveling Neon Border SVG on the Pill */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
              <defs>
                <linearGradient id="pillLaserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00D9F5" />
                  <stop offset="50%" stopColor="#398BFF" />
                  <stop offset="100%" stopColor="#9065F5" />
                </linearGradient>
              </defs>
              <rect
                x="1"
                y="1"
                width="calc(100% - 2px)"
                height="calc(100% - 2px)"
                rx="9999"
                pathLength="100"
                fill="none"
                stroke="url(#pillLaserGrad)"
                strokeWidth="1.8"
                strokeDasharray="25 75"
                className="about-pill-border-beam"
              />
            </svg>

            {/* Pulsing Radar Core */}
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00D9F5]" />
            </span>

            {/* Exact text preserved */}
            <span className="relative z-10 font-bold tracking-widest text-cyan-300 group-hover:text-white transition-colors duration-200">
              PICRYPT // ARCHITECTURE_OVERVIEW
            </span>
          </div>
        </motion.div>

        {/* MAIN ABOUT HEADING WITH HOLOGRAPHIC LIGHT SWEEP (EXACT TEXT PRESERVED) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-5"
        >
          <div className="about-heading-box">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight m-0">
              <span className="about-heading-gradient">
                About Picrypt
              </span>
            </h1>
            {/* Luminous angled light beam sweep */}
            <div className="about-heading-beam" aria-hidden="true" />
          </div>
        </motion.div>

        {/* INTRODUCTORY PARAGRAPH WITH DYNAMIC TEXT GLOW (EXACT TEXT PRESERVED) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-8 sm:mb-10 px-2 sm:px-4"
        >
          <p className="text-sm sm:text-base md:text-lg text-[#C4D5EB] leading-relaxed font-normal m-0">
            Picrypt is an{" "}
            <span className="about-text-glow-cyan">
              AES-256 (Advanced Encryption Standard)
            </span>{" "}
            based platform that allows users to{" "}
            <span className="about-text-glow-emerald">
              securely hide
            </span>{" "}
            different types of data inside images using strong{" "}
            <span className="about-text-glow-blue">
              cryptographic techniques
            </span>
            . Whether it's documents, code, or photos — Picrypt ensures your sensitive data remains{" "}
            <span className="about-text-glow-gradient">
              encrypted and tamper-proof
            </span>
            .
          </p>
        </motion.div>

        {/* ===== ANIMATED CENTER-OUT DIVIDER ===== */}
        <div className="flex justify-center mb-8 sm:mb-10">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "7.5rem", opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="relative h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 shadow-[0_0_14px_rgba(0,217,245,0.7)]"
          >
            <div className="absolute inset-0 bg-white/40 blur-[1px] rounded-full animate-pulse" />
          </motion.div>
        </div>

        {/* SUBHEADING WITH HOLOGRAPHIC SHIELD RADAR & GRADIENT (EXACT TEXT PRESERVED) */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="text-lg sm:text-2xl font-bold mb-6 sm:mb-8 tracking-wide flex items-center justify-center gap-3"
        >
          <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#0a1832] border border-cyan-400/40 shadow-[0_0_12px_rgba(0,217,245,0.4)]">
            <span className="absolute inset-0 rounded-full bg-cyan-400/25 animate-ping opacity-60" />
            <span className="text-lg sm:text-xl relative z-10 drop-shadow-[0_0_8px_rgba(0,217,245,0.8)]">🛡</span>
          </span>
          <span className="bg-gradient-to-r from-[#F1F5FF] via-cyan-100 to-[#F1F5FF] bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(0,217,245,0.3)]">
            Securely encrypt these types of data inside images:
          </span>
        </motion.h2>

        {/* ── 5. SIX DATA CATEGORY CARDS ── */}
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 mt-6">
          {CATEGORIES.map((cat, idx) => {
            const IconComponent = cat.icon;
            const isExpanded = !!expandedCards[idx];
            const hasMore = cat.extensions.length > 3;

            return (
              <motion.div
                layout
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + idx * 0.08 }}
                className="about-cyber-card group p-5 sm:p-6 rounded-2xl flex flex-col items-center text-center select-none overflow-hidden"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 16px 42px -5px rgba(0, 0, 0, 0.85), 0 0 28px ${cat.glowColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 10px 30px -10px rgba(0, 0, 0, 0.75)";
                }}
              >
                {/* ── 1. CONTINUOUS 360° ROTATING CONIC NEON AURA RIM ── */}
                <div
                  className="about-conic-glow-border"
                  style={{
                    "--conic-accent-1": cat.palette[0],
                    "--conic-accent-2": cat.palette[1],
                    "--conic-accent-3": cat.palette[2],
                  }}
                  aria-hidden="true"
                />

                {/* ── 2. DUAL INTERSECTING LASER BORDER BEAMS & TRACK ── */}
                <svg className="about-border-svg" aria-hidden="true">
                  <defs>
                    {/* Clockwise Beam Gradient */}
                    <linearGradient id={`aboutDynGrad1-${idx}`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={cat.palette[0]}>
                        <animate
                          attributeName="stop-color"
                          values={`${cat.palette[0]};${cat.palette[1]};${cat.palette[2]};${cat.palette[3]};${cat.palette[0]}`}
                          dur="5.2s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="50%" stopColor={cat.palette[1]}>
                        <animate
                          attributeName="stop-color"
                          values={`${cat.palette[1]};${cat.palette[2]};${cat.palette[3]};${cat.palette[0]};${cat.palette[1]}`}
                          dur="5.2s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="100%" stopColor={cat.palette[2]}>
                        <animate
                          attributeName="stop-color"
                          values={`${cat.palette[2]};${cat.palette[3]};${cat.palette[0]};${cat.palette[1]};${cat.palette[2]}`}
                          dur="5.2s"
                          repeatCount="indefinite"
                        />
                      </stop>
                    </linearGradient>

                    {/* Counter-Clockwise Intersecting Beam Gradient */}
                    <linearGradient id={`aboutDynGrad2-${idx}`} x1="100%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor={cat.palette[2]}>
                        <animate
                          attributeName="stop-color"
                          values={`${cat.palette[2]};${cat.palette[3]};${cat.palette[0]};${cat.palette[1]};${cat.palette[2]}`}
                          dur="4.2s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="50%" stopColor={cat.palette[3] || cat.palette[0]}>
                        <animate
                          attributeName="stop-color"
                          values={`${cat.palette[3] || cat.palette[0]};${cat.palette[0]};${cat.palette[1]};${cat.palette[2]};${cat.palette[3] || cat.palette[0]}`}
                          dur="4.2s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="100%" stopColor={cat.palette[1]}>
                        <animate
                          attributeName="stop-color"
                          values={`${cat.palette[1]};${cat.palette[2]};${cat.palette[3]};${cat.palette[0]};${cat.palette[1]}`}
                          dur="4.2s"
                          repeatCount="indefinite"
                        />
                      </stop>
                    </linearGradient>

                    <filter id={`aboutDynGlow-${idx}`} x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3.2" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Breathing perimeter border track */}
                  <rect
                    x="1.5"
                    y="1.5"
                    width="calc(100% - 3px)"
                    height="calc(100% - 3px)"
                    rx="16"
                    pathLength="1000"
                    className="about-border-track"
                    style={{ stroke: `${cat.accent}35` }}
                  />

                  {/* Laser Beam 1 (Clockwise primary) */}
                  <rect
                    x="1.5"
                    y="1.5"
                    width="calc(100% - 3px)"
                    height="calc(100% - 3px)"
                    rx="16"
                    pathLength="1000"
                    fill="none"
                    stroke={`url(#aboutDynGrad1-${idx})`}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    className="about-dynamic-beam beam-cw"
                    filter={`url(#aboutDynGlow-${idx})`}
                  />

                  {/* Laser Beam 2 (Counter-Clockwise secondary) */}
                  <rect
                    x="1.5"
                    y="1.5"
                    width="calc(100% - 3px)"
                    height="calc(100% - 3px)"
                    rx="16"
                    pathLength="1000"
                    fill="none"
                    stroke={`url(#aboutDynGrad2-${idx})`}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    className="about-dynamic-beam beam-ccw"
                    filter={`url(#aboutDynGlow-${idx})`}
                  />
                </svg>

                {/* ── 4. CYBER CORNER BRACKETS ── */}
                <div className="about-corner tl" style={{ borderColor: cat.accent, color: cat.accent }} />
                <div className="about-corner tr" style={{ borderColor: cat.accent, color: cat.accent }} />
                <div className="about-corner bl" style={{ borderColor: cat.accent, color: cat.accent }} />
                <div className="about-corner br" style={{ borderColor: cat.accent, color: cat.accent }} />

                {/* Tag pill at card top */}
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400/80 mb-3 block z-10">
                  {cat.tag}
                </span>

                {/* Holographic Circular Icon Pod */}
                <div className="relative mb-3.5 about-icon-pod z-10">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle at 35% 35%, rgba(18, 30, 56, 0.95), rgba(7, 13, 26, 0.98))`,
                      border: `1.5px solid ${cat.accent}`,
                      boxShadow: `0 0 16px ${cat.glowColor}, inset 0 0 12px ${cat.glowColor}`,
                    }}
                  >
                    <IconComponent
                      size={28}
                      style={{
                        color: cat.accent,
                        filter: `drop-shadow(0 0 6px ${cat.accent})`,
                      }}
                      className="transition-transform duration-300 group-hover:rotate-6"
                    />
                  </div>
                </div>

                {/* Category Title (EXACT PRESERVED) */}
                <h3 className="text-base sm:text-lg font-bold text-[#F1F5FF] mb-2 tracking-wide group-hover:text-cyan-300 transition-colors duration-200 z-10">
                  {cat.title}
                </h3>

                {/* Supported File Extensions (Equal 3 by default, View More / View Less) */}
                <div className="mt-auto pt-3 w-full flex flex-col items-center z-10">
                  {/* Always Visible: Exactly First 3 Extensions */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                    {cat.extensions.slice(0, 3).map((ext, i) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-base sm:text-lg font-mono font-extrabold text-white bg-[#070e1c]/95 border-2 transition-all duration-200 shadow-[0_0_12px_rgba(0,217,245,0.25)] hover:scale-105 hover:text-white"
                        style={{
                          borderColor: `${cat.accent}90`,
                        }}
                      >
                        {ext}
                      </span>
                    ))}
                  </div>

                  {/* Smoothly Revealed Extensions When Expanded */}
                  {hasMore && (
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key={`extra-ext-${idx}`}
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: "0.625rem" }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.28, ease: "easeInOut" }}
                          className="flex flex-wrap justify-center gap-2 sm:gap-2.5 overflow-hidden w-full"
                        >
                          {cat.extensions.slice(3).map((ext, i) => (
                            <span
                              key={`extra-${i}`}
                              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-base sm:text-lg font-mono font-extrabold text-white bg-[#070e1c]/95 border-2 transition-all duration-200 shadow-[0_0_12px_rgba(0,217,245,0.25)] hover:scale-105 hover:text-white"
                              style={{
                                borderColor: `${cat.accent}90`,
                              }}
                            >
                              {ext}
                            </span>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  {/* Interactive View More / View Less Control or Equalizing Spacer */}
                  {hasMore ? (
                    <button
                      type="button"
                      onClick={(e) => toggleCardExpand(idx, e)}
                      className="about-view-toggle-btn mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none"
                      style={{
                        color: cat.accent,
                        background: "rgba(7, 14, 28, 0.8)",
                        border: `1px solid ${cat.accent}55`,
                        boxShadow: `0 0 10px ${cat.accent}20`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = cat.accent;
                        e.currentTarget.style.boxShadow = `0 0 16px ${cat.glowColor}`;
                        e.currentTarget.style.background = `${cat.accent}18`;
                        e.currentTarget.style.color = "#FFFFFF";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = `${cat.accent}55`;
                        e.currentTarget.style.boxShadow = `0 0 10px ${cat.accent}20`;
                        e.currentTarget.style.background = "rgba(7, 14, 28, 0.8)";
                        e.currentTarget.style.color = cat.accent;
                      }}
                      aria-expanded={isExpanded}
                      aria-label={`${isExpanded ? "View fewer" : "View more"} extensions for ${cat.title}`}
                    >
                      <span>{isExpanded ? "View Less" : "View More"}</span>
                      <FaChevronDown
                        className={`text-[10px] transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  ) : (
                    <div className="h-[28px] mt-3.5" aria-hidden="true" />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── 6. FINAL PRIVACY QUOTATION (UNIQUE BOX & TEXT ANIMATION) ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 sm:mt-16 max-w-3xl mx-auto"
        >
          <div className="about-quote-card p-5 sm:p-6 group select-none relative">
            {/* 1. Continuous 360° Rotating Conic Neon Aura Rim */}
            <div className="about-quote-conic-rim" aria-hidden="true" />

            {/* 2. Dual Intersecting Traveling Laser Border Beams */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-12 overflow-visible" aria-hidden="true">
              <defs>
                <linearGradient id="quoteBeamGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00D9F5" />
                  <stop offset="50%" stopColor="#00D6A0" />
                  <stop offset="100%" stopColor="#398BFF" />
                </linearGradient>
                <linearGradient id="quoteBeamGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9065F5" />
                  <stop offset="50%" stopColor="#ED63CE" />
                  <stop offset="100%" stopColor="#00D9F5" />
                </linearGradient>
                <filter id="quoteBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Perimeter Track */}
              <rect
                x="1.5"
                y="1.5"
                width="calc(100% - 3px)"
                height="calc(100% - 3px)"
                rx="20"
                pathLength="1000"
                fill="none"
                stroke="rgba(0, 217, 245, 0.22)"
                strokeWidth="1.2"
              />

              {/* Clockwise Laser Beam */}
              <rect
                x="1.5"
                y="1.5"
                width="calc(100% - 3px)"
                height="calc(100% - 3px)"
                rx="20"
                pathLength="1000"
                fill="none"
                stroke="url(#quoteBeamGrad1)"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="about-quote-laser-beam-1"
                filter="url(#quoteBeamGlow)"
              />

              {/* Counter-Clockwise Intersecting Laser Beam */}
              <rect
                x="1.5"
                y="1.5"
                width="calc(100% - 3px)"
                height="calc(100% - 3px)"
                rx="20"
                pathLength="1000"
                fill="none"
                stroke="url(#quoteBeamGrad2)"
                strokeWidth="1.8"
                strokeLinecap="round"
                className="about-quote-laser-beam-2"
                filter="url(#quoteBeamGlow)"
              />
            </svg>

            {/* 3. Cybernetic Corner Accents */}
            <div className="about-corner tl" style={{ borderColor: "#00D9F5", color: "#00D9F5" }} />
            <div className="about-corner tr" style={{ borderColor: "#00D9F5", color: "#00D9F5" }} />
            <div className="about-corner bl" style={{ borderColor: "#00D9F5", color: "#00D9F5" }} />
            <div className="about-corner br" style={{ borderColor: "#00D9F5", color: "#00D9F5" }} />

            {/* 4. Quote Content (Lock Pod + Tagline) */}
            <div className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 text-center sm:text-left">
              {/* Holographic Lock Shield Pod */}
              <div className="about-quote-lock-pod">
                <span className="text-xl relative z-10 drop-shadow-[0_0_10px_rgba(0,217,245,0.9)]">
                  🔒
                </span>
              </div>

              {/* Exact quotation text: crisp, bold, clearly visible with soft guarantee highlight */}
              <p className="about-quote-tagline text-base sm:text-lg md:text-xl italic tracking-wide m-0">
                <span>“With Picrypt, privacy is not just a feature — it's a </span>
                <span className="about-quote-guarantee-soft">
                  guarantee
                </span>
                <span>.”</span>
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;
