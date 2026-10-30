// frontend/src/components/CyberLockIllustration.jsx

import { useRef, useCallback, useState, useEffect } from "react";

/**
 * PICRYPT — Premium Layered 3D Cybersecurity Lock Animation
 * with Advanced Key Insertion, Rotation, and Shackle Opening Sequence.
 *
 * Architecture:
 * 1. HeroVisualContainer (pli-stage) — Responsive 3D coordinate boundary with mouse parallax.
 * 2. AmbientGlowLayer — Multi-color radial cyber lighting (cyan, teal, indigo).
 * 3. HolographicPedestalLayer — Multi-tier 3D angled concentric circuit rings & radar arcs.
 * 4. ParticleLayer — Floating cyber nodes, glowing squares & data sparks.
 * 5. ImageCardsLayer — Glassmorphic image encryption cards with live status badges.
 * 6. SecretMessageLayer — Holographic secret-message card with illustrative concealment sequence.
 * 7. CentralLockLayer — Compact, detailed 3D electric blue padlock with:
 *    - Independently animated pivoting shackle (opens/closes around left heel).
 *    - Digital glowing key (approaches, inserts, turns 90deg, unlocks, rotates back, slides out).
 *    - Keyhole core with dynamic radiance and circular energy shockwave.
 *    - Mechanical collar sockets exposed upon shackle lift.
 * 8. ScanningEffectsLayer — High-precision vertical cyber laser scanning beam.
 * 9. ProtectionPulseLayer — Concentric energy shockwave ripples.
 */

const PARTICLES = [
  { size: 4, top: "14%", left: "12%", dur: "4.2s", delay: "0s", color: "#22d3ee" },
  { size: 5, top: "22%", left: "82%", dur: "4.8s", delay: "1.1s", color: "#10b981" },
  { size: 3, top: "68%", left: "8%",  dur: "3.9s", delay: "0.5s", color: "#06b6d4" },
  { size: 6, top: "78%", left: "86%", dur: "5.2s", delay: "1.8s", color: "#38bdf8" },
  { size: 4, top: "42%", left: "4%",  dur: "4.5s", delay: "2.3s", color: "#22d3ee" },
  { size: 3, top: "86%", left: "38%", dur: "3.7s", delay: "0.8s", color: "#10b981" },
  { size: 5, top: "8%",  left: "62%", dur: "4.9s", delay: "1.4s", color: "#6366f1" },
  { size: 4, top: "52%", left: "94%", dur: "4.1s", delay: "2.7s", color: "#22d3ee" },
];

