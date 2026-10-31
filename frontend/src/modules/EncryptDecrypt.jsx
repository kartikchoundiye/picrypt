// frontend/src/modules/EncryptDecrypt.jsx
import { motion } from "framer-motion";
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
  return (
    <div className="edp-page-root w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 relative overflow-hidden">

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

      {/* ===== ENCRYPT & DECRYPT WORKING CONTAINERS (Vertically Stacked on Mobile/Tablet, Two Columns on Desktop) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto relative z-10 items-stretch">
        <EncryptForm />
        <DecryptForm />
      </div>

      {/* ===== STEGANOGRAPHIC SECURITY PIPELINE (Fills empty gaps & explains the technology) ===== */}
      <section className="mt-10 sm:mt-14 pt-8 border-t border-cyan-500/20 max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0a1324] border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest shadow-[0_0_12px_rgba(0,217,245,0.2)] mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Security Pipeline // 3-Phase Steganography
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How PICRYPT Conceals & Protects Your Data
          </h3>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
            Combining military-grade AES-256 encryption with imperceptible Least Significant Bit (LSB) pixel encoding.
          </p>
        </div>

        {/* 3 Responsive Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {/* Card 1: Carrier Ingestion */}
          <div className="relative rounded-2xl p-6 bg-[#0c1629]/80 border border-cyan-500/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between group hover:border-cyan-400 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl p-2.5 rounded-xl bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(0,217,245,0.25)]">
                  🖼️
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-400 bg-cyan-950/50 px-2.5 py-1 rounded-full border border-cyan-500/20">
                  Phase 01 // Ingestion
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Carrier Image Analysis
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Upload any standard PNG, JPG, or BMP image. PICRYPT instantly analyzes the pixel grid matrix and calculates the exact embedding capacity with zero visual degradation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-cyan-500/15 flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Lossless Format Preservation
            </div>
          </div>

          {/* Card 2: AES-256 Encryption */}
          <div className="relative rounded-2xl p-6 bg-[#0c1629]/80 border border-purple-500/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between group hover:border-purple-400 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl p-2.5 rounded-xl bg-purple-950/70 border border-purple-500/40 text-purple-300 shadow-[0_0_12px_rgba(144,101,245,0.25)]">
                  🔐
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-purple-400 bg-purple-950/50 px-2.5 py-1 rounded-full border border-purple-500/20">
                  Phase 02 // Cipher
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Zero-Knowledge Encryption
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Before injection, your secret payload is encrypted using AES-256 bit keys. Your passphrase stays private in your browser and is never stored or logged on any server.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center gap-2 text-xs font-mono text-purple-400">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              AES-256 Bit Cryptographic Core
            </div>
          </div>

          {/* Card 3: Steganographic Recovery */}
          <div className="relative rounded-2xl p-6 bg-[#0c1629]/80 border border-emerald-500/30 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] flex flex-col justify-between group hover:border-emerald-400 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-[0_0_12px_rgba(0,214,160,0.25)]">
                  ⚡
                </span>
                <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Phase 03 // Extraction
                </span>
              </div>
              <h4 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                Lossless Stego Extraction
              </h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Download your stego-carrier and share it via any channel. The intended recipient enters the matching decryption key to restore the exact original payload with 100% integrity.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-emerald-500/15 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Bit-for-Bit Hash Verification
            </div>
          </div>
        </div>

        {/* Telemetry and Specs Strip */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-[#091120]/90 border border-cyan-500/20 backdrop-blur-md flex flex-wrap items-center justify-around gap-4 text-xs sm:text-sm font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00D9F5]" />
            <span className="text-slate-400">CIPHER:</span>
            <span className="text-cyan-300 font-semibold">AES-256-CBC</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse shadow-[0_0_8px_#9065F5]" />
            <span className="text-slate-400">METHOD:</span>
            <span className="text-purple-300 font-semibold">LSB Steganography</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#00D6A0]" />
            <span className="text-slate-400">PRIVACY:</span>
            <span className="text-emerald-300 font-semibold">100% Zero-Knowledge</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse shadow-[0_0_8px_#14B8A6]" />
            <span className="text-slate-400">STORAGE:</span>
            <span className="text-teal-300 font-semibold">Zero Server Retention</span>
          </div>
        </div>
      </section>
    </div>
  );
}
