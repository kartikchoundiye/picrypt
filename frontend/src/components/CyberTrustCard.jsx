// frontend/src/components/CyberTrustCard.jsx

import { useState, useRef, useCallback } from "react";

/**
 * PICRYPT — 8 PREMIUM CYBERSECURITY GLASSMORPHISM TRUST CARDS
 *
 * 8 Dedicated Architectural Archetypes:
 * 1. User-Friendly Interface  (🎨) -> Dynamic cyber canvas & glowing UI node grid
 * 2. Advanced Algorithms      (🧩) -> Hexagonal mathematical matrix & cryptographic lattice
 * 3. Regular Updates          (🔄) -> Orbital refresh rings & cyclical sync telemetry
 * 4. Privacy Protection       (🔒) -> Central defensive cyber shield & security radar arcs
 * 5. Secure Sharing           (📤) -> Peer-to-peer data conduits & packet transfer nodes
 * 6. High Speed Encryption    (⚡) -> Kinetic supersonic neon streaks & telemetry chevrons
 * 7. Cross-Platform Support   (🌐) -> Global cybernetic meridian sphere & distributed mesh
 * 8. Multi-User Support       (👥) -> Clustered multi-agent cryptographic identity rings
 */

const PARTICLES_BY_CARD = [
  // 1: User-Friendly Interface
  [
    { size: 3, top: "18%", left: "16%", dur: "3.6s", delay: "0s", color: "#00D9F5" },
    { size: 4, top: "72%", left: "80%", dur: "4.4s", delay: "1.0s", color: "#F59E0B" },
    { size: 2.5, top: "42%", left: "86%", dur: "3.2s", delay: "0.4s", color: "#873CFF" },
    { size: 3, top: "84%", left: "24%", dur: "4.0s", delay: "1.6s", color: "#00D9F5" },
  ],
  // 2: Advanced Algorithms
  [
    { size: 3, top: "20%", left: "15%", dur: "3.8s", delay: "0s", color: "#00D9F5" },
    { size: 4, top: "75%", left: "82%", dur: "4.5s", delay: "1.2s", color: "#873CFF" },
    { size: 2.5, top: "45%", left: "88%", dur: "3.2s", delay: "0.5s", color: "#F02ACB" },
    { size: 3, top: "82%", left: "22%", dur: "4.0s", delay: "1.8s", color: "#00D9F5" },
  ],
  // 3: Regular Updates
  [
    { size: 3.5, top: "18%", left: "80%", dur: "4.2s", delay: "0.4s", color: "#00D9F5" },
    { size: 2.5, top: "68%", left: "12%", dur: "3.5s", delay: "1.0s", color: "#06B6D4" },
    { size: 4, top: "35%", left: "18%", dur: "4.8s", delay: "1.6s", color: "#873CFF" },
    { size: 3, top: "85%", left: "75%", dur: "3.6s", delay: "0.8s", color: "#00D9F5" },
  ],
  // 4: Privacy Protection
  [
    { size: 3, top: "22%", left: "25%", dur: "3.9s", delay: "0.2s", color: "#873CFF" },
    { size: 4, top: "65%", left: "85%", dur: "4.4s", delay: "1.4s", color: "#00D9F5" },
    { size: 2.5, top: "80%", left: "30%", dur: "3.4s", delay: "0.9s", color: "#3B82F6" },
    { size: 3.5, top: "40%", left: "78%", dur: "4.6s", delay: "1.7s", color: "#873CFF" },
  ],
  // 5: Secure Sharing
  [
    { size: 3.5, top: "25%", left: "85%", dur: "4.0s", delay: "0.5s", color: "#00D9F5" },
    { size: 2.5, top: "70%", left: "20%", dur: "3.6s", delay: "1.1s", color: "#10B981" },
    { size: 4, top: "48%", left: "14%", dur: "4.5s", delay: "1.5s", color: "#00D9F5" },
    { size: 3, top: "82%", left: "80%", dur: "3.8s", delay: "0.3s", color: "#10B981" },
  ],
  // 6: High Speed Encryption
  [
    { size: 3, top: "15%", left: "30%", dur: "3.7s", delay: "0.6s", color: "#F02ACB" },
    { size: 4, top: "72%", left: "75%", dur: "4.3s", delay: "1.3s", color: "#00D9F5" },
    { size: 2.5, top: "40%", left: "85%", dur: "3.3s", delay: "0.8s", color: "#873CFF" },
    { size: 3.5, top: "85%", left: "18%", dur: "4.7s", delay: "1.9s", color: "#F02ACB" },
  ],
  // 7: Cross-Platform Support
  [
    { size: 3, top: "20%", left: "80%", dur: "4.1s", delay: "0.3s", color: "#38BDF8" },
    { size: 4, top: "68%", left: "18%", dur: "4.6s", delay: "1.1s", color: "#00D9F5" },
    { size: 2.5, top: "46%", left: "24%", dur: "3.5s", delay: "0.7s", color: "#873CFF" },
    { size: 3.5, top: "82%", left: "72%", dur: "3.9s", delay: "1.5s", color: "#38BDF8" },
  ],
  // 8: Multi-User Support
  [
    { size: 3.5, top: "16%", left: "22%", dur: "3.9s", delay: "0.4s", color: "#6366F1" },
    { size: 4, top: "74%", left: "78%", dur: "4.5s", delay: "1.2s", color: "#00D9F5" },
    { size: 2.5, top: "44%", left: "82%", dur: "3.4s", delay: "0.6s", color: "#873CFF" },
    { size: 3, top: "86%", left: "28%", dur: "4.2s", delay: "1.8s", color: "#6366F1" },
  ],
];

