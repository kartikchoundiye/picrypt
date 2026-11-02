// frontend/src/modules/Contact.jsx

import { useState } from "react";
import { motion } from "framer-motion";

const PARTICLES = [
  { size: 3, top: "12%", left: "7%", color: "#00D9F5", dur: "4.5s", delay: "0s" },
  { size: 4, top: "28%", left: "92%", color: "#398BFF", dur: "5.2s", delay: "1.2s" },
  { size: 2.5, top: "54%", left: "4%", color: "#9065F5", dur: "4.8s", delay: "0.6s" },
  { size: 3.5, top: "72%", left: "90%", color: "#00D6A0", dur: "5.5s", delay: "1.8s" },
  { size: 3, top: "86%", left: "15%", color: "#ED63CE", dur: "4.2s", delay: "2.4s" },
  { size: 2.5, top: "40%", left: "48%", color: "#00D9F5", dur: "5.0s", delay: "1.5s" },
];

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! 🚀");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="cyber-contact-root relative w-full bg-[#070D1A] text-[#EAF2FF] overflow-hidden pt-6 sm:pt-10 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
      {/* ── EMBEDDED SCOPED STYLES ── */}
      <style>{`
        .cyber-contact-root {
          background-color: #070D1A !important;
          color: #EAF2FF;
        }

        /* ── CYBER TRANSMISSION BADGE ── */
        .contact-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.45rem 1.15rem;
          background: linear-gradient(135deg, rgba(13, 27, 51, 0.9) 0%, rgba(7, 14, 28, 0.95) 100%);
          border-radius: 9999px;
          border: 1px solid rgba(0, 217, 245, 0.3);
          color: #00D9F5;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.72rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 0 16px rgba(0, 217, 245, 0.18), inset 0 0 10px rgba(0, 217, 245, 0.08);
        }

        .contact-badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #00D9F5;
          box-shadow: 0 0 8px #00D9F5;
          animation: contactDotPulse 2s ease-in-out infinite;
        }

        @keyframes contactDotPulse {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        /* ── HEADING GRADIENT FLOW & SHIMMER ── */
        .contact-title {
          background: linear-gradient(90deg, #00D9F5 0%, #398BFF 30%, #9065F5 65%, #ED63CE 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: contactTitleFlow 8s linear infinite;
          filter: drop-shadow(0 0 20px rgba(0, 217, 245, 0.35));
        }

        @keyframes contactTitleFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* ── EXPANDING NEON DIVIDER ── */
        .contact-divider {
          height: 3px;
          border-radius: 9999px;
          background: linear-gradient(90deg, transparent 0%, #00D9F5 25%, #398BFF 50%, #9065F5 75%, transparent 100%);
          box-shadow: 0 0 12px rgba(0, 217, 245, 0.6), 0 0 20px rgba(144, 101, 245, 0.4);
          position: relative;
        }

        .contact-divider::after {
          content: "";
          position: absolute;
          top: -2px;
          left: 30%;
          width: 40%;
          height: 7px;
          border-radius: 9999px;
          background: rgba(0, 217, 245, 0.7);
          filter: blur(2px);
          animation: contactDividerSweep 3s ease-in-out infinite alternate;
        }

        @keyframes contactDividerSweep {
          0% { left: 10%; width: 30%; }
          100% { left: 60%; width: 30%; }
        }

        /* ════════════════════════════════════════════════════════
           1. MAIN CONTACT FORM SECURITY PANEL (ENHANCED)
           ════════════════════════════════════════════════════════ */
        .cyber-form-panel {
          position: relative;
          background:
            radial-gradient(circle at 18% 15%, rgba(0, 217, 245, 0.1) 0%, transparent 45%),
            radial-gradient(circle at 82% 85%, rgba(57, 139, 255, 0.08) 0%, transparent 45%),
            linear-gradient(135deg, rgba(13, 23, 41, 0.88) 0%, rgba(9, 16, 30, 0.94) 100%);
          border: 1px solid rgba(0, 217, 245, 0.28);
          border-radius: 1.25rem;
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          overflow: hidden;
          animation: panelGlowBreathe 4.5s ease-in-out infinite alternate;
          transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.35s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.35s ease;
        }

        .cyber-form-panel:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 217, 245, 0.55);
          box-shadow:
            0 24px 50px rgba(0, 0, 0, 0.75),
            0 0 35px rgba(0, 217, 245, 0.28),
            inset 0 1px 2px rgba(0, 217, 245, 0.2);
        }

        @keyframes panelGlowBreathe {
          0% {
            box-shadow:
              0 15px 40px rgba(0, 0, 0, 0.65),
              0 0 20px rgba(0, 217, 245, 0.1),
              inset 0 1px 1px rgba(255, 255, 255, 0.08);
            border-color: rgba(0, 217, 245, 0.25);
          }
          100% {
            box-shadow:
              0 20px 48px rgba(0, 0, 0, 0.72),
              0 0 32px rgba(0, 217, 245, 0.22),
              inset 0 1px 2px rgba(0, 217, 245, 0.15);
            border-color: rgba(0, 217, 245, 0.42);
          }
        }

        /* Moving Laser Light Streak along Top Border */
        .panel-top-laser {
          position: absolute;
          top: 0;
          left: -40%;
          width: 45%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00D9F5 50%, #398BFF 85%, transparent);
          box-shadow: 0 0 12px #00D9F5, 0 0 20px #398BFF;
          animation: panelLaserRun 5s ease-in-out infinite;
          pointer-events: none;
          z-index: 20;
        }

        @keyframes panelLaserRun {
          0% { left: -45%; opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }

        /* ── CYBER CORNER BRACKETS ── */
        .cyber-corner {
          position: absolute;
          width: 16px;
          height: 16px;
          pointer-events: none;
          z-index: 20;
        }
        .cyber-corner-tl {
          top: 8px;
          left: 8px;
          border-top: 2px solid #00D9F5;
          border-left: 2px solid #00D9F5;
          filter: drop-shadow(0 0 5px #00D9F5);
        }
        .cyber-corner-tr {
          top: 8px;
          right: 8px;
          border-top: 2px solid #00D9F5;
          border-right: 2px solid #00D9F5;
          filter: drop-shadow(0 0 5px #00D9F5);
        }
        .cyber-corner-bl {
          bottom: 8px;
          left: 8px;
          border-bottom: 2px solid #00D9F5;
          border-left: 2px solid #00D9F5;
          filter: drop-shadow(0 0 5px #00D9F5);
        }
        .cyber-corner-br {
          bottom: 8px;
          right: 8px;
          border-bottom: 2px solid #00D9F5;
          border-right: 2px solid #00D9F5;
          filter: drop-shadow(0 0 5px #00D9F5);
        }

        /* ── INPUT FIELDS & FOCUS GLOW ── */
        .cyber-input {
          width: 100%;
          padding: 0.875rem 1rem;
          background: rgba(7, 13, 26, 0.82);
          border: 1px solid rgba(0, 217, 245, 0.22);
          border-radius: 0.65rem;
          color: #EAF2FF;
          font-size: 0.9375rem;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          outline: none;
          position: relative;
          z-index: 5;
        }

        .cyber-input::placeholder {
          color: #627D98;
          font-size: 0.9rem;
        }

        .cyber-input:focus {
          border-color: #00D9F5;
          background: rgba(10, 19, 36, 0.95);
          box-shadow:
            0 0 18px rgba(0, 217, 245, 0.32),
            inset 0 0 10px rgba(0, 217, 245, 0.15);
        }

        /* ── SEND MESSAGE BUTTON ── */
        .cyber-send-btn {
          position: relative;
          width: 100%;
          padding: 0.95rem 1.5rem;
          border-radius: 0.65rem;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.03em;
          color: #FFFFFF;
          background: linear-gradient(135deg, #00D9F5 0%, #398BFF 50%, #9065F5 100%);
          background-size: 200% auto;
          border: 1px solid rgba(0, 217, 245, 0.4);
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          box-shadow: 0 4px 20px rgba(0, 217, 245, 0.35), 0 0 10px rgba(57, 139, 255, 0.2);
          z-index: 5;
        }

        .cyber-send-btn:hover {
          transform: translateY(-2px);
          background-position: 100% 0;
          box-shadow: 0 8px 30px rgba(0, 217, 245, 0.55), 0 0 20px rgba(144, 101, 245, 0.4);
          border-color: #00D9F5;
        }

        .cyber-send-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 10px rgba(0, 217, 245, 0.4);
        }

        .cyber-send-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(0, 217, 245, 0.5), 0 0 25px rgba(0, 217, 245, 0.6);
        }

        .cyber-send-btn::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.35), transparent);
          transform: skewX(-25deg);
          transition: 0.6s ease;
        }

        .cyber-send-btn:hover::after {
          left: 200%;
        }

        /* ════════════════════════════════════════════════════════
           2. THREE HOLOGRAPHIC INFORMATION CARDS (ENHANCED)
           ════════════════════════════════════════════════════════ */
        .info-card {
          position: relative;
          border-radius: 1.15rem;
          padding: 1.35rem 1.6rem;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          overflow: hidden;
          transition: transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.3s ease;
        }

        /* ── CARD 1: Vision & Mission (Cyan & Electric-Blue) ── */
        .info-card-1 {
          background:
            radial-gradient(circle at 12% 50%, rgba(0, 217, 245, 0.12) 0%, transparent 45%),
            linear-gradient(135deg, rgba(16, 29, 50, 0.85) 0%, rgba(9, 18, 34, 0.92) 100%);
          border: 1px solid rgba(0, 217, 245, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 217, 245, 0.08);
        }
        .info-card-1:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 217, 245, 0.68);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.65), 0 0 28px rgba(0, 217, 245, 0.32);
        }
        .card-1-laser {
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00D9F5 60%, #398BFF, transparent);
          box-shadow: 0 0 10px #00D9F5;
          animation: cardLaserSweep1 5s linear infinite;
          pointer-events: none;
        }
        @keyframes cardLaserSweep1 {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        /* ── CARD 2: Tech Stack & Skills (Purple & Electric-Blue) ── */
        .info-card-2 {
          background:
            radial-gradient(circle at 12% 50%, rgba(144, 101, 245, 0.12) 0%, transparent 45%),
            linear-gradient(135deg, rgba(18, 26, 52, 0.85) 0%, rgba(11, 17, 36, 0.92) 100%);
          border: 1px solid rgba(144, 101, 245, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(144, 101, 245, 0.08);
        }
        .info-card-2:hover {
          transform: translateY(-4px);
          border-color: rgba(144, 101, 245, 0.68);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.65), 0 0 28px rgba(144, 101, 245, 0.32);
        }
        .card-2-laser {
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #9065F5 60%, #ED63CE, transparent);
          box-shadow: 0 0 10px #9065F5;
          animation: cardLaserSweep2 5.5s linear infinite;
          pointer-events: none;
        }
        @keyframes cardLaserSweep2 {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        /* ── CARD 3: Connect with the Founder (Emerald Green & Cyan) ── */
        .info-card-3 {
          background:
            radial-gradient(circle at 12% 50%, rgba(0, 214, 160, 0.12) 0%, transparent 45%),
            linear-gradient(135deg, rgba(14, 30, 48, 0.85) 0%, rgba(8, 20, 34, 0.92) 100%);
          border: 1px solid rgba(0, 214, 160, 0.25);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 214, 160, 0.08);
        }
        .info-card-3:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 214, 160, 0.68);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.65), 0 0 28px rgba(0, 214, 160, 0.32);
        }
        .card-3-laser {
          position: absolute;
          top: 0;
          left: -40%;
          width: 40%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #00D6A0 60%, #00D9F5, transparent);
          box-shadow: 0 0 10px #00D6A0;
          animation: cardLaserSweep3 4.8s linear infinite;
          pointer-events: none;
        }
        @keyframes cardLaserSweep3 {
          0% { left: -40%; }
          100% { left: 100%; }
        }

        /* ── CARD CORNER ACCENT TICKS ── */
        .card-corner-tick {
          position: absolute;
          width: 8px;
          height: 8px;
          pointer-events: none;
        }
        .info-card-1 .card-corner-tick { border-color: #00D9F5; }
        .info-card-2 .card-corner-tick { border-color: #9065F5; }
        .info-card-3 .card-corner-tick { border-color: #00D6A0; }

        .card-tick-tl { top: 6px; left: 6px; border-top: 1.5px solid; border-left: 1.5px solid; }
        .card-tick-br { bottom: 6px; right: 6px; border-bottom: 1.5px solid; border-right: 1.5px solid; }

        /* ── ICON HOLOGRAPHIC BADGES ── */
        .holo-icon-wrap {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 46px;
          height: 46px;
          border-radius: 0.75rem;
          position: relative;
          flex-shrink: 0;
          font-size: 1.4rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          z-index: 5;
        }

        .holo-icon-1 {
          background: rgba(0, 217, 245, 0.12);
          border: 1px solid rgba(0, 217, 245, 0.4);
          box-shadow: 0 0 16px rgba(0, 217, 245, 0.25);
        }
        .holo-icon-2 {
          background: rgba(144, 101, 245, 0.12);
          border: 1px solid rgba(144, 101, 245, 0.4);
          box-shadow: 0 0 16px rgba(144, 101, 245, 0.25);
        }
        .holo-icon-3 {
          background: rgba(0, 214, 160, 0.12);
          border: 1px solid rgba(0, 214, 160, 0.4);
          box-shadow: 0 0 16px rgba(0, 214, 160, 0.25);
        }

        .info-card:hover .holo-icon-wrap {
          transform: scale(1.12) rotate(4deg);
        }
        .info-card-1:hover .holo-icon-wrap { box-shadow: 0 0 24px rgba(0, 217, 245, 0.5); }
        .info-card-2:hover .holo-icon-wrap { box-shadow: 0 0 24px rgba(144, 101, 245, 0.5); }
        .info-card-3:hover .holo-icon-wrap { box-shadow: 0 0 24px rgba(0, 214, 160, 0.5); }

        /* Ambient floating particles */
        .contact-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: contactParticleFloat 4s ease-in-out infinite alternate;
        }

        @keyframes contactParticleFloat {
          0% { transform: translateY(0px) scale(0.9); opacity: 0.3; }
          100% { transform: translateY(-14px) scale(1.15); opacity: 0.75; }
        }

        /* ════════════════════════════════════════════════════════
           INTERNAL BACKGROUND ARTWORK — FORM PANEL
           ════════════════════════════════════════════════════════ */

        /* Form panel deep grid texture */
        .contact-form-grid {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.07;
          background-image:
            linear-gradient(rgba(0,217,245,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,217,245,0.5) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 10%, transparent 80%);
          -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 50%, black 10%, transparent 80%);
        }

        /* Ambient radial glows inside the form panel */
        .form-glow-tl {
          position: absolute;
          top: -40px;
          left: -40px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,217,245,0.18) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(18px);
          animation: formGlowPulse 5s ease-in-out infinite alternate;
        }
        .form-glow-br {
          position: absolute;
          bottom: -40px;
          right: -40px;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(57,139,255,0.14) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(20px);
          animation: formGlowPulse 6s ease-in-out infinite alternate-reverse;
        }
        @keyframes formGlowPulse {
          0%   { opacity: 0.5; transform: scale(0.92); }
          100% { opacity: 1;   transform: scale(1.08); }
        }

        /* Horizontal scanner line inside form */
        .form-scan-beam {
          position: absolute;
          left: 5%;
          right: 5%;
          height: 1.5px;
          background: linear-gradient(90deg, transparent, rgba(0,217,245,0.65) 40%, rgba(57,139,255,0.65) 60%, transparent);
          box-shadow: 0 0 10px rgba(0,217,245,0.4);
          pointer-events: none;
          z-index: 1;
          top: 0;
          animation: formScanMove 9s linear infinite;
          opacity: 0;
        }
        @keyframes formScanMove {
          0%         { top: 2%;   opacity: 0; }
          8%         { opacity: 0.7; }
          82%        { opacity: 0.7; }
          100%       { top: 98%;  opacity: 0; }
        }

        /* Glowing circuit nodes inside the form */
        .form-node {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }
        .form-node-pulse {
          animation: formNodePulseAnim 3s ease-in-out infinite alternate;
        }
        @keyframes formNodePulseAnim {
          0%   { opacity: 0.25; transform: scale(0.8); }
          100% { opacity: 0.9;  transform: scale(1.3); box-shadow: 0 0 10px currentColor; }
        }

        /* ════════════════════════════════════════════════════════
           INTERNAL BACKGROUND ARTWORK — CARD 1 (VISION & MISSION)
           ════════════════════════════════════════════════════════ */

        /* Slow-drifting neural node animation */
        .c1-node-drift {
          animation: c1NodeDrift 4.5s ease-in-out infinite alternate;
        }
        .c1-node-drift-b {
          animation: c1NodeDrift 6s ease-in-out infinite alternate-reverse;
        }
        @keyframes c1NodeDrift {
          0%   { opacity: 0.3; r: 2.5; }
          100% { opacity: 0.95; r: 4;   filter: drop-shadow(0 0 5px #00D9F5); }
        }

        /* Holographic icon halo glow */
        .c1-icon-halo {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,217,245,0.22) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(6px);
          animation: c1HaloBreath 4s ease-in-out infinite alternate;
        }
        @keyframes c1HaloBreath {
          0%   { opacity: 0.4; transform: scale(0.9); }
          100% { opacity: 1;   transform: scale(1.15); }
        }

        /* ════════════════════════════════════════════════════════
           INTERNAL BACKGROUND ARTWORK — CARD 2 (TECH STACK)
           ════════════════════════════════════════════════════════ */

        .c2-node-blink {
          animation: c2NodeBlink 3.5s ease-in-out infinite alternate;
        }
        .c2-node-blink-b {
          animation: c2NodeBlink 5s ease-in-out infinite alternate-reverse;
        }
        @keyframes c2NodeBlink {
          0%   { opacity: 0.25; r: 2.2; }
          100% { opacity: 1;    r: 3.8; filter: drop-shadow(0 0 5px #9065F5); }
        }

        /* Purple holographic icon halo */
        .c2-icon-halo {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(144,101,245,0.25) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(7px);
          animation: c2HaloBreath 4.5s ease-in-out infinite alternate;
        }
        @keyframes c2HaloBreath {
          0%   { opacity: 0.35; transform: scale(0.88); }
          100% { opacity: 1;    transform: scale(1.18); }
        }

        /* ════════════════════════════════════════════════════════
           INTERNAL BACKGROUND ARTWORK — CARD 3 (CONNECT)
           ════════════════════════════════════════════════════════ */

        .c3-signal-travel {
          stroke-dasharray: 6 8;
          animation: c3SignalMove 3s linear infinite;
        }
        @keyframes c3SignalMove {
          to { stroke-dashoffset: -56; }
        }

        .c3-node-glow {
          animation: c3NodeGlow 3.8s ease-in-out infinite alternate;
        }
        .c3-node-glow-b {
          animation: c3NodeGlow 5.2s ease-in-out infinite alternate-reverse;
        }
        @keyframes c3NodeGlow {
          0%   { opacity: 0.2; r: 2.5; }
          100% { opacity: 1;   r: 4.2; filter: drop-shadow(0 0 6px #00D6A0); }
        }

        /* Green holographic icon halo */
        .c3-icon-halo {
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,214,160,0.24) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          filter: blur(7px);
          animation: c3HaloBreath 4s ease-in-out infinite alternate;
        }
        @keyframes c3HaloBreath {
          0%   { opacity: 0.4; transform: scale(0.9); }
          100% { opacity: 1;   transform: scale(1.15); }
        }

        /* ── REDUCED MOTION ── */
        @media (prefers-reduced-motion: reduce) {
          .contact-title,
          .contact-badge-dot,
          .contact-divider::after,
          .cyber-form-panel,
          .panel-top-laser,
          .card-1-laser,
          .card-2-laser,
          .card-3-laser,
          .cyber-send-btn,
          .cyber-send-btn::after,
          .contact-particle,
          .info-card,
          .holo-icon-wrap,
          .form-glow-tl,
          .form-glow-br,
          .form-scan-beam,
          .form-node-pulse,
          .c1-node-drift,
          .c1-node-drift-b,
          .c1-icon-halo,
          .c2-node-blink,
          .c2-node-blink-b,
          .c2-icon-halo,
          .c3-signal-travel,
          .c3-node-glow,
          .c3-node-glow-b,
          .c3-icon-halo {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* ── 1. AMBIENT CYBER BACKGROUND & RADIAL GLOWS (PRESERVED) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Soft Radial Ambient Lighting */}
        <div
          className="absolute -top-[10%] left-[10%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0, 217, 245, 0.08) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute top-[35%] right-[5%] w-[550px] h-[550px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(144, 101, 245, 0.07) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute bottom-[5%] left-[25%] w-[450px] h-[450px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(0, 214, 160, 0.06) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />

        {/* Faint Digital Circuit Network SVG Backdrop */}
        <svg
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full opacity-20"
        >
          <path
            d="M 60 120 L 260 120 L 320 180 L 320 380 L 420 480 L 680 480"
            fill="none"
            stroke="#00D9F5"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />
          <circle cx="320" cy="180" r="3" fill="#00D9F5" />
          <circle cx="420" cy="480" r="3.5" fill="#398BFF" />

          <path
            d="M 1380 200 L 1180 200 L 1100 280 L 1100 520 L 1020 600 L 760 600"
            fill="none"
            stroke="#9065F5"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />
          <circle cx="1100" cy="280" r="3" fill="#9065F5" />
          <circle cx="1020" cy="600" r="3.5" fill="#ED63CE" />

          <path
            d="M 200 840 L 480 840 L 560 760 L 880 760 L 960 840 L 1240 840"
            fill="none"
            stroke="#00D6A0"
            strokeWidth="1.2"
            strokeDasharray="8 6"
          />
          <circle cx="560" cy="760" r="3" fill="#00D6A0" />
          <circle cx="880" cy="760" r="3" fill="#00D9F5" />
        </svg>

        {/* Floating Digital Particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="contact-particle"
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
      </div>

      {/* ── 2. MAIN CONTAINER ── */}
      <div className="relative z-10 max-w-7xl mx-auto w-full">

        {/* Cyber Security Protocol Badge */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-3"
        >
          <div className="contact-badge">
            <span className="contact-badge-dot" />
            <span>TRANSMISSION CHANNEL // ENCRYPTED_ENDPOINT</span>
          </div>
        </motion.div>

        {/* Heading: Contact Us */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="contact-title text-center text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
        >
          Contact Us
        </motion.h1>

        {/* Enhanced Divider */}
        <div className="flex justify-center mb-6 sm:mb-10">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "7.5rem", opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.7, ease: "easeOut" }}
            className="contact-divider"
          />
        </div>

        {/* ── 3. TWO-COLUMN RESPONSIVE LAYOUT (EQUAL CONTAINER SIZES) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">

          {/* ════════ LEFT COLUMN: CONTACT FORM PANEL (MAIN SECURITY TERMINAL) ════════ */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full h-full flex flex-col"
          >
            <div className="cyber-form-panel h-full flex flex-col justify-between p-6 sm:p-8 md:p-10 space-y-6">
              {/* ── INTERNAL BACKGROUND ARTWORK: SECURE COMMUNICATION TERMINAL ── */}
              {/* Subtle digital grid */}
              <div className="contact-form-grid" aria-hidden="true" />

              {/* Ambient radial glows */}
              <div className="form-glow-tl" aria-hidden="true" />
              <div className="form-glow-br" aria-hidden="true" />

              {/* Occasional horizontal scanning line */}
              <div className="form-scan-beam" aria-hidden="true" />

              {/* Deep circuit-board pathway SVG */}
              <svg
                viewBox="0 0 600 700"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                aria-hidden="true"
                style={{ opacity: 0.13 }}
              >
                {/* Main horizontal bus lines */}
                <path d="M 0 60 L 120 60 L 160 100 L 440 100 L 480 60 L 600 60" fill="none" stroke="#00D9F5" strokeWidth="1.2" strokeDasharray="7 5" />
                <path d="M 0 200 L 80 200 L 110 230 L 220 230 L 250 260 L 600 260" fill="none" stroke="#398BFF" strokeWidth="1" strokeDasharray="5 6" />
                <path d="M 0 420 L 150 420 L 190 460 L 410 460 L 450 420 L 600 420" fill="none" stroke="#00D9F5" strokeWidth="1.2" strokeDasharray="8 4" />
                <path d="M 0 580 L 100 580 L 130 550 L 470 550 L 500 580 L 600 580" fill="none" stroke="#398BFF" strokeWidth="1" strokeDasharray="6 5" />

                {/* Vertical connectors */}
                <path d="M 160 100 L 160 200 L 110 230" fill="none" stroke="#00D9F5" strokeWidth="1" strokeDasharray="4 6" />
                <path d="M 440 100 L 440 180" fill="none" stroke="#398BFF" strokeWidth="0.9" />
                <path d="M 250 260 L 250 380 L 190 420" fill="none" stroke="#00D9F5" strokeWidth="1" strokeDasharray="5 5" />
                <path d="M 450 420 L 450 500 L 500 550" fill="none" stroke="#398BFF" strokeWidth="0.9" strokeDasharray="4 5" />

                {/* Glowing circuit nodes */}
                <circle cx="160" cy="100" r="3.5" fill="#00D9F5" className="form-node-pulse" style={{ color: "#00D9F5" }} />
                <circle cx="440" cy="100" r="3"   fill="#398BFF" className="form-node-pulse" />
                <circle cx="110" cy="230" r="3"   fill="#00D9F5" className="form-node-pulse" />
                <circle cx="250" cy="260" r="3.5" fill="#398BFF" className="form-node-pulse" />
                <circle cx="190" cy="460" r="3"   fill="#00D9F5" className="form-node-pulse" />
                <circle cx="500" cy="580" r="3"   fill="#398BFF" className="form-node-pulse" />

                {/* Right-side vertical rail */}
                <path d="M 540 80 L 540 620" fill="none" stroke="#00D9F5" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="10 8" />
                {/* Left-side vertical rail */}
                <path d="M 60 80 L 60 620" fill="none" stroke="#398BFF" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="10 8" />
              </svg>

              {/* Traveling Neon Laser Streak along Top Border */}
              <div className="panel-top-laser" aria-hidden="true" />

              {/* Futuristic Cyber Corner Brackets */}
              <div className="cyber-corner cyber-corner-tl" aria-hidden="true" />
              <div className="cyber-corner cyber-corner-tr" aria-hidden="true" />
              <div className="cyber-corner cyber-corner-bl" aria-hidden="true" />
              <div className="cyber-corner cyber-corner-br" aria-hidden="true" />

              {/* Form Status Bar */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono text-cyan-300">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
                  SECURE_COMMS_PORT_256
                </span>
                <span className="text-slate-400 text-[11px] uppercase tracking-wider hidden sm:inline">
                  AES-GCM // ENCRYPTED
                </span>
              </div>

              {/* Form Introduction */}
              <p className="relative z-10 text-[#C8D7ED] text-base sm:text-lg leading-relaxed text-center sm:text-left drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                Have questions about Picrypt or need support? Drop us a message below.
              </p>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
                {/* Field: Name */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-name"
                    className="block text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    className="cyber-input"
                    required
                  />
                </div>

                {/* Field: Email */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-email"
                    className="block text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase"
                  >
                    Your Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className="cyber-input"
                    required
                  />
                </div>

                {/* Field: Message */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-mono font-semibold tracking-wider text-cyan-300 uppercase"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    className="cyber-input min-h-[140px] resize-y"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="cyber-send-btn flex items-center justify-center gap-2.5 mt-2"
                >
                  <span>Send Message</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                    aria-hidden="true"
                  >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                </button>
              </form>

              {/* Secure Transmission Footer Note */}
              <div className="relative z-10 pt-2 text-center text-[11px] font-mono text-slate-400">
                <span>VERIFIED TLS TRANSMISSION · TAMPER-PROOF DELIVERY</span>
              </div>
            </div>
          </motion.div>

          {/* ════════ RIGHT COLUMN: THREE INFORMATION CARDS (EQUAL CONTAINER SIZE) ════════ */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full h-full flex flex-col justify-between gap-5"
          >

            {/* ── CARD 1: Vision & Mission (Cyan & Electric-Blue Circuit System) ── */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="info-card info-card-1 flex-1 flex flex-col justify-center"
            >
              {/* Animated Top Border Light Streak */}
              <div className="card-1-laser" aria-hidden="true" />

              {/* Corner Accent Ticks */}
              <div className="card-corner-tick card-tick-tl" aria-hidden="true" />
              <div className="card-corner-tick card-tick-br" aria-hidden="true" />

              {/* ── INTERNAL BACKGROUND: NEURAL NETWORK (CYAN & BLUE) ── */}
              <svg
                viewBox="0 0 400 140"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                aria-hidden="true"
                style={{ opacity: 0.28 }}
              >
                {/* Neural connection web */}
                <line x1="30"  y1="25"  x2="130" y2="60"  stroke="#00D9F5" strokeWidth="0.9" strokeOpacity="0.55" />
                <line x1="130" y1="60"  x2="230" y2="35"  stroke="#398BFF" strokeWidth="0.8" strokeOpacity="0.5" strokeDasharray="4 4" />
                <line x1="230" y1="35"  x2="330" y2="75"  stroke="#00D9F5" strokeWidth="0.9" strokeOpacity="0.55" />
                <line x1="330" y1="75"  x2="375" y2="45"  stroke="#398BFF" strokeWidth="0.8" strokeOpacity="0.45" />
                <line x1="130" y1="60"  x2="180" y2="105" stroke="#00D9F5" strokeWidth="0.8" strokeOpacity="0.4" />
                <line x1="180" y1="105" x2="280" y2="90"  stroke="#398BFF" strokeWidth="0.9" strokeOpacity="0.5" strokeDasharray="5 4" />
                <line x1="280" y1="90"  x2="330" y2="75"  stroke="#00D9F5" strokeWidth="0.8" strokeOpacity="0.45" />
                <line x1="80"  y1="100" x2="130" y2="60"  stroke="#398BFF" strokeWidth="0.7" strokeOpacity="0.4" strokeDasharray="3 5" />
                <line x1="230" y1="35"  x2="260" y2="115" stroke="#00D9F5" strokeWidth="0.7" strokeOpacity="0.35" />

                {/* Animated nodes – slow drift */}
                <circle cx="30"  cy="25"  r="2.8" fill="#00D9F5" className="c1-node-drift"   />
                <circle cx="130" cy="60"  r="3.5" fill="#398BFF" className="c1-node-drift-b" />
                <circle cx="230" cy="35"  r="3"   fill="#00D9F5" className="c1-node-drift"   />
                <circle cx="330" cy="75"  r="2.8" fill="#398BFF" className="c1-node-drift-b" />
                <circle cx="180" cy="105" r="2.5" fill="#00D9F5" className="c1-node-drift"   />
                <circle cx="280" cy="90"  r="3"   fill="#398BFF" className="c1-node-drift-b" />
                <circle cx="375" cy="45"  r="2.5" fill="#00D9F5" className="c1-node-drift"   />
                <circle cx="80"  cy="100" r="2.2" fill="#398BFF" className="c1-node-drift-b" />

                {/* Subtle ambient radial glow spot */}
                <radialGradient id="c1RadialGlow" cx="35%" cy="45%" r="55%">
                  <stop offset="0%"   stopColor="#00D9F5" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#00D9F5" stopOpacity="0" />
                </radialGradient>
                <rect x="0" y="0" width="400" height="140" fill="url(#c1RadialGlow)" />
              </svg>

              <div className="relative z-10 flex items-start gap-4">
                <div className="holo-icon-wrap holo-icon-1 relative" aria-hidden="true">
                  <div className="c1-icon-halo" />
                  <span className="relative z-10">🧠</span>
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-cyan-300 tracking-tight flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,217,245,0.4)]">
                    Vision & Mission
                  </h3>
                  <p className="text-[#C8D7ED] text-sm sm:text-base leading-relaxed font-normal">
                    Picrypt was founded to empower users with secure image encryption tools that are simple, private, and delightful to use.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── CARD 2: Tech Stack & Skills (Purple & Magenta Hexagonal Grid) ── */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="info-card info-card-2 flex-1 flex flex-col justify-center"
            >
              {/* Animated Top Border Light Streak */}
              <div className="card-2-laser" aria-hidden="true" />

              {/* Corner Accent Ticks */}
              <div className="card-corner-tick card-tick-tl" aria-hidden="true" />
              <div className="card-corner-tick card-tick-br" aria-hidden="true" />

              {/* ── INTERNAL BACKGROUND: DIGITAL HEX ARCHITECTURE (PURPLE & VIOLET) ── */}
              <svg
                viewBox="0 0 400 140"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                aria-hidden="true"
                style={{ opacity: 0.27 }}
              >
                <defs>
                  <radialGradient id="c2RadialGlow" cx="65%" cy="50%" r="55%">
                    <stop offset="0%"   stopColor="#9065F5" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#9065F5" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="400" height="140" fill="url(#c2RadialGlow)" />

                {/* Hexagonal grid outlines */}
                <polygon points="70,20  95,7  120,20  120,46  95,59  70,46"  fill="none" stroke="#9065F5" strokeWidth="0.85" strokeOpacity="0.55" />
                <polygon points="120,20 145,7  170,20  170,46  145,59  120,46" fill="none" stroke="#ED63CE" strokeWidth="0.8"  strokeOpacity="0.45" strokeDasharray="4 3" />
                <polygon points="95,59  120,46 145,59  145,85  120,98  95,85"  fill="none" stroke="#9065F5" strokeWidth="0.85" strokeOpacity="0.55" />
                <polygon points="145,59 170,46 195,59  195,85  170,98  145,85" fill="none" stroke="#6366F1" strokeWidth="0.8"  strokeOpacity="0.45" />
                <polygon points="220,15 245,2  270,15  270,41  245,54  220,41" fill="none" stroke="#ED63CE" strokeWidth="0.75" strokeOpacity="0.4"  strokeDasharray="3 4" />
                <polygon points="270,15 295,2  320,15  320,41  295,54  270,41" fill="none" stroke="#9065F5" strokeWidth="0.8"  strokeOpacity="0.5" />
                <polygon points="245,54 270,41 295,54  295,80  270,93  245,80" fill="none" stroke="#6366F1" strokeWidth="0.75" strokeOpacity="0.45" />

                {/* Interconnecting architecture paths */}
                <path d="M 0 80 L 70 80 L 95 59 L 145 59 L 170 80 L 400 80" fill="none" stroke="#9065F5" strokeWidth="1" strokeOpacity="0.4" />
                <path d="M 0 120 L 120 120 L 145 98 L 220 98 L 245 120 L 400 120" fill="none" stroke="#ED63CE" strokeWidth="0.85" strokeOpacity="0.35" strokeDasharray="6 5" />

                {/* Glowing connection nodes */}
                <circle cx="95"  cy="59"  r="2.8" fill="#9065F5" className="c2-node-blink"   />
                <circle cx="145" cy="59"  r="3.2" fill="#ED63CE" className="c2-node-blink-b" />
                <circle cx="170" cy="80"  r="2.5" fill="#9065F5" className="c2-node-blink"   />
                <circle cx="245" cy="54"  r="2.8" fill="#6366F1" className="c2-node-blink-b" />
                <circle cx="295" cy="54"  r="2.5" fill="#ED63CE" className="c2-node-blink"   />
                <circle cx="270" cy="93"  r="2.8" fill="#9065F5" className="c2-node-blink-b" />
              </svg>

              <div className="relative z-10 flex items-start gap-4">
                <div className="holo-icon-wrap holo-icon-2 relative" aria-hidden="true">
                  <div className="c2-icon-halo" />
                  <span className="relative z-10">🛠</span>
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-purple-300 tracking-tight flex items-center gap-2 drop-shadow-[0_0_8px_rgba(144,101,245,0.4)]">
                    Tech Stack & Skills
                  </h3>
                  <p className="text-[#C8D7ED] text-sm sm:text-base leading-relaxed font-normal">
                    The founders are skilled in React, Django , JavaScript, Python and IAM strategy — building apps that are both secure and visually engaging.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ── CARD 3: Connect with the Founder (Emerald Green & Cyan Network Mesh) ── */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              className="info-card info-card-3 flex-1 flex flex-col justify-center"
            >
              {/* Animated Top Border Light Streak */}
              <div className="card-3-laser" aria-hidden="true" />

              {/* Corner Accent Ticks */}
              <div className="card-corner-tick card-tick-tl" aria-hidden="true" />
              <div className="card-corner-tick card-tick-br" aria-hidden="true" />

              {/* ── INTERNAL BACKGROUND: SECURE COMMUNICATION MESH (GREEN & CYAN) ── */}
              <svg
                viewBox="0 0 400 140"
                preserveAspectRatio="none"
                className="absolute inset-0 w-full h-full pointer-events-none z-0"
                aria-hidden="true"
                style={{ opacity: 0.28 }}
              >
                <defs>
                  <radialGradient id="c3RadialGlow" cx="25%" cy="60%" r="55%">
                    <stop offset="0%"   stopColor="#00D6A0" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#00D6A0" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <rect x="0" y="0" width="400" height="140" fill="url(#c3RadialGlow)" />

                {/* Node constellation */}
                <line x1="40"  y1="30"  x2="120" y2="65"  stroke="#00D6A0" strokeWidth="0.9" strokeOpacity="0.55" />
                <line x1="120" y1="65"  x2="210" y2="40"  stroke="#00D9F5" strokeWidth="0.9" strokeOpacity="0.5"  strokeDasharray="5 4" />
                <line x1="210" y1="40"  x2="300" y2="70"  stroke="#00D6A0" strokeWidth="1"   strokeOpacity="0.55" />
                <line x1="300" y1="70"  x2="370" y2="45"  stroke="#00D9F5" strokeWidth="0.8" strokeOpacity="0.45" />
                <line x1="120" y1="65"  x2="160" y2="110" stroke="#00D6A0" strokeWidth="0.8" strokeOpacity="0.4"  strokeDasharray="4 5" />
                <line x1="160" y1="110" x2="260" y2="95"  stroke="#00D9F5" strokeWidth="0.9" strokeOpacity="0.5" />
                <line x1="260" y1="95"  x2="300" y2="70"  stroke="#00D6A0" strokeWidth="0.8" strokeOpacity="0.45" />
                <line x1="60"  y1="95"  x2="120" y2="65"  stroke="#00D9F5" strokeWidth="0.7" strokeOpacity="0.4"  strokeDasharray="3 5" />

                {/* Animated signal lines (travelling dashes) */}
                <line x1="40" y1="30" x2="370" y2="45" stroke="#00D6A0" strokeWidth="0.6" strokeOpacity="0.3" className="c3-signal-travel" />

                {/* Main data highway */}
                <path d="M 0 80 L 40 30 L 120 65 L 210 40 L 300 70 L 400 55"  fill="none" stroke="#00D6A0" strokeWidth="1.1" strokeOpacity="0.35" />
                <path d="M 0 115 L 60 95 L 160 110 L 260 95 L 370 115 L 400 115" fill="none" stroke="#00D9F5" strokeWidth="0.9" strokeOpacity="0.3"  strokeDasharray="7 5" />

                {/* Glowing constellation nodes */}
                <circle cx="40"  cy="30"  r="3"   fill="#00D6A0" className="c3-node-glow"   />
                <circle cx="120" cy="65"  r="3.8" fill="#00D9F5" className="c3-node-glow-b" />
                <circle cx="210" cy="40"  r="3"   fill="#00D6A0" className="c3-node-glow"   />
                <circle cx="300" cy="70"  r="3.2" fill="#00D9F5" className="c3-node-glow-b" />
                <circle cx="160" cy="110" r="2.8" fill="#00D6A0" className="c3-node-glow"   />
                <circle cx="260" cy="95"  r="3"   fill="#00D9F5" className="c3-node-glow-b" />
                <circle cx="370" cy="45"  r="2.5" fill="#00D6A0" className="c3-node-glow"   />
              </svg>

              <div className="relative z-10 flex items-start gap-4">
                <div className="holo-icon-wrap holo-icon-3 relative" aria-hidden="true">
                  <div className="c3-icon-halo" />
                  <span className="relative z-10">🌐</span>
                </div>
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-emerald-300 tracking-tight flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,214,160,0.4)]">
                    Connect with the Founder
                  </h3>
                  <p className="text-[#C8D7ED] text-sm sm:text-base leading-relaxed font-normal">
                    Reach out via GitHub, LinkedIn, Instagram or email to collaborate or ask questions. They love solving problems and exploring ideas with the tech community.
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
