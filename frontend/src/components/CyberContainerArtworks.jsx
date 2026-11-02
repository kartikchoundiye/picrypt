// frontend/src/components/CyberContainerArtworks.jsx

/**
 * PICRYPT — UNIQUE CYBERSECURITY ENVIRONMENTS
 *
 * 1. ENCRYPT CONTAINER: Holographic Digital Vault
 *    - Geometric heavy vault bulkhead structure & radial vault spokes
 *    - Layered cyan holographic security rings (calibrated dials & locking lugs)
 *    - Central glowing energy core with breathing pulse
 *    - Pixel Transformation Effect: Steganographic image pixels & light fragments drifting into the vault core
 *    - Fine geometric edge guides & subtle background hexagonal matrix
 *    - Palette: Cyan (#00D9F5), Electric Blue (#398BFF), Violet (#9065F5)
 *
 * 2. DECRYPT CONTAINER: Futuristic Secure Access Portal
 *    - Concentric holographic portal gateway with optical access rings & chevrons
 *    - Geometric key-inspired access gateway & cryptographic lock aperture
 *    - Smooth traveling laser scanning beam
 *    - Pixel Reconstruction Effect: Pixels emerging & reforming outward from the portal
 *    - 8 Peripheral gateway nodes illuminating in sequential chasing cycle
 *    - Palette: Emerald (#00D6A0), Teal (#06B6D4), Mint (#10B981)
 *
 * Strict Isolation: pointer-events: none, z-index: 1, clipped to rounded-2xl container.
 * Forms and interactive elements remain unblocked on z-index: 10 with 100% readability.
 */