export default function CyberLockIllustration() {
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const [stegoStep, setStegoStep] = useState(0);

  // Steganography Sequence Controller (0: ready, 1: streaming, 2: concealed & locked)
  useEffect(() => {
    const interval = setInterval(() => {
      setStegoStep(1);
      const t1 = setTimeout(() => setStegoStep(2), 2200);
      const t2 = setTimeout(() => setStegoStep(0), 4800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }, 6500);

    return () => clearInterval(interval);
  }, []);

  // 3D Parallax Mouse Tracking (Desktop only, restrained max 4.5deg)
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = containerRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      const maxDeg = 4.5;
      const rx = -dy * maxDeg;
      const ry = dx * maxDeg;

      containerRef.current.style.transition = "transform 0.12s ease-out";
      containerRef.current.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!containerRef.current) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    containerRef.current.style.transition = "transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1)";
    containerRef.current.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg)";
  }, []);

  return (
    <div className="pli-root select-none">
      {/* 1. HERO VISUAL CONTAINER */}
      <div
        ref={containerRef}
        className="pli-stage"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* 2. AMBIENT GLOW LAYER */}
        <div className="pli-ambient-glow" aria-hidden="true">
          <div className="pli-glow-cyan" />
          <div className="pli-glow-teal" />
          <div className="pli-glow-violet" />
        </div>

        {/* 3. HOLOGRAPHIC PEDESTAL LAYER (3D Angled Circuit Rings) */}
        <div className="pli-pedestal-layer" aria-hidden="true">
          <svg viewBox="0 0 500 500" className="pli-pedestal-svg">
            <defs>
              <linearGradient id="ringGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#0077ff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="ringGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#00d2ff" stopOpacity="0.9" />
              </linearGradient>
              <filter id="pedestalGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Outermost Dashed Ring */}
            <circle
              cx="250"
              cy="250"
              r="225"
              fill="none"
              stroke="url(#ringGrad1)"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              className="pli-spin-cw-slow"
            />

            {/* Segmented Tech Calibrations */}
            <circle
              cx="250"
              cy="250"
              r="195"
              fill="none"
              stroke="#00d2ff"
              strokeWidth="2.5"
              strokeDasharray="60 25 10 25"
              strokeOpacity="0.65"
              filter="url(#pedestalGlow)"
              className="pli-spin-ccw"
            />

            {/* Radial Radar Tick Ring */}
            <circle
              cx="250"
              cy="250"
              r="165"
              fill="none"
              stroke="#0077ff"
              strokeWidth="1.5"
              strokeDasharray="4 6"
              strokeOpacity="0.5"
              className="pli-spin-cw"
            />

            {/* Inner Power Arc Track */}
            <circle
              cx="250"
              cy="250"
              r="135"
              fill="none"
              stroke="url(#ringGrad2)"
              strokeWidth="3"
              strokeDasharray="120 40 30 40"
              filter="url(#pedestalGlow)"
              className="pli-spin-ccw-fast"
            />

            {/* Core Grid Center Disc */}
            <circle cx="250" cy="250" r="95" fill="rgba(0, 102, 255, 0.05)" stroke="rgba(0, 210, 255, 0.3)" strokeWidth="1.5" />

            {/* Circuit Nodes */}
            <circle cx="250" cy="25" r="4.5" fill="#00d2ff" filter="url(#pedestalGlow)" />
            <circle cx="475" cy="250" r="4.5" fill="#0077ff" filter="url(#pedestalGlow)" />
            <circle cx="250" cy="475" r="4.5" fill="#00d2ff" filter="url(#pedestalGlow)" />
            <circle cx="25" cy="250" r="4.5" fill="#38bdf8" filter="url(#pedestalGlow)" />
          </svg>
        </div>

        {/* 4. PARTICLE LAYER */}
        <div className="pli-particles-layer" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="pli-particle"
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

        {/* 5. IMAGE CARDS LAYER (Image Encryption Capability) */}
        {/* Card 1: Encrypted Photo File (Top Left) */}
        <div className="pli-card pli-card-photo" aria-hidden="true">
          <div className="pli-card-header">
            <span className="pli-card-dot" />
            <span className="pli-card-title">IMG_VAULT.PNG</span>
            <span className="pli-card-badge-enc">AES-256</span>
          </div>
          <div className="pli-card-body">
            {/* Stylized photo artwork */}
            <div className="pli-photo-preview">
              <svg viewBox="0 0 64 38" className="pli-photo-svg">
                <path d="M4 32 L22 14 L34 26 L44 16 L60 32 Z" fill="rgba(6, 182, 212, 0.25)" stroke="#22d3ee" strokeWidth="1" />
                <circle cx="48" cy="10" r="4" fill="#10b981" opacity="0.8" />
              </svg>
              <div className="pli-photo-scan-bar" />
            </div>
            <div className="pli-card-status">
              <span className="pli-status-icon">🔒</span>
              <span>Encrypted & Signed</span>
            </div>
          </div>
        </div>

        {/* Card 2: Stego Carrier Target (Bottom Right) */}
        <div className={`pli-card pli-card-stego ${stegoStep === 2 ? "pli-card-pulsing" : ""}`} aria-hidden="true">
          <div className="pli-card-header">
            <span className="pli-card-dot-green" />
            <span className="pli-card-title">CARRIER.JPG</span>
            <span className="pli-card-badge-stego">{stegoStep === 2 ? "CONCEALED" : "CARRIER"}</span>
          </div>
          <div className="pli-card-body">
            <div className="pli-stego-preview">
              <div className="pli-pixel-matrix">
                {[...Array(12)].map((_, idx) => (
                  <span
                    key={idx}
                    className={`pli-pixel ${stegoStep === 2 ? "pli-pixel-lit" : ""}`}
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
            <div className="pli-card-status">
              <span className="pli-status-icon">{stegoStep === 2 ? "🛡️" : "👁️"}</span>
              <span>{stegoStep === 2 ? "Stego Payload Active" : "Capacity: 1.4 MB"}</span>
            </div>
          </div>
        </div>

        {/* 6. SECRET MESSAGE LAYER (Steganography Capability) */}
        <div className="pli-card pli-card-message" aria-hidden="true">
          <div className="pli-card-header">
            <span className="pli-card-dot-amber" />
            <span className="pli-card-title">SECRET MESSAGE</span>
            <span className="pli-card-badge-msg">TXT</span>
          </div>
          <div className="pli-card-body">
            <div className="pli-message-content">
              <span className="pli-mono-text">// "PASSCODE_2026"</span>
              <span className="pli-cursor">_</span>
            </div>
            <div className="pli-message-status">
              <span className="pli-embed-dot" />
              <span>Concealing in LSB...</span>
            </div>
          </div>

          {/* Steganographic Traveling Data Packet Stream */}
          <div className={`pli-data-stream ${stegoStep === 1 ? "pli-stream-active" : ""}`}>
            <span className="pli-stream-packet p1" />
            <span className="pli-stream-packet p2" />
            <span className="pli-stream-packet p3" />
          </div>
        </div>

        {/* 7. CENTRAL LOCK LAYER (Compact, Elegant 3D Padlock with Opening Sequence) */}
        <div className="pli-lock-wrapper">
          {/* Energy Halo & Shockwave */}
          <div className="pli-lock-halo" />
          <div className="pli-shockwave" />

          {/* Precision SVG 3D Futuristic Padlock (Electric Blue Edition) */}
          <svg viewBox="-20 -25 260 295" className="pli-lock-svg">
            <defs>
              {/* Electric Blue Shackle Gradient */}
              <linearGradient id="shackleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d2ff" />
                <stop offset="25%" stopColor="#0077ff" />
                <stop offset="50%" stopColor="#1e40af" />
                <stop offset="75%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              {/* Electric Blue Cyber Glass Body Gradient */}
              <linearGradient id="lockBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0c1e3d" stopOpacity="0.96" />
                <stop offset="50%" stopColor="#07152b" stopOpacity="0.98" />
                <stop offset="100%" stopColor="#020817" stopOpacity="1" />
              </linearGradient>

              {/* Digital Key Gradient */}
              <linearGradient id="keyBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="45%" stopColor="#0066ff" />
                <stop offset="100%" stopColor="#020817" />
              </linearGradient>

              <linearGradient id="keyShaftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d2ff" />
                <stop offset="100%" stopColor="#0055ff" />
              </linearGradient>

              {/* Electric Blue Neon Filter */}
              <filter id="neonLockGlow" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="5.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Electric Blue Keyhole Radiance Gradient */}
              <radialGradient id="keyholeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#00d2ff" />
                <stop offset="70%" stopColor="#0055ff" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* A. SHACKLE (Animated Pivoting Group: Pivots at Left Heel x=65, y=105) */}
            <g className="pli-shackle-group">
              <path
                d="M 65 110 V 62 C 65 37 85 18 110 18 C 135 18 155 37 155 62 V 110"
                fill="none"
                stroke="url(#shackleGrad)"
                strokeWidth="20"
                strokeLinecap="round"
                filter="url(#neonLockGlow)"
                className="pli-shackle-path"
              />

              {/* Shackle Electric Highlight Core */}
              <path
                d="M 65 105 V 62 C 65 41 85 24 110 24 C 135 24 155 41 155 62 V 105"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="4"
                strokeOpacity="0.9"
              />
            </g>

            {/* Shackle Socket Depths (Exposed when shackle lifts/opens) */}
            <ellipse cx="65" cy="103" rx="7" ry="3.5" fill="#020617" stroke="rgba(0, 180, 255, 0.5)" strokeWidth="1" />
            <ellipse cx="155" cy="103" rx="7" ry="3.5" fill="#020617" stroke="rgba(0, 180, 255, 0.5)" strokeWidth="1" />

            {/* Shackle Joint Collars */}
            <rect x="52" y="96" width="26" height="15" rx="3" fill="#0f172a" stroke="#0077ff" strokeWidth="2" />
            <rect x="142" y="96" width="26" height="15" rx="3" fill="#0f172a" stroke="#0077ff" strokeWidth="2" />

            {/* Right Collar Lock / Unlock Spark Burst */}
            <circle cx="155" cy="103" r="14" fill="none" stroke="#00d2ff" strokeWidth="2" className="pli-joint-spark" />

            {/* B. PADLOCK BODY (Electric Blue Armor) */}
            <path
              d="M 45 105 L 175 105 C 185 105 194 114 194 125 L 194 220 C 194 233 183 244 170 244 L 50 244 C 37 244 26 233 26 220 L 26 125 C 26 114 35 105 45 105 Z"
              fill="url(#lockBodyGrad)"
              stroke="#0088ff"
              strokeWidth="3"
              filter="url(#neonLockGlow)"
            />

            {/* Inner Tech Inset Border */}
            <path
              d="M 50 115 L 170 115 C 178 115 184 121 184 129 L 184 214 C 184 223 177 230 168 230 L 52 230 C 43 230 36 223 36 214 L 36 129 C 36 121 42 115 50 115 Z"
              fill="none"
              stroke="rgba(0, 150, 255, 0.45)"
              strokeWidth="1.5"
              strokeDasharray="14 6"
            />

            {/* Circuit Traces on Padlock Surface */}
            <path d="M 40 145 H 70 L 80 155" fill="none" stroke="#00d2ff" strokeWidth="1.5" opacity="0.65" />
            <path d="M 180 145 H 150 L 140 155" fill="none" stroke="#00d2ff" strokeWidth="1.5" opacity="0.65" />
            <path d="M 40 200 H 65 L 75 190" fill="none" stroke="#0088ff" strokeWidth="1.5" opacity="0.6" />
            <path d="M 180 200 H 155 L 145 190" fill="none" stroke="#0088ff" strokeWidth="1.5" opacity="0.6" />

            {/* Corner Armor Accents */}
            <circle cx="48" cy="126" r="3.5" fill="#00d2ff" filter="url(#neonLockGlow)" />
            <circle cx="172" cy="126" r="3.5" fill="#00d2ff" filter="url(#neonLockGlow)" />
            <circle cx="48" cy="222" r="3.5" fill="#0066ff" filter="url(#neonLockGlow)" />
            <circle cx="172" cy="222" r="3.5" fill="#0066ff" filter="url(#neonLockGlow)" />

            {/* C. CENTRAL CYBER SHIELD (Electric Blue) */}
            <path
              d="M 110 130 L 138 142 V 172 C 138 190 110 205 110 205 C 110 205 82 190 82 172 V 142 Z"
              fill="rgba(0, 102, 255, 0.16)"
              stroke="#00a2ff"
              strokeWidth="2.8"
              filter="url(#neonLockGlow)"
              className="pli-shield-pulse"
            />

            {/* D. GLOWING CORE KEYHOLE */}
            <circle cx="110" cy="158" r="9.5" fill="url(#keyholeGlow)" />
            <path d="M 106 160 L 103 182 H 117 L 114 160 Z" fill="url(#keyholeGlow)" />

            {/* Core Center Dot */}
            <circle cx="110" cy="158" r="3.5" fill="#ffffff" className="pli-keyhole-core" />

            {/* Circular Unlocking Core Energy Wave */}
            <circle cx="110" cy="162" r="32" fill="none" stroke="#00d2ff" strokeWidth="2" className="pli-unlock-wave" />

            {/* E. ADVANCED DIGITAL KEY (Animated Insertion, 90deg Turn & Extraction) */}
            <g className="pli-digital-key">
              {/* Key Glow Aura / Cyber Energy Field */}
              <circle cx="110" cy="132" r="18" fill="rgba(0, 210, 255, 0.22)" />

              {/* 1. Key Bow / Cybernetic Handle (Enhanced Size) */}
              <polygon
                points="110,114 125,123 125,140 110,148 95,140 95,123"
                fill="url(#keyBodyGrad)"
                stroke="#00d2ff"
                strokeWidth="2.2"
                filter="url(#neonLockGlow)"
              />
              {/* Bow Cyber Core */}
              <circle cx="110" cy="132" r="5.5" fill="#020817" stroke="#38bdf8" strokeWidth="1.6" />
              <circle cx="110" cy="132" r="2.2" fill="#ffffff" />

              {/* 2. Key Stem / Shaft */}
              <line
                x1="110"
                y1="148"
                x2="110"
                y2="180"
                stroke="url(#keyShaftGrad)"
                strokeWidth="4.5"
                strokeLinecap="round"
                filter="url(#neonLockGlow)"
              />
              <line
                x1="110"
                y1="149"
                x2="110"
                y2="178"
                stroke="#e0f2fe"
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* 3. Cyber Cryptographic Bits / Teeth */}
              <path
                d="M 110 162 H 118 V 165 H 113 V 168 H 119 V 172 H 110"
                fill="none"
                stroke="#00d2ff"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
              <circle cx="118" cy="163.5" r="1.5" fill="#ffffff" />
              <circle cx="119" cy="170" r="1.5" fill="#38bdf8" />
            </g>
          </svg>

          {/* 8. DIGITAL SCANNING BEAM (Vertically Sweeping Laser) */}
          <div className="pli-scan-beam-container" aria-hidden="true">
            <div className="pli-scan-laser" />
          </div>
        </div>
      </div>
    </div>
  );
}