export default function CyberTrustCard({
  cardId,
  icon,
  title,
  description,
  index = 0,
  isCenter = false,
  onClick,
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState("");
  const [sheenStyle, setSheenStyle] = useState({ opacity: 0, x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const cardIndex = typeof cardId === "number" ? (cardId - 1) % 8 : index % 8;
  const particles = PARTICLES_BY_CARD[cardIndex] || PARTICLES_BY_CARD[0];

  // Interactive 3D Perspective Tilt on Desktop Mouse Hover (only on active center card for clarity)
  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || !isCenter) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    const maxRotation = 6.5; // degrees
    const rY = ((x - rect.width / 2) / (rect.width / 2)) * maxRotation;
    const rX = -((y - rect.height / 2) / (rect.height / 2)) * maxRotation;

    setTransformStyle(
      `perspective(800px) rotateX(${rX.toFixed(2)}deg) rotateY(${rY.toFixed(2)}deg) translateY(-4px) scale3d(1.02, 1.02, 1.02)`
    );
    setSheenStyle({ opacity: 1, x: px, y: py });
    setIsHovered(true);
  }, [isCenter]);

  const handleMouseLeave = useCallback(() => {
    setTransformStyle("");
    setSheenStyle((prev) => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`ctc-root relative flex flex-col items-center justify-between p-5 sm:p-7 rounded-2xl w-[270px] sm:w-[310px] h-[340px] sm:h-[360px] text-center select-none overflow-hidden transition-all duration-300 ${
        isCenter ? "ctc-center-card shadow-[0_15px_45px_rgba(0,0,0,0.7),0_0_28px_rgba(0,217,245,0.22)]" : "shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
      }`}
      style={{
        transform: transformStyle || undefined,
        transformStyle: "preserve-3d",
      }}
    >
      {/* 1. DARK NAVY & MIDNIGHT GLASS BASE (70-80% dark overlay for 100% text readability) */}
      <div className="ctc-glass-base" aria-hidden="true" />

      {/* 2. CARD-SPECIFIC BACKGROUND ARTWORK (Vector SVGs @ 18-25% visibility) */}
      <div className="ctc-artwork-layer" aria-hidden="true">
        {cardIndex === 0 && <ArtworkCard1 isHovered={isHovered} />}
        {cardIndex === 1 && <ArtworkCard2 isHovered={isHovered} />}
        {cardIndex === 2 && <ArtworkCard3 isHovered={isHovered} />}
        {cardIndex === 3 && <ArtworkCard4 isHovered={isHovered} />}
        {cardIndex === 4 && <ArtworkCard5 isHovered={isHovered} />}
        {cardIndex === 5 && <ArtworkCard6 isHovered={isHovered} />}
        {cardIndex === 6 && <ArtworkCard7 isHovered={isHovered} />}
        {cardIndex === 7 && <ArtworkCard8 isHovered={isHovered} />}
      </div>

      {/* 3. DIGITAL PARTICLE FLOW LAYER */}
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

      {/* 4. TRAVELING LUMINOUS PERIMETER BORDER BEAM */}
      <svg className="ctc-border-svg" aria-hidden="true">
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="16"
          className="ctc-border-track"
        />
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="16"
          className={`ctc-border-beam ctc-beam-${(cardIndex % 5) + 1}`}
        />
      </svg>

      {/* 5. CORNER CYBERNETIC BRACKETS */}
      <div className="ctc-corner-bracket top-left" aria-hidden="true" />
      <div className="ctc-corner-bracket top-right" aria-hidden="true" />
      <div className="ctc-corner-bracket bottom-left" aria-hidden="true" />
      <div className="ctc-corner-bracket bottom-right" aria-hidden="true" />

      {/* 6. DYNAMIC HOLOGRAPHIC MOUSE-FOLLOW SHEEN */}
      <div
        className="ctc-sheen-overlay"
        style={{
          opacity: sheenStyle.opacity,
          background: `radial-gradient(circle at ${sheenStyle.x}% ${sheenStyle.y}%, rgba(0, 217, 245, 0.28) 0%, rgba(135, 60, 255, 0.16) 38%, transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* 7. DIAGONAL LASER SWEEP (Periodic subtle neon sweep) */}
      <div className="ctc-laser-sweep" aria-hidden="true" />

      {/* 8. TOP PROTOCOL TELEMETRY HEADER (Horizontally Centered, No Card Number) */}
      <div className="relative z-10 w-full flex items-center justify-center text-center text-[10px] font-mono tracking-widest text-cyan-400/80 uppercase mb-2">
        <span>PICRYPT // PROTOCOL</span>
      </div>

      {/* 9. CONTENT LAYER (High Contrast, Z-10: Icon, Heading, Description) */}
      <div className="ctc-content-layer relative z-10 flex flex-col items-center w-full my-auto">
        {/* Animated Cyber Icon Container */}
        <div className="ctc-icon-wrapper mb-3 sm:mb-4 flex items-center justify-center">
          <div className="ctc-icon-glow" aria-hidden="true" />
          <span className="text-4xl sm:text-5xl ctc-icon-glyph select-none" role="img" aria-label={title}>
            {icon}
          </span>
        </div>

        {/* Preserved Card Heading */}
        <h3 className="ctc-heading font-bold text-lg sm:text-xl mb-2 text-white tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          {title}
        </h3>

        {/* Preserved Card Description */}
        <p className="ctc-description text-slate-300 text-xs sm:text-sm leading-relaxed font-normal drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
          {description}
        </p>
      </div>

      {/* 10. BOTTOM CYBER TELEMETRY STATUS BAR */}
      <div className="ctc-telemetry-bar relative z-10 w-full pt-3 border-t border-cyan-500/15 flex items-center justify-between text-[10px] font-mono text-cyan-400/80 tracking-widest uppercase">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
          ACTIVE_CIPHER
        </span>
        <span className="text-slate-400">256-BIT SECURE</span>
      </div>
    </div>
  );
}

/* ==========================================================================
   CARD 1 ARTWORK — USER-FRIENDLY INTERFACE (🎨)
   Intuitive cyber canvas, modular grid nodes, smooth curved bezier control lines
   ========================================================================== */
function ArtworkCard1({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="c1Aura" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#873CFF" stopOpacity="0.10" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c1Aura)" />
      {/* Curved Bezier Interactive Interface Lines */}
      <path d="M 20 60 C 80 20, 160 120, 260 50" fill="none" stroke="#00D9F5" strokeWidth="1.6" opacity="0.45" />
      <path d="M 20 180 C 100 240, 180 140, 260 220" fill="none" stroke="#873CFF" strokeWidth="1.4" opacity="0.4" />
      {/* UI Matrix Guide Grid */}
      <line x1="40" y1="30" x2="40" y2="290" stroke="#00D9F5" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.25" />
      <line x1="140" y1="30" x2="140" y2="290" stroke="#00D9F5" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.25" />
      <line x1="240" y1="30" x2="240" y2="290" stroke="#00D9F5" strokeWidth="0.8" strokeDasharray="4 6" opacity="0.25" />
      {/* Floating Interface Nodes */}
      <circle cx="95" cy="75" r="4" fill="#00D9F5" opacity={isHovered ? 0.9 : 0.6} />
      <circle cx="185" cy="180" r="4" fill="#F59E0B" opacity={isHovered ? 0.9 : 0.6} />
      <rect x="130" y="235" width="20" height="20" rx="4" fill="none" stroke="#00D9F5" strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

/* ==========================================================================
   CARD 2 ARTWORK — ADVANCED ALGORITHMS (🧩)
   Hexagonal mathematical matrix & cryptographic lattice
   ========================================================================== */
function ArtworkCard2({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="c2HexGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#873CFF" stopOpacity="0.32" />
          <stop offset="50%" stopColor="#00D9F5" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c2HexGlow)" />
      {/* Cryptographic Hexagonal Matrix */}
      <polygon points="140,25 168,41 168,73 140,89 112,73 112,41" fill="rgba(135, 60, 255, 0.12)" stroke="#873CFF" strokeWidth="1.4" opacity="0.65" />
      <polygon points="65,95 93,111 93,143 65,159 37,143 37,111" fill="rgba(0, 217, 245, 0.08)" stroke="#00D9F5" strokeWidth="1.2" opacity="0.5" />
      <polygon points="215,95 243,111 243,143 215,159 187,143 187,111" fill="rgba(0, 217, 245, 0.08)" stroke="#00D9F5" strokeWidth="1.2" opacity="0.5" />
      <polygon points="140,165 168,181 168,213 140,229 112,213 112,181" fill="rgba(240, 42, 203, 0.10)" stroke="#F02ACB" strokeWidth="1.4" opacity="0.55" />
      {/* Mathematical Connecting Lines */}
      <line x1="140" y1="89" x2="65" y2="95" stroke="#00D9F5" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <line x1="140" y1="89" x2="215" y2="95" stroke="#00D9F5" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <line x1="65" y1="159" x2="140" y2="165" stroke="#873CFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <line x1="215" y1="159" x2="140" y2="165" stroke="#873CFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="140" cy="57" r="3" fill="#00D9F5" />
      <circle cx="140" cy="197" r="3" fill="#F02ACB" />
    </svg>
  );
}

/* ==========================================================================
   CARD 3 ARTWORK — REGULAR UPDATES (🔄)
   Orbital refresh rings & cyclical sync telemetry
   ========================================================================== */
function ArtworkCard3({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="c3OrbitGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.28" />
          <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.10" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c3OrbitGlow)" />
      {/* Concentric Update Orbit Rings */}
      <circle cx="140" cy="115" r="75" fill="none" stroke="#00D9F5" strokeWidth="1.2" strokeDasharray="18 10" opacity="0.45" />
      <circle cx="140" cy="115" r="55" fill="none" stroke="#06B6D4" strokeWidth="1.5" strokeDasharray="35 15" opacity="0.55" />
      <circle cx="140" cy="115" r="35" fill="none" stroke="#873CFF" strokeWidth="1" strokeDasharray="10 8" opacity="0.4" />
      {/* Orbiting Satellite Data Nodes */}
      <circle cx="140" cy="40" r="3.5" fill="#00D9F5" opacity={isHovered ? 1 : 0.75} />
      <circle cx="195" cy="115" r="3" fill="#06B6D4" opacity={isHovered ? 1 : 0.75} />
      <circle cx="85" cy="115" r="3" fill="#873CFF" opacity={isHovered ? 1 : 0.75} />
      <circle cx="140" cy="190" r="3.5" fill="#00D9F5" opacity={isHovered ? 1 : 0.75} />
      {/* Radial Sync Beams */}
      <line x1="140" y1="115" x2="140" y2="40" stroke="#00D9F5" strokeWidth="1" opacity="0.3" />
      <line x1="140" y1="115" x2="195" y2="115" stroke="#06B6D4" strokeWidth="1" opacity="0.3" />
      <line x1="140" y1="115" x2="85" y2="115" stroke="#873CFF" strokeWidth="1" opacity="0.3" />
      <line x1="140" y1="115" x2="140" y2="190" stroke="#00D9F5" strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

/* ==========================================================================
   CARD 4 ARTWORK — PRIVACY PROTECTION (🔒)
   Central defensive cyber shield & security radar arcs
   ========================================================================== */
function ArtworkCard4({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="c4ShieldAura" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#00D9F5" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c4ShieldAura)" />
      {/* Central Defensive Cyber Shield Contour */}
      <path
        d="M 140 35 L 205 60 C 205 130, 140 185, 140 185 C 140 185, 75 130, 75 60 Z"
        fill="rgba(59, 130, 246, 0.08)"
        stroke="#00D9F5"
        strokeWidth="1.6"
        opacity={isHovered ? 0.9 : 0.6}
      />
      {/* Inner Guard Ring */}
      <circle cx="140" cy="100" r="32" fill="none" stroke="#873CFF" strokeWidth="1.2" strokeDasharray="12 6" opacity="0.5" />
      <circle cx="140" cy="100" r="18" fill="rgba(0, 217, 245, 0.15)" stroke="#00D9F5" strokeWidth="1" />
      <circle cx="140" cy="100" r="3.5" fill="#ffffff" />
      {/* Security Scanning Arcs */}
      <path d="M 45 130 A 110 110 0 0 1 235 130" fill="none" stroke="#00D9F5" strokeWidth="1" strokeDasharray="20 14" opacity="0.35" />
      <path d="M 60 170 A 90 90 0 0 1 220 170" fill="none" stroke="#3B82F6" strokeWidth="1" strokeDasharray="14 10" opacity="0.3" />
    </svg>
  );
}

/* ==========================================================================
   CARD 5 ARTWORK — SECURE SHARING (📤)
   Peer-to-peer data conduits & packet transfer nodes
   ========================================================================== */
function ArtworkCard5({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="c5NetGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.26" />
          <stop offset="50%" stopColor="#00D9F5" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c5NetGlow)" />
      {/* Interconnected P2P Conduits */}
      <line x1="55" y1="55" x2="140" y2="105" stroke="#00D9F5" strokeWidth="1.4" opacity="0.5" className="ctc-circuit-line" />
      <line x1="225" y1="55" x2="140" y2="105" stroke="#00D9F5" strokeWidth="1.4" opacity="0.5" className="ctc-circuit-line" />
      <line x1="55" y1="55" x2="55" y2="185" stroke="#10B981" strokeWidth="1.2" opacity="0.4" />
      <line x1="225" y1="55" x2="225" y2="185" stroke="#10B981" strokeWidth="1.2" opacity="0.4" />
      <line x1="55" y1="185" x2="140" y2="240" stroke="#00D9F5" strokeWidth="1.4" opacity="0.5" />
      <line x1="225" y1="185" x2="140" y2="240" stroke="#00D9F5" strokeWidth="1.4" opacity="0.5" />
      {/* Network Station Hexagons */}
      <polygon points="55,45 65,51 65,63 55,69 45,63 45,51" fill="rgba(0, 217, 245, 0.16)" stroke="#00D9F5" strokeWidth="1.4" />
      <polygon points="225,45 235,51 235,63 225,69 215,63 215,51" fill="rgba(0, 217, 245, 0.16)" stroke="#00D9F5" strokeWidth="1.4" />
      <polygon points="55,175 65,181 65,193 55,199 45,193 45,181" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="1.4" />
      <polygon points="225,175 235,181 235,193 225,199 215,193 215,181" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="1.4" />
      <circle cx="140" cy="105" r="4" fill="#00D9F5" opacity={isHovered ? 1 : 0.8} />
      <circle cx="140" cy="240" r="4" fill="#10B981" opacity={isHovered ? 1 : 0.8} />
    </svg>
  );
}

/* ==========================================================================
   CARD 6 ARTWORK — HIGH SPEED ENCRYPTION (⚡)
   Kinetic supersonic neon streaks & telemetry chevrons
   ========================================================================== */
function ArtworkCard6({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <linearGradient id="c6StreakGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#873CFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F02ACB" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="c6Burst" cx="20%" cy="80%" r="65%">
          <stop offset="0%" stopColor="#F02ACB" stopOpacity="0.25" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c6Burst)" />
      {/* High-Velocity Kinetic Diagonal Energy Streaks */}
      <line x1="-30" y1="90" x2="220" y2="-30" stroke="url(#c6StreakGrad)" strokeWidth="3" opacity={isHovered ? 0.95 : 0.75} />
      <line x1="-10" y1="160" x2="250" y2="30" stroke="#00D9F5" strokeWidth="2" strokeDasharray="80 25" opacity="0.65" />
      <line x1="30" y1="240" x2="290" y2="110" stroke="url(#c6StreakGrad)" strokeWidth="2.5" opacity="0.7" />
      <line x1="80" y1="310" x2="310" y2="195" stroke="#F02ACB" strokeWidth="1.6" strokeDasharray="60 30" opacity="0.55" />
      {/* Kinetic Telemetry Chevron Accelerators */}
      <path d="M 230 40 L 245 48 L 230 56" fill="none" stroke="#00D9F5" strokeWidth="2.2" strokeLinecap="round" opacity="0.8" />
      <path d="M 245 40 L 260 48 L 245 56" fill="none" stroke="#873CFF" strokeWidth="1.6" strokeLinecap="round" opacity="0.6" />
      <circle cx="140" cy="100" r="3" fill="#ffffff" />
    </svg>
  );
}

/* ==========================================================================
   CARD 7 ARTWORK — CROSS-PLATFORM SUPPORT (🌐)
   Global cybernetic meridian sphere & distributed mesh
   ========================================================================== */
function ArtworkCard7({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="c7GlobeAura" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
          <stop offset="55%" stopColor="#00D9F5" stopOpacity="0.10" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c7GlobeAura)" />
      {/* Global Cybernetic Sphere Latitude & Longitude Arcs */}
      <circle cx="140" cy="115" r="70" fill="none" stroke="#00D9F5" strokeWidth="1.4" opacity="0.55" />
      <ellipse cx="140" cy="115" rx="35" ry="70" fill="none" stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="14 8" opacity="0.5" />
      <ellipse cx="140" cy="115" rx="70" ry="32" fill="none" stroke="#873CFF" strokeWidth="1.2" strokeDasharray="18 10" opacity="0.45" />
      <line x1="70" y1="115" x2="210" y2="115" stroke="#00D9F5" strokeWidth="1.2" opacity="0.5" />
      <line x1="140" y1="45" x2="140" y2="185" stroke="#00D9F5" strokeWidth="1.2" opacity="0.5" />
      {/* Global Terminal Nodes */}
      <circle cx="105" cy="85" r="3" fill="#00D9F5" opacity={isHovered ? 1 : 0.75} />
      <circle cx="175" cy="85" r="3" fill="#38BDF8" opacity={isHovered ? 1 : 0.75} />
      <circle cx="140" cy="115" r="4" fill="#ffffff" />
      <circle cx="120" cy="145" r="3" fill="#873CFF" opacity={isHovered ? 1 : 0.75} />
    </svg>
  );
}

/* ==========================================================================
   CARD 8 ARTWORK — MULTI-USER SUPPORT (👥)
   Clustered multi-agent cryptographic identity rings & mesh lattice
   ========================================================================== */
function ArtworkCard8({ isHovered }) {
  return (
    <svg viewBox="0 0 280 320" className="ctc-svg-canvas" preserveAspectRatio="none">
      <defs>
        <radialGradient id="c8MeshGlow" cx="50%" cy="38%" r="58%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
          <stop offset="50%" stopColor="#00D9F5" stopOpacity="0.12" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#c8MeshGlow)" />
      {/* Multi-Agent Collaborative Identity Rings */}
      <circle cx="105" cy="85" r="35" fill="rgba(99, 102, 241, 0.12)" stroke="#6366F1" strokeWidth="1.4" opacity="0.6" />
      <circle cx="175" cy="85" r="35" fill="rgba(0, 217, 245, 0.12)" stroke="#00D9F5" strokeWidth="1.4" opacity="0.6" />
      <circle cx="140" cy="145" r="38" fill="rgba(135, 60, 255, 0.14)" stroke="#873CFF" strokeWidth="1.4" opacity="0.65" />
      {/* Triangular Synchronization Link Lines */}
      <line x1="105" y1="85" x2="175" y2="85" stroke="#00D9F5" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.5" />
      <line x1="105" y1="85" x2="140" y2="145" stroke="#6366F1" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.5" />
      <line x1="175" y1="85" x2="140" y2="145" stroke="#873CFF" strokeWidth="1.2" strokeDasharray="6 4" opacity="0.5" />
      {/* Core Security Node Sparkles */}
      <circle cx="105" cy="85" r="3.5" fill="#6366F1" />
      <circle cx="175" cy="85" r="3.5" fill="#00D9F5" />
      <circle cx="140" cy="145" r="4" fill="#ffffff" />
    </svg>
  );
}

