// frontend/src/modules/EncryptDecrypt.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EncryptForm from "../components/EncryptForm";
import DecryptForm from "../components/DecryptForm";

const PARTICLES = [
  { size: 3, top: "12%", left: "10%", dur: "4.2s", delay: "0s", color: "#00D9F5" },
  { size: 4, top: "25%", left: "85%", dur: "4.8s", delay: "0.8s", color: "#00D6A0" },
  { size: 2.5, top: "50%", left: "8%", dur: "3.5s", delay: "1.4s", color: "#398BFF" },
  { size: 3.5, top: "68%", left: "90%", dur: "4.5s", delay: "0.3s", color: "#00D9F5" },
  { size: 2, top: "82%", left: "15%", dur: "3.8s", delay: "1.1s", color: "#9065F5" },
  { size: 3, top: "88%", left: "82%", dur: "4.0s", delay: "1.7s", color: "#00D6A0" },
];

export default function EncryptDecrypt() {
  const [mobileTab, setMobileTab] = useState("encrypt");

  return (
    <div className="edp-page-root min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 relative overflow-hidden">

      {/* ===== BACKGROUND DIGITAL PARTICLES LAYER ===== */}
      <div className="edp-particles-layer" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="ctc-particle"
            style={{
              width: p.size,
              height: p.size,
              top: p.top,
              left: p.left,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`,
              animationDuration: p.dur,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* ===== MAIN HEADER AND BRANDING ===== */}
      <div className="text-center space-y-3 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="ctc-heading-wrapper inline-block"
        >
          <h1 className="ctc-neon-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            PICRYPT
          </h1>
          <div className="ctc-heading-beam" aria-hidden="true" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-base sm:text-lg lg:text-xl font-medium text-slate-200 tracking-wide"
        >
          Image-Based Encryption & Decryption
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed"
        >
          Protect your data by hiding it securely inside images
        </motion.p>

        {/* ===== ANIMATED NEON UNDERLINE ===== */}
        <div className="flex justify-center pt-2">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="ctc-neon-underline"
          />
        </div>
      </div>

      {/* ===== ENCRYPTION DATA FLOW TELEMETRY CONDUIT (Desktop / Laptop) ===== */}
      <div className="hidden lg:flex items-center justify-between max-w-4xl mx-auto px-6 py-2.5 rounded-full bg-[#0a1324]/80 border border-cyan-500/25 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.5)] text-xs font-mono relative z-10">
        <span className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-[11px]">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse inline-block shadow-[0_0_8px_#00D9F5]" />
          ENCRYPT_ENGINE
        </span>

        <div className="flex-1 mx-6 relative flex items-center justify-center">
          <div className="w-full h-0.5 bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-emerald-500/30 relative overflow-hidden rounded-full">
            <div className="edp-stream-pulse" />
          </div>
          <span className="absolute px-3 py-0.5 rounded-md bg-[#070e1c] border border-cyan-500/30 text-[10px] tracking-widest text-cyan-300 uppercase shadow-inner">
            AES-256 // STEGO_TUNNEL
          </span>
        </div>

        <span className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider text-[11px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block shadow-[0_0_8px_#00D6A0]" />
          DECRYPT_ENGINE
        </span>
      </div>

      {/* ===== DESKTOP & TABLET TWO-COLUMN LAYOUT ===== */}
      <div className="hidden md:grid grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto relative z-10 items-stretch">
        <EncryptForm />
        <DecryptForm />
      </div>

      {/* ===== MOBILE VIEW (With Cyber Tab Switcher) ===== */}
      <div className="md:hidden space-y-6 relative z-10">
        {/* MOBILE TOGGLE SWITCHER */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl border border-cyan-500/25 bg-[#0a1324]/90 backdrop-blur-md shadow-inner p-1">
            <button
              onClick={() => setMobileTab("encrypt")}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                mobileTab === "encrypt"
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,217,245,0.4)] scale-102"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔒 Encryption
            </button>

            <button
              onClick={() => setMobileTab("decrypt")}
              className={`px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                mobileTab === "decrypt"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_15px_rgba(0,214,160,0.4)] scale-102"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              🔑 Decryption
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mobileTab === "encrypt" && (
            <motion.div
              key="encrypt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <EncryptForm isMobileActive={mobileTab === "encrypt"} />
            </motion.div>
          )}

          {mobileTab === "decrypt" && (
            <motion.div
              key="decrypt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DecryptForm isMobileActive={mobileTab === "decrypt"} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