export function EncryptContainerArtwork() {
  return (
    <div className="edp-container-artwork" aria-hidden="true">
      <svg
        viewBox="0 0 500 700"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full select-none"
      >
        <defs>
          {/* Deep Cyan-Electric Blue Vault Ambient Pool */}
          <radialGradient id="vaultAmbientGlow" cx="50%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.14" />
            <stop offset="40%" stopColor="#398BFF" stopOpacity="0.06" />
            <stop offset="80%" stopColor="#9065F5" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Central Energy Core Radial Gradient */}
          <radialGradient id="vaultCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#398BFF" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#9065F5" stopOpacity="0.10" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Vault Geometric Edge Gradient */}
          <linearGradient id="vaultEdgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9F5" stopOpacity="0.35" />
            <stop offset="50%" stopColor="#398BFF" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#9065F5" stopOpacity="0.30" />
          </linearGradient>

          {/* Background Hex Lattice Pattern */}
          <pattern id="vaultHexPattern" width="40" height="69.28" patternUnits="userSpaceOnUse" patternTransform="scale(0.85)">
            <path
              d="M 40 0 L 20 11.55 L 0 0 L 0 23.09 L 20 34.64 L 40 23.09 Z M 0 34.64 L 20 46.19 L 0 57.74 L 0 80.83 L 20 92.38 L 40 80.83 L 40 57.74 L 20 46.19 Z"
              fill="none"
              stroke="#00D9F5"
              strokeWidth="0.8"
              opacity="0.07"
            />
          </pattern>
        </defs>

        {/* 1. Ambient Lighting Pool */}
        <rect width="100%" height="100%" fill="url(#vaultAmbientGlow)" />

        {/* 2. Hexagonal Vault Geometry in Upper Right & Lower Left Corners */}
        <rect x="270" y="40" width="210" height="190" fill="url(#vaultHexPattern)" opacity="0.9" style={{ animation: "edpHexGlow 6s ease-in-out infinite" }} />
        <rect x="20" y="450" width="210" height="210" fill="url(#vaultHexPattern)" opacity="0.8" style={{ animation: "edpHexGlow 6s ease-in-out infinite 1.5s" }} />

        {/* 3. Outer Geometric Vault Bulkhead Structure (Center at 250, 270) */}
        <g stroke="url(#vaultEdgeGrad)" fill="none">
          {/* Heavy 12-Sided Vault Perimeter */}
          <polygon
            points="250,95 340,120 405,185 430,270 405,355 340,420 250,445 160,420 95,355 70,270 95,185 160,120"
            strokeWidth="1.4"
            strokeDasharray="16 8"
            opacity="0.10"
          />

          {/* Inner Octagonal Structural Ring */}
          <polygon
            points="250,125 352,168 395,270 352,372 250,415 148,372 105,270 148,168"
            strokeWidth="1.2"
            opacity="0.09"
          />

          {/* 8 Radial Vault Bulkhead Spokes */}
          <line x1="250" y1="95" x2="250" y2="190" strokeWidth="1" strokeDasharray="4 6" opacity="0.11" />
          <line x1="250" y1="350" x2="250" y2="445" strokeWidth="1" strokeDasharray="4 6" opacity="0.11" />
          <line x1="70" y1="270" x2="165" y2="270" strokeWidth="1" strokeDasharray="4 6" opacity="0.11" />
          <line x1="335" y1="270" x2="430" y2="270" strokeWidth="1" strokeDasharray="4 6" opacity="0.11" />
          <line x1="123" y1="143" x2="190" y2="210" strokeWidth="0.9" opacity="0.09" />
          <line x1="377" y1="397" x2="310" y2="330" strokeWidth="0.9" opacity="0.09" />
          <line x1="377" y1="143" x2="310" y2="210" strokeWidth="0.9" opacity="0.09" />
          <line x1="123" y1="397" x2="190" y2="330" strokeWidth="0.9" opacity="0.09" />
        </g>

        {/* 4. Layered Cyan Holographic Vault Security Rings */}
        {/* Ring A: Outer Dial with Locking Lugs (Clockwise) */}
        <g style={{ transformOrigin: "250px 270px", animation: "edpVaultRingCW 28s linear infinite" }}>
          <circle cx="250" cy="270" r="155" fill="none" stroke="#00D9F5" strokeWidth="1.3" strokeDasharray="14 10" opacity="0.11" />
          {/* 4 Major Vault Locking Bolts */}
          <rect x="245" y="110" width="10" height="12" fill="#00D9F5" opacity="0.18" />
          <rect x="245" y="418" width="10" height="12" fill="#00D9F5" opacity="0.18" />
          <rect x="90" y="265" width="12" height="10" fill="#00D9F5" opacity="0.18" />
          <rect x="398" y="265" width="12" height="10" fill="#00D9F5" opacity="0.18" />
        </g>

        {/* Ring B: Middle Segmented Calibrated Dial (Counter-Clockwise) */}
        <g style={{ transformOrigin: "250px 270px", animation: "edpVaultRingCCW 20s linear infinite" }}>
          <circle cx="250" cy="270" r="120" fill="none" stroke="#398BFF" strokeWidth="1.2" strokeDasharray="24 12" opacity="0.12" />
          {/* Caliper Arc Indicators */}
          <path d="M 200 170 A 120 120 0 0 1 300 170" fill="none" stroke="#00D9F5" strokeWidth="2.2" strokeLinecap="round" opacity="0.22" />
          <path d="M 300 370 A 120 120 0 0 1 200 370" fill="none" stroke="#9065F5" strokeWidth="2.2" strokeLinecap="round" opacity="0.22" />
        </g>

        {/* Ring C: Inner Cryptographic Security Iris (Clockwise) */}
        <g style={{ transformOrigin: "250px 270px", animation: "edpVaultRingCW 14s linear infinite" }}>
          <circle cx="250" cy="270" r="82" fill="none" stroke="#00D9F5" strokeWidth="1.1" strokeDasharray="8 6" opacity="0.14" />
          {/* 6 Interlocking Iris Aperture Spokes */}
          <line x1="250" y1="188" x2="275" y2="235" stroke="#00D9F5" strokeWidth="1" opacity="0.16" />
          <line x1="321" y1="229" x2="285" y2="265" stroke="#00D9F5" strokeWidth="1" opacity="0.16" />
          <line x1="321" y1="311" x2="260" y2="300" stroke="#00D9F5" strokeWidth="1" opacity="0.16" />
          <line x1="250" y1="352" x2="225" y2="305" stroke="#00D9F5" strokeWidth="1" opacity="0.16" />
          <line x1="179" y1="311" x2="215" y2="275" stroke="#00D9F5" strokeWidth="1" opacity="0.16" />
          <line x1="179" y1="229" x2="240" y2="240" stroke="#00D9F5" strokeWidth="1" opacity="0.16" />
        </g>

        {/* 5. Central Glowing Energy Core (Breathing Pulse) */}
        <g style={{ transformOrigin: "250px 270px" }}>
          <circle cx="250" cy="270" r="42" fill="url(#vaultCoreGlow)" style={{ animation: "edpCorePulse 4s ease-in-out infinite" }} />
          <circle cx="250" cy="270" r="24" fill="none" stroke="#00D9F5" strokeWidth="1.2" opacity="0.30" />
          {/* Central Vault Keyhole / Micro-Crystal Cipher Emblem */}
          <polygon points="250,256 262,270 250,284 238,270" fill="none" stroke="#00D9F5" strokeWidth="1.5" opacity="0.45" />
          <circle cx="250" cy="270" r="4" fill="#00D9F5" opacity="0.75" />
        </g>

        {/* 6. Steganographic Pixel Transformation Effect (Pixels drifting into vault core) */}
        {/* Pixel Stream 1: Top-Right drifting toward core */}
        <g style={{ animation: "edpPixelDriftIn1 4.5s ease-in-out infinite" }}>
          <rect x="335" y="185" width="4" height="4" fill="#00D9F5" />
          <rect x="345" y="195" width="3.5" height="3.5" fill="#398BFF" />
          <rect x="355" y="180" width="5" height="5" fill="#00D9F5" opacity="0.9" />
          <rect x="365" y="200" width="4" height="4" fill="#9065F5" />
        </g>

        {/* Pixel Stream 2: Bottom-Left drifting toward core */}
        <g style={{ animation: "edpPixelDriftIn2 5.2s ease-in-out infinite 0.8s" }}>
          <rect x="160" y="345" width="4" height="4" fill="#00D9F5" />
          <rect x="145" y="355" width="5" height="5" fill="#398BFF" opacity="0.9" />
          <rect x="170" y="365" width="3.5" height="3.5" fill="#00D9F5" />
          <rect x="135" y="340" width="4" height="4" fill="#9065F5" />
        </g>

        {/* Pixel Stream 3: Top-Left drifting toward core */}
        <g style={{ animation: "edpPixelDriftIn1 4.8s ease-in-out infinite 1.8s" }}>
          <rect x="160" y="195" width="4" height="4" fill="#398BFF" />
          <rect x="145" y="185" width="5" height="5" fill="#00D9F5" opacity="0.9" />
          <rect x="170" y="205" width="3.5" height="3.5" fill="#00D9F5" />
        </g>

        {/* Small Steganographic 3x3 Pixel Byte Matrices */}
        <g opacity="0.22">
          {/* Top-Left Matrix Block */}
          <rect x="45" y="110" width="4" height="4" fill="#00D9F5" />
          <rect x="52" y="110" width="4" height="4" fill="#398BFF" />
          <rect x="59" y="110" width="4" height="4" fill="#00D9F5" />
          <rect x="45" y="117" width="4" height="4" fill="#398BFF" />
          <rect x="52" y="117" width="4" height="4" fill="#00D9F5" />
          <rect x="59" y="117" width="4" height="4" fill="#398BFF" />
          <rect x="45" y="124" width="4" height="4" fill="#00D9F5" />
          <rect x="52" y="124" width="4" height="4" fill="#398BFF" />
          <rect x="59" y="124" width="4" height="4" fill="#00D9F5" />

          {/* Lower-Right Matrix Block */}
          <rect x="425" y="470" width="4" height="4" fill="#00D9F5" />
          <rect x="432" y="470" width="4" height="4" fill="#398BFF" />
          <rect x="439" y="470" width="4" height="4" fill="#00D9F5" />
          <rect x="425" y="477" width="4" height="4" fill="#398BFF" />
          <rect x="432" y="477" width="4" height="4" fill="#00D9F5" />
          <rect x="439" y="477" width="4" height="4" fill="#398BFF" />
        </g>

        {/* 7. Tiny Digital Nodes & Light Path Edges */}
        <g stroke="#00D9F5" strokeWidth="0.8" fill="none" opacity="0.15">
          <path d="M 40 270 L 70 270" />
          <path d="M 430 270 L 460 270" />
          <path d="M 250 50 L 250 95" />
          <path d="M 250 445 L 250 490" />
        </g>
        <g fill="#00D9F5">
          <circle cx="40" cy="270" r="2.5" opacity="0.35" style={{ animation: "edpSeqNodePulse 3.5s ease-in-out infinite" }} />
          <circle cx="460" cy="270" r="2.5" opacity="0.35" style={{ animation: "edpSeqNodePulse 3.5s ease-in-out infinite 0.7s" }} />
          <circle cx="250" cy="50" r="2.5" opacity="0.35" style={{ animation: "edpSeqNodePulse 3.5s ease-in-out infinite 1.4s" }} />
          <circle cx="250" cy="490" r="2.5" opacity="0.35" style={{ animation: "edpSeqNodePulse 3.5s ease-in-out infinite 2.1s" }} />
        </g>
      </svg>
    </div>
  );
}

