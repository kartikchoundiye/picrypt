// frontend/src/components/CyberTechCard.jsx

import { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";

/**
 * PICRYPT — 6 UNIQUE ENCRYPTION TECHNOLOGY 3D CYBER GLASS CARDS
 *
 * Visual Identity:
 * - Matching the premium dark cybernetic 3D glassmorphic style of the Why Trust on PICRYPT carousel.
 * - Deep midnight navy glass base (rgba(16, 26, 48, 0.94) to rgba(7, 13, 28, 0.98))
 * - Cybernetic corner brackets, floating digital particles, holographic sheen, diagonal laser reflection
 * - Clean top area (NO PICRYPT // ENCRYPTION_ENGINE label)
 * - 6 Individual visual background animations & individually designed borders:
 *   1. AES-256 (🔒): Secure Energy Core (expanding radial energy ripples, fine light trails, moving cyan beam)
 *   2. End-to-End (🔑): Dual Light Connection (two luminous nodes, smooth curved light path, traveling pulse)
 *   3. Zero-Knowledge (❌): Privacy Aurora (slow-moving aurora ribbons, deep-blue/violet shadows, soft corner glow)
 *   4. Multi-Layer (🛡️): Layered Protection (multi-depth curved shield layers, sequential pulse, double-layer border)
 *   5. Future-Proof (🔮): Holographic Light Field (gradient mesh shift, floating particles, violet-magenta border)
 *   6. Secure Key Management (🔐): Secure Energy Orb (radial orb ripples, orbiting points, cyan-golden highlight)
 */

const PARTICLES_BY_CARD = [
  // 1: AES-256 (🔒)
  [
    { size: 3, top: "18%", left: "16%", dur: "3.6s", delay: "0s", color: "#00D9F5" },
    { size: 4, top: "72%", left: "80%", dur: "4.4s", delay: "1.0s", color: "#398BFF" },
    { size: 2.5, top: "42%", left: "86%", dur: "3.2s", delay: "0.4s", color: "#00D9F5" },
    { size: 3, top: "84%", left: "24%", dur: "4.0s", delay: "1.6s", color: "#398BFF" },
  ],
  // 2: End-to-End (🔑)
  [
    { size: 3.5, top: "20%", left: "80%", dur: "4.0s", delay: "0.4s", color: "#00D9F5" },
    { size: 2.5, top: "68%", left: "15%", dur: "3.5s", delay: "1.0s", color: "#9065F5" },
    { size: 4, top: "35%", left: "20%", dur: "4.6s", delay: "1.6s", color: "#398BFF" },
    { size: 3, top: "82%", left: "76%", dur: "3.8s", delay: "0.8s", color: "#9065F5" },
  ],
  // 3: Zero-Knowledge (❌)
  [
    { size: 3, top: "22%", left: "22%", dur: "3.9s", delay: "0.2s", color: "#9065F5" },
    { size: 4, top: "65%", left: "85%", dur: "4.4s", delay: "1.4s", color: "#3B82F6" },
    { size: 2.5, top: "80%", left: "30%", dur: "3.4s", delay: "0.9s", color: "#9065F5" },
    { size: 3.5, top: "40%", left: "78%", dur: "4.6s", delay: "1.7s", color: "#1D4ED8" },
  ],
  // 4: Multi-Layer (🛡️)
  [
    { size: 3.5, top: "25%", left: "85%", dur: "4.0s", delay: "0.5s", color: "#00D9F5" },
    { size: 2.5, top: "70%", left: "18%", dur: "3.6s", delay: "1.1s", color: "#398BFF" },
    { size: 4, top: "48%", left: "15%", dur: "4.5s", delay: "1.5s", color: "#00D9F5" },
    { size: 3, top: "82%", left: "78%", dur: "3.8s", delay: "0.3s", color: "#398BFF" },
  ],
  // 5: Future-Proof (🔮)
  [
    { size: 3, top: "16%", left: "28%", dur: "3.7s", delay: "0.6s", color: "#ED63CE" },
    { size: 4, top: "72%", left: "75%", dur: "4.3s", delay: "1.3s", color: "#9065F5" },
    { size: 2.5, top: "40%", left: "85%", dur: "3.3s", delay: "0.8s", color: "#ED63CE" },
    { size: 3.5, top: "85%", left: "20%", dur: "4.7s", delay: "1.9s", color: "#9065F5" },
  ],
  // 6: Secure Key Management (🔐)
  [
    { size: 3, top: "20%", left: "80%", dur: "4.1s", delay: "0.3s", color: "#F59E0B" },
    { size: 4, top: "68%", left: "20%", dur: "4.6s", delay: "1.1s", color: "#00D9F5" },
    { size: 2.5, top: "46%", left: "25%", dur: "3.5s", delay: "0.7s", color: "#F59E0B" },
    { size: 3.5, top: "82%", left: "70%", dur: "3.9s", delay: "1.5s", color: "#00D9F5" },
  ],
];


const DYNAMIC_BORDER_PALETTES = [
  // 1. AES-256: Cyan -> Electric Blue -> Neon Teal -> Violet -> Cyan
  ["#00D9F5", "#398BFF", "#06B6D4", "#9065F5"],
  // 2. End-to-End: Electric Blue -> Indigo -> Violet -> Magenta -> Electric Blue
  ["#398BFF", "#6366F1", "#9065F5", "#ED63CE"],
  // 3. Zero-Knowledge: Violet -> Purple -> Magenta -> Cyan -> Violet
  ["#9065F5", "#A855F7", "#ED63CE", "#00D9F5"],
  // 4. Multi-Layer: Cyan -> Sky Blue -> Cobalt -> Emerald -> Cyan
  ["#00D9F5", "#38BDF8", "#2563EB", "#10B981"],
  // 5. Future-Proof: Magenta -> Violet -> Cyan -> Electric Blue -> Magenta
  ["#ED63CE", "#9065F5", "#00D9F5", "#398BFF"],
  // 6. Secure Key: Amber Gold -> Orange -> Cyan -> Violet -> Amber Gold
  ["#F59E0B", "#F97316", "#00D9F5", "#9065F5"],
];

export default function CyberTechCard({ icon, title, description, idx = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef(null);
  const [sheenStyle, setSheenStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const cardIndex = idx % 6;
  const borderClass = `etc-border-${cardIndex + 1}`;
  const particles = PARTICLES_BY_CARD[cardIndex] || PARTICLES_BY_CARD[0];
  const palette = DYNAMIC_BORDER_PALETTES[cardIndex] || DYNAMIC_BORDER_PALETTES[0];

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setSheenStyle({ opacity: 1, x: px, y: py });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setSheenStyle((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <motion.div
      ref={cardRef}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={() => setExpanded(!expanded)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setExpanded(!expanded);
        }
      }}
      className={`ctc-root etc-card-base ${borderClass} group relative flex flex-col justify-between items-center text-center cursor-pointer select-none overflow-hidden p-6 sm:p-7 rounded-2xl w-full min-h-[260px] transition-all duration-300`}
      layout
    >
      {/* 1. DARK NAVY & MIDNIGHT GLASS BASE */}
      <div className="ctc-glass-base" aria-hidden="true" />

      {/* 2. CARD-SPECIFIC UNIQUE BACKGROUND ARTWORK */}
      <div className="ctc-artwork-layer" aria-hidden="true">
        {cardIndex === 0 && <ArtworkSecureEnergyCore />}
        {cardIndex === 1 && <ArtworkDualLightConnection />}
        {cardIndex === 2 && <ArtworkPrivacyAurora />}
        {cardIndex === 3 && <ArtworkLayeredProtection />}
        {cardIndex === 4 && <ArtworkHolographicLightField />}
        {cardIndex === 5 && <ArtworkSecureEnergyOrb />}
      </div>

      {/* 3. DIGITAL PARTICLES LAYER */}
      <div className="ctc-particles-layer" aria-hidden="true">
        {particles.map((p, i) => (
          <span
            key={i}
            className="ctc-particle"
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

      {/* 4. DYNAMIC ANIMATED MULTI-COLOR BORDER BEAM (Applies to all boxes) */}
      <svg className="ctc-border-svg" aria-hidden="true">
        <defs>
          <linearGradient id={`dynBeamGrad-${cardIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette[0]}>
              <animate
                attributeName="stop-color"
                values={`${palette[0]};${palette[1]};${palette[2]};${palette[3]};${palette[0]}`}
                dur="5.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor={palette[1]}>
              <animate
                attributeName="stop-color"
                values={`${palette[1]};${palette[2]};${palette[3]};${palette[0]};${palette[1]}`}
                dur="5.5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor={palette[2]}>
              <animate
                attributeName="stop-color"
                values={`${palette[2]};${palette[3]};${palette[0]};${palette[1]};${palette[2]}`}
                dur="5.5s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          <filter id={`dynBeamGlow-${cardIndex}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Subtle perimeter border track */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="16"
          pathLength="1000"
          className="etc-border-track"
        />
        {/* Luminous dynamic traveling color border beam */}
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="16"
          pathLength="1000"
          fill="none"
          stroke={`url(#dynBeamGrad-${cardIndex})`}
          strokeWidth="2.5"
          strokeLinecap="round"
          className="etc-dynamic-beam"
          filter={`url(#dynBeamGlow-${cardIndex})`}
        />
      </svg>

      {/* 5. CYBERNETIC CORNER BRACKETS */}
      <div className="ctc-corner-bracket top-left" aria-hidden="true" />
      <div className="ctc-corner-bracket top-right" aria-hidden="true" />
      <div className="ctc-corner-bracket bottom-left" aria-hidden="true" />
      <div className="ctc-corner-bracket bottom-right" aria-hidden="true" />

      {/* 6. CARD-SPECIFIC ACCENT CORNER HIGHLIGHTS */}
      {cardIndex === 2 && (
        <>
          <div className="etc-zk-corner-glow top-0 left-0" aria-hidden="true" />
          <div className="etc-zk-corner-glow top-0 right-0" aria-hidden="true" />
          <div className="etc-zk-corner-glow bottom-0 left-0" aria-hidden="true" />
          <div className="etc-zk-corner-glow bottom-0 right-0" aria-hidden="true" />
        </>
      )}
      {cardIndex === 3 && <div className="etc-multi-inner-border" aria-hidden="true" />}
      {cardIndex === 5 && (
        <>
          <div className="etc-gold-corner top-right" aria-hidden="true" />
          <div className="etc-gold-corner bottom-left" aria-hidden="true" />
        </>
      )}

      {/* 7. HOLOGRAPHIC MOUSE-FOLLOW SHEEN */}
      <div
        className="ctc-sheen-overlay"
        style={{
          opacity: sheenStyle.opacity,
          background: `radial-gradient(circle at ${sheenStyle.x}% ${sheenStyle.y}%, rgba(0, 217, 245, 0.28) 0%, rgba(135, 60, 255, 0.16) 38%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* 8. DIAGONAL GLASS REFLECTION SWEEP */}
      <div className="ctc-laser-sweep" aria-hidden="true" />

      {/* 9. TOP CONTENT AREA (Clean & balanced, no technical label) */}
      <div className="relative z-10 flex flex-col items-center w-full mt-1 mb-auto">
        {/* Animated Cyber Icon Container with Individual Accent Glow */}
        <div className="ctc-icon-wrapper mb-4 flex items-center justify-center">
          <div className="ctc-icon-glow" aria-hidden="true" />
          <span className="text-3xl sm:text-4xl ctc-icon-glyph select-none" role="img" aria-label={title}>
            {icon}
          </span>
        </div>

        {/* Heading */}
        <h3 className="ctc-heading font-bold text-lg sm:text-xl mb-2 text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {title}
        </h3>

        {/* Description: Collapsible with smooth Framer Motion expansion */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="overflow-hidden w-full"
        >
          <p className="ctc-description text-slate-300 text-xs sm:text-sm leading-relaxed text-center pt-2 px-1 font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
            {description}
          </p>
        </motion.div>
      </div>

      {/* 10. BOTTOM ACTION PROMPT & TELEMETRY STATUS */}
      <div className="relative z-10 mt-5 pt-3 border-t border-cyan-500/15 w-full flex items-center justify-between text-xs font-mono">
        <span className="text-cyan-400 group-hover:text-cyan-300 font-semibold inline-flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
          <span>{expanded ? "Show less" : "Tap to read more"}</span>
          <svg
            className={`w-3.5 h-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <span className="text-slate-400 text-[10px] tracking-widest uppercase">
          256-BIT SECURE
        </span>
      </div>
    </motion.div>
  );
}

/* ==========================================================================
   CARD 1 ARTWORK — SECURE ENERGY CORE (AES-256 🔒)
   Dark navy-to-deep-blue radial backdrop, expanding energy ripples,
   and fine drifting encrypted-data light trails.
   ========================================================================== */
function ArtworkSecureEnergyCore() {
  return (
    <svg viewBox="0 0 280 240" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="aesCoreGlow" cx="50%" cy="32%" r="60%">
          <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.32" />
          <stop offset="50%" stopColor="#0E1B33" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#aesCoreGlow)" />

      {/* Concentric expanding energy waves radiating behind the lock */}
      <circle cx="140" cy="75" r="42" fill="none" stroke="#00D9F5" strokeWidth="1.2" opacity="0.4" style={{ animation: "etcAesPulseWave 4.5s ease-in-out infinite" }} />
      <circle cx="140" cy="75" r="64" fill="none" stroke="#398BFF" strokeWidth="1" strokeDasharray="16 10" opacity="0.3" style={{ animation: "etcAesPulseWave 5.5s ease-in-out infinite 0.8s" }} />
      <circle cx="140" cy="75" r="86" fill="none" stroke="#00D9F5" strokeWidth="0.8" opacity="0.2" style={{ animation: "etcAesPulseWave 6.5s ease-in-out infinite 1.6s" }} />

      {/* Fine undulating light trails */}
      <path d="M 15 150 C 70 120, 120 180, 200 140 C 240 120, 260 160, 275 150" fill="none" stroke="#00D9F5" strokeWidth="1.2" opacity="0.35" />
      <path d="M 25 185 C 90 160, 160 210, 255 175" fill="none" stroke="#398BFF" strokeWidth="1" opacity="0.25" />

      {/* Tiny stardust particles */}
      <circle cx="65" cy="110" r="2.5" fill="#00D9F5" opacity="0.75" />
      <circle cx="215" cy="65" r="2" fill="#00D9F5" opacity="0.6" />
      <circle cx="180" cy="190" r="2" fill="#398BFF" opacity="0.6" />
    </svg>
  );
}

/* ==========================================================================
   CARD 2 ARTWORK — DUAL LIGHT CONNECTION (End-to-End 🔑)
   Two subtle luminous energy nodes with a smooth curved S-path and
   traveling progressive illumination.
   ========================================================================== */
function ArtworkDualLightConnection() {
  return (
    <svg viewBox="0 0 280 240" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="e2eNodeGlow1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.45" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="e2eNodeGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#9065F5" stopOpacity="0.45" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="e2eCurvedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#398BFF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#9065F5" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Background ambient lighting */}
      <circle cx="45" cy="55" r="45" fill="url(#e2eNodeGlow1)" />
      <circle cx="235" cy="185" r="45" fill="url(#e2eNodeGlow2)" />

      {/* Base smooth curved connection path */}
      <path d="M 45 55 C 130 15, 150 225, 235 185" fill="none" stroke="url(#e2eCurvedGrad)" strokeWidth="1.6" opacity="0.4" />

      {/* Traveling illuminated pulse along the curved path */}
      <path
        d="M 45 55 C 130 15, 150 225, 235 185"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="24 160"
        style={{ animation: "etcE2ePathFlow 4.5s linear infinite" }}
      />

      {/* Two luminous energy terminal nodes */}
      <circle cx="45" cy="55" r="5" fill="#00D9F5" />
      <circle cx="45" cy="55" r="8" fill="none" stroke="#00D9F5" strokeWidth="1.2" opacity="0.6" />

      <circle cx="235" cy="185" r="5" fill="#9065F5" />
      <circle cx="235" cy="185" r="8" fill="none" stroke="#9065F5" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

/* ==========================================================================
   CARD 3 ARTWORK — PRIVACY AURORA (Zero-Knowledge ❌)
   Dark blue-black glass with translucent slow-drifting aurora waves
   and soft concentric fading behind the X icon.
   ========================================================================== */
function ArtworkPrivacyAurora() {
  return (
    <svg viewBox="0 0 280 240" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="zkCenterGlow" cx="50%" cy="32%" r="55%">
          <stop offset="0%" stopColor="#9065F5" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#1D4ED8" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="auroraWaveGrad1" x1="0%" y1="0%" x2="100%" y2="80%">
          <stop offset="0%" stopColor="#9065F5" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#1D4ED8" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#zkCenterGlow)" />

      {/* Soft concentric fading aura behind the icon */}
      <circle cx="140" cy="75" r="50" fill="none" stroke="#9065F5" strokeWidth="1" opacity="0.3" />
      <circle cx="140" cy="75" r="75" fill="none" stroke="#1D4ED8" strokeWidth="0.8" opacity="0.2" />

      {/* Flowing translucent aurora waves */}
      <path
        d="M -20 120 C 60 80, 100 160, 180 110 C 230 80, 270 140, 310 100 L 310 240 L -20 240 Z"
        fill="url(#auroraWaveGrad1)"
        style={{ animation: "etcAuroraFlow 8s ease-in-out infinite alternate" }}
      />
      <path
        d="M -10 160 C 80 130, 130 190, 210 150 C 260 120, 280 180, 310 140"
        fill="none"
        stroke="#9065F5"
        strokeWidth="1.2"
        opacity="0.3"
      />
    </svg>
  );
}

/* ==========================================================================
   CARD 4 ARTWORK — LAYERED PROTECTION (Multi-Layer 🛡️)
   Multi-depth shield contours that gently breathe and pulse in sequence.
   ========================================================================== */
function ArtworkLayeredProtection() {
  return (
    <svg viewBox="0 0 280 240" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="shieldRadial" cx="50%" cy="32%" r="55%">
          <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#1E3A8A" stopOpacity="0.10" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#shieldRadial)" />

      {/* Outer shield perimeter */}
      <path
        d="M 140 30 Q 190 30 205 75 Q 205 130 140 165 Q 75 130 75 75 Q 90 30 140 30 Z"
        fill="none"
        stroke="#00D9F5"
        strokeWidth="1.2"
        opacity="0.3"
        style={{ animation: "etcShieldFloat1 6s ease-in-out infinite alternate" }}
      />

      {/* Middle defensive contour */}
      <path
        d="M 140 42 Q 180 42 192 78 Q 192 122 140 152 Q 88 122 88 78 Q 100 42 140 42 Z"
        fill="rgba(57, 139, 255, 0.08)"
        stroke="#398BFF"
        strokeWidth="1.4"
        opacity="0.45"
        style={{ animation: "etcShieldFloat2 5s ease-in-out infinite alternate" }}
      />

      {/* Inner energy core contour */}
      <path
        d="M 140 56 Q 168 56 178 82 Q 178 114 140 136 Q 102 114 102 82 Q 112 56 140 56 Z"
        fill="none"
        stroke="#00D9F5"
        strokeWidth="1.2"
        strokeDasharray="6 4"
        opacity="0.55"
      />

      {/* Protective horizontal scan rays */}
      <line x1="50" y1="180" x2="230" y2="180" stroke="#00D9F5" strokeWidth="1" strokeDasharray="12 8" opacity="0.3" />
      <line x1="70" y1="195" x2="210" y2="195" stroke="#398BFF" strokeWidth="0.8" opacity="0.2" />
    </svg>
  );
}

/* ==========================================================================
   CARD 5 ARTWORK — HOLOGRAPHIC LIGHT FIELD (Future-Proof 🔮)
   Deep indigo with dynamic shifting gradient mesh & floating stardust.
   ========================================================================== */
function ArtworkHolographicLightField() {
  return (
    <svg viewBox="0 0 280 240" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="holoGlowMesh1" cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#9065F5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="holoGlowMesh2" cx="70%" cy="65%" r="55%">
          <stop offset="0%" stopColor="#ED63CE" stopOpacity="0.35" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="holoRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9065F5" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#ED63CE" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#00D9F5" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Shifting holographic energy pools */}
      <circle cx="95" cy="80" r="75" fill="url(#holoGlowMesh1)" style={{ animation: "etcHoloMeshShift 7s ease-in-out infinite alternate" }} />
      <circle cx="190" cy="150" r="85" fill="url(#holoGlowMesh2)" style={{ animation: "etcHoloMeshShift 8s ease-in-out infinite alternate-reverse" }} />

      {/* Diagonal holographic refractive ribbons */}
      <path d="M 0 60 Q 140 130 280 90" fill="none" stroke="url(#holoRibbonGrad)" strokeWidth="1.5" opacity="0.45" />
      <path d="M 0 140 Q 130 80 280 160" fill="none" stroke="url(#holoRibbonGrad)" strokeWidth="1.2" opacity="0.35" />

      {/* Floating stardust prisms */}
      <polygon points="60,60 63,66 60,72 57,66" fill="#ED63CE" opacity="0.75" />
      <polygon points="225,75 228,81 225,87 222,81" fill="#00D9F5" opacity="0.75" />
      <polygon points="175,175 178,181 175,187 172,181" fill="#9065F5" opacity="0.8" />
      <polygon points="85,185 87,190 85,195 83,190" fill="#ED63CE" opacity="0.6" />
    </svg>
  );
}

/* ==========================================================================
   CARD 6 ARTWORK — SECURE ENERGY ORB (Secure Key Management 🔐)
   Concentric expanding waves and orbiting key security nodes.
   ========================================================================== */
function ArtworkSecureEnergyOrb() {
  return (
    <svg viewBox="0 0 280 240" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="orbGlow" cx="50%" cy="32%" r="50%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#00D9F5" stopOpacity="0.18" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <rect width="100%" height="100%" fill="url(#orbGlow)" />

      {/* Concentric expanding ripples around the key lock */}
      <circle cx="140" cy="75" r="38" fill="none" stroke="#F59E0B" strokeWidth="1.2" opacity="0.45" style={{ animation: "etcOrbWave 4.5s ease-in-out infinite" }} />
      <circle cx="140" cy="75" r="58" fill="none" stroke="#00D9F5" strokeWidth="1" strokeDasharray="14 8" opacity="0.35" style={{ animation: "etcOrbWave 5.5s ease-in-out infinite 0.9s" }} />
      <circle cx="140" cy="75" r="78" fill="none" stroke="#F59E0B" strokeWidth="0.8" strokeDasharray="8 6" opacity="0.25" style={{ animation: "etcOrbWave 6.5s ease-in-out infinite 1.8s" }} />

      {/* Orbiting key points */}
      <circle cx="95" cy="55" r="3.5" fill="#F59E0B" opacity="0.8" />
      <circle cx="185" cy="95" r="3" fill="#00D9F5" opacity="0.8" />

      {/* Radiating baseline telemetry lines */}
      <line x1="40" y1="180" x2="120" y2="180" stroke="#00D9F5" strokeWidth="1" strokeDasharray="8 6" opacity="0.3" />
      <line x1="160" y1="180" x2="240" y2="180" stroke="#F59E0B" strokeWidth="1" strokeDasharray="8 6" opacity="0.3" />
      <circle cx="140" cy="180" r="4" fill="none" stroke="#00D9F5" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}