export function DecryptContainerArtwork() {
  return (
    <div className="edp-container-artwork" aria-hidden="true">
      <svg
        viewBox="0 0 500 700"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full select-none"
      >
        <defs>
          {/* Emerald-Teal Portal Ambient Pool */}
          <radialGradient id="portalAmbientGlow" cx="50%" cy="38%" r="58%">
            <stop offset="0%" stopColor="#00D6A0" stopOpacity="0.14" />
            <stop offset="42%" stopColor="#06B6D4" stopOpacity="0.06" />
            <stop offset="82%" stopColor="#10B981" stopOpacity="0.02" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Central Portal Optical Flare */}
          <radialGradient id="portalCoreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00D6A0" stopOpacity="0.45" />
            <stop offset="45%" stopColor="#06B6D4" stopOpacity="0.25" />
            <stop offset="80%" stopColor="#10B981" stopOpacity="0.10" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Laser Scanning Beam Gradient */}
          <linearGradient id="portalScanBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="20%" stopColor="#06B6D4" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#00D6A0" stopOpacity="0.8" />
            <stop offset="80%" stopColor="#06B6D4" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Honeycomb Protective Matrix Pattern */}
          <pattern id="portalHexPattern" width="40" height="69.28" patternUnits="userSpaceOnUse" patternTransform="scale(0.85)">
            <path
              d="M 40 0 L 20 11.55 L 0 0 L 0 23.09 L 20 34.64 L 40 23.09 Z M 0 34.64 L 20 46.19 L 0 57.74 L 0 80.83 L 20 92.38 L 40 80.83 L 40 57.74 L 20 46.19 Z"
              fill="none"
              stroke="#00D6A0"
              strokeWidth="0.8"
              opacity="0.07"
            />
          </pattern>
        </defs>

        {/* 1. Ambient Lighting Pool */}
        <rect width="100%" height="100%" fill="url(#portalAmbientGlow)" />

        {/* 2. Hexagonal Protective Matrix in Upper Left & Lower Right Corners */}
        <rect x="20" y="40" width="210" height="190" fill="url(#portalHexPattern)" opacity="0.9" style={{ animation: "edpHexGlow 6.5s ease-in-out infinite 0.7s" }} />
        <rect x="270" y="450" width="210" height="210" fill="url(#portalHexPattern)" opacity="0.8" style={{ animation: "edpHexGlow 6.5s ease-in-out infinite 2.2s" }} />

        {/* 3. Futuristic Holographic Access Portal Rings (Center at 250, 270) */}
        {/* Ring A: Outer Optical Access Gate with Telemetry Chevrons */}
        <g style={{ transformOrigin: "250px 270px", animation: "edpPortalPulse 6s ease-in-out infinite" }}>
          <circle cx="250" cy="270" r="162" fill="none" stroke="#00D6A0" strokeWidth="1.3" strokeDasharray="18 12" opacity="0.10" />
          {/* Directional Chevron Markers around perimeter */}
          <path d="M 245 102 L 250 96 L 255 102" fill="none" stroke="#00D6A0" strokeWidth="1.5" opacity="0.25" />
          <path d="M 245 438 L 250 444 L 255 438" fill="none" stroke="#00D6A0" strokeWidth="1.5" opacity="0.25" />
          <path d="M 82 265 L 76 270 L 82 275" fill="none" stroke="#00D6A0" strokeWidth="1.5" opacity="0.25" />
          <path d="M 418 265 L 424 270 L 418 275" fill="none" stroke="#00D6A0" strokeWidth="1.5" opacity="0.25" />
        </g>

        {/* Ring B: Middle Counter-Rotating Access Dial */}
        <g style={{ transformOrigin: "250px 270px", animation: "edpVaultRingCCW 24s linear infinite" }}>
          <circle cx="250" cy="270" r="124" fill="none" stroke="#06B6D4" strokeWidth="1.2" strokeDasharray="28 14" opacity="0.12" />
          {/* Segmented Quadrant Arcs */}
          <path d="M 250 146 A 124 124 0 0 1 374 270" fill="none" stroke="#00D6A0" strokeWidth="2.4" strokeLinecap="round" opacity="0.22" />
          <path d="M 250 394 A 124 124 0 0 1 126 270" fill="none" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" opacity="0.22" />
        </g>

        {/* Ring C: Inner Quantum Gateway Alignment Ring (Clockwise) */}
        <g style={{ transformOrigin: "250px 270px", animation: "edpVaultRingCW 16s linear infinite" }}>
          <circle cx="250" cy="270" r="88" fill="none" stroke="#00D6A0" strokeWidth="1.1" strokeDasharray="10 8" opacity="0.14" />
          <circle cx="250" cy="270" r="64" fill="none" stroke="#06B6D4" strokeWidth="1" strokeDasharray="6 6" opacity="0.16" />
        </g>

        {/* 4. Geometric Cryptographic Key / Vault Key Matrix Emblem */}
        <g style={{ transformOrigin: "250px 270px" }}>
          <circle cx="250" cy="270" r="42" fill="url(#portalCoreGlow)" style={{ animation: "edpCorePulse 4s ease-in-out infinite 0.5s" }} />
          {/* Key-Lock Aperture Outline */}
          <circle cx="250" cy="258" r="16" fill="none" stroke="#00D6A0" strokeWidth="1.4" opacity="0.4" />
          <path d="M 244 266 L 240 288 L 260 288 L 256 266 Z" fill="none" stroke="#00D6A0" strokeWidth="1.4" opacity="0.4" />
          {/* Horizontal Gate Wings */}
          <line x1="205" y1="270" x2="295" y2="270" stroke="#00D6A0" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.25" />
          <circle cx="250" cy="270" r="4" fill="#00D6A0" opacity="0.75" />
        </g>

        {/* 5. Traveling Scanning Laser Beam across Portal Field */}
        <g>
          <line
            x1="110"
            y1="270"
            x2="390"
            y2="270"
            stroke="url(#portalScanBeamGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            style={{ animation: "edpScanBeamSweep 6.5s cubic-bezier(0.4, 0, 0.2, 1) infinite" }}
          />
        </g>

        {/* 6. Steganographic Pixel Reconstruction Effect (Pixels emerging from portal) */}
        {/* Pixel Cluster 1: Emerging outward toward top-right */}
        <g style={{ animation: "edpPixelReconstruct1 5s ease-in-out infinite" }}>
          <rect x="290" y="225" width="4" height="4" fill="#00D6A0" />
          <rect x="305" y="215" width="3.5" height="3.5" fill="#06B6D4" />
          <rect x="315" y="235" width="5" height="5" fill="#00D6A0" opacity="0.9" />
          <rect x="330" y="210" width="4" height="4" fill="#10B981" />
        </g>

        {/* Pixel Cluster 2: Emerging outward toward bottom-left */}
        <g style={{ animation: "edpPixelReconstruct2 5.5s ease-in-out infinite 1.2s" }}>
          <rect x="200" y="305" width="4" height="4" fill="#00D6A0" />
          <rect x="185" y="320" width="5" height="5" fill="#06B6D4" opacity="0.9" />
          <rect x="195" y="335" width="3.5" height="3.5" fill="#00D6A0" />
          <rect x="175" y="315" width="4" height="4" fill="#10B981" />
        </g>

        {/* Pixel Cluster 3: Emerging outward toward top-left */}
        <g style={{ animation: "edpPixelReconstruct2 4.8s ease-in-out infinite 2.2s" }}>
          <rect x="200" y="225" width="4" height="4" fill="#06B6D4" />
          <rect x="185" y="215" width="5" height="5" fill="#00D6A0" opacity="0.9" />
          <rect x="170" y="230" width="3.5" height="3.5" fill="#00D6A0" />
        </g>

        {/* Reconstructed 3x3 Stego Block Matrices */}
        <g opacity="0.22">
          {/* Top-Right Matrix Block */}
          <rect x="425" y="110" width="4" height="4" fill="#00D6A0" />
          <rect x="432" y="110" width="4" height="4" fill="#06B6D4" />
          <rect x="439" y="110" width="4" height="4" fill="#00D6A0" />
          <rect x="425" y="117" width="4" height="4" fill="#06B6D4" />
          <rect x="432" y="117" width="4" height="4" fill="#00D6A0" />
          <rect x="439" y="117" width="4" height="4" fill="#06B6D4" />
          <rect x="425" y="124" width="4" height="4" fill="#00D6A0" />
          <rect x="432" y="124" width="4" height="4" fill="#06B6D4" />
          <rect x="439" y="124" width="4" height="4" fill="#00D6A0" />

          {/* Lower-Left Matrix Block */}
          <rect x="45" y="470" width="4" height="4" fill="#00D6A0" />
          <rect x="52" y="470" width="4" height="4" fill="#06B6D4" />
          <rect x="59" y="470" width="4" height="4" fill="#00D6A0" />
          <rect x="45" y="477" width="4" height="4" fill="#06B6D4" />
          <rect x="52" y="477" width="4" height="4" fill="#00D6A0" />
          <rect x="59" y="477" width="4" height="4" fill="#06B6D4" />
        </g>

        {/* 7. Sequential Emerald Energy Nodes (Chasing Illumination around perimeter) */}
        <g fill="#00D6A0">
          {/* Node 1: Top (0°) */}
          <circle cx="250" cy="108" r="3" style={{ transformOrigin: "250px 108px", animation: "edpSeqNodePulse 4s ease-in-out infinite 0s" }} />
          {/* Node 2: Top-Right (45°) */}
          <circle cx="363" cy="157" r="3" style={{ transformOrigin: "363px 157px", animation: "edpSeqNodePulse 4s ease-in-out infinite 0.5s" }} />
          {/* Node 3: Right (90°) */}
          <circle cx="412" cy="270" r="3" style={{ transformOrigin: "412px 270px", animation: "edpSeqNodePulse 4s ease-in-out infinite 1.0s" }} />
          {/* Node 4: Bottom-Right (135°) */}
          <circle cx="363" cy="383" r="3" style={{ transformOrigin: "363px 383px", animation: "edpSeqNodePulse 4s ease-in-out infinite 1.5s" }} />
          {/* Node 5: Bottom (180°) */}
          <circle cx="250" cy="432" r="3" style={{ transformOrigin: "250px 432px", animation: "edpSeqNodePulse 4s ease-in-out infinite 2.0s" }} />
          {/* Node 6: Bottom-Left (225°) */}
          <circle cx="137" cy="383" r="3" style={{ transformOrigin: "137px 383px", animation: "edpSeqNodePulse 4s ease-in-out infinite 2.5s" }} />
          {/* Node 7: Left (270°) */}
          <circle cx="88" cy="270" r="3" style={{ transformOrigin: "88px 270px", animation: "edpSeqNodePulse 4s ease-in-out infinite 3.0s" }} />
          {/* Node 8: Top-Left (315°) */}
          <circle cx="137" cy="157" r="3" style={{ transformOrigin: "137px 157px", animation: "edpSeqNodePulse 4s ease-in-out infinite 3.5s" }} />
        </g>

        {/* 8. Thin Protective Geometric Radial Guides */}
        <g stroke="#00D6A0" strokeWidth="0.8" fill="none" opacity="0.12">
          <line x1="250" y1="50" x2="250" y2="108" />
          <line x1="250" y1="432" x2="250" y2="490" />
          <line x1="30" y1="270" x2="88" y2="270" />
          <line x1="412" y1="270" x2="470" y2="270" />
        </g>
      </svg>
    </div>
  );
}
