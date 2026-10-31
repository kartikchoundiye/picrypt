// frontend/src/components/Register.jsx

import { useState, useEffect, useRef, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaShieldAlt,
  FaLock,
  FaEnvelope,
  FaKey,
  FaCheckCircle,
  FaExclamationTriangle,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaRedoAlt,
} from "react-icons/fa";

import { ENDPOINTS } from "../utils/api";
import picryptLogo from "../assets/picrypt_logo.png";

const API_BASE = ENDPOINTS.AUTH;

/**
 * World Continent Polygons in [lon, lat] degrees.
 * High-fidelity geometric outlines for:
 * North America, Greenland, Central America, South America, Europe, British Isles, Africa, Asia, India, Australia
 */
const WORLD_CONTINENTS = [
  // North America
  [
    [-168, 65], [-155, 71], [-135, 70], [-115, 68], [-95, 73], [-80, 72], [-70, 62],
    [-55, 52], [-65, 45], [-75, 38], [-80, 26], [-90, 28], [-98, 26], [-105, 20],
    [-115, 30], [-124, 40], [-125, 49], [-138, 58], [-160, 58], [-168, 65]
  ],
  // Greenland
  [
    [-45, 60], [-30, 65], [-20, 72], [-25, 80], [-40, 83], [-55, 80], [-55, 70], [-45, 60]
  ],
  // Central America
  [
    [-105, 23], [-96, 17], [-85, 13], [-77, 8], [-82, 10], [-90, 14], [-100, 20], [-105, 23]
  ],
  // South America
  [
    [-77, 10], [-65, 11], [-52, 5], [-35, -5], [-37, -13], [-42, -23], [-50, -32],
    [-58, -42], [-66, -54], [-74, -45], [-72, -30], [-80, -5], [-77, 10]
  ],
  // Europe
  [
    [-9, 37], [-9, 43], [0, 44], [5, 50], [10, 58], [15, 63], [25, 71],
    [30, 60], [28, 45], [20, 40], [15, 38], [5, 43], [-5, 36], [-9, 37]
  ],
  // British Isles
  [
    [-5, 50], [-1, 51], [1, 53], [-2, 58], [-5, 58], [-6, 54], [-5, 50]
  ],
  // Africa
  [
    [-6, 36], [10, 37], [25, 32], [33, 31], [40, 15], [51, 11], [42, -10],
    [32, -30], [20, -35], [15, -25], [10, -5], [0, 6], [-15, 12], [-17, 24], [-6, 36]
  ],
  // Asia
  [
    [33, 31], [40, 40], [55, 45], [70, 60], [90, 73], [140, 73], [170, 66],
    [160, 50], [140, 40], [122, 30], [105, 20], [80, 12], [70, 22], [55, 25],
    [45, 28], [35, 32], [33, 31]
  ],
  // Indian Peninsula
  [
    [70, 22], [77, 8], [80, 12], [88, 21], [80, 26], [70, 22]
  ],
  // Australia
  [
    [114, -22], [125, -14], [135, -12], [145, -15], [152, -25],
    [150, -37], [138, -35], [120, -35], [114, -22]
  ]
];

// Helper: Convert [latDeg, lonDeg] to 3D unit sphere vector {x, y, z}
function latLonToUnitXYZ(latDeg, lonDeg) {
  const latRad = (latDeg * Math.PI) / 180;
  const lonRad = (lonDeg * Math.PI) / 180;
  return {
    x: Math.cos(latRad) * Math.sin(lonRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.cos(lonRad),
  };
}

// Point-in-polygon helper
function isPointInPoly(pt, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect =
      yi > pt[1] !== yj > pt[1] &&
      pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

// Draw a Concentric Cyan Ring Accent Node
function drawConcentricNode(ctx, x, y, size, alpha) {
  if (alpha <= 0.05) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);

  // Outer Cyan Ring
  ctx.strokeStyle = "rgba(103, 232, 249, 0.85)";
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
  ctx.stroke();

  // Inner White Dot
  ctx.fillStyle = "#FFFFFF";
  ctx.shadowColor = "#38bdf8";
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.65, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

/**
 * DigitalNetworkBackground:
 * Renders a dark royal-blue digital Earth made of glowing dots, with a wireframe grid,
 * dense dot-matrix continents, North American magenta-cyan hotspot bloom,
 * horizontal elliptical ground glow, orbital ring, and network nodes.
 */
const DigitalNetworkBackground = memo(() => {
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

    // 1. Sample Dense Continent Dot-Matrix Grid (3 to 4 degree spacing)
    const continentDots = [];
    for (let lat = -58; lat <= 75; lat += 3.2) {
      for (let lon = -180; lon <= 180; lon += 3.2) {
        for (const poly of WORLD_CONTINENTS) {
          if (isPointInPoly([lon, lat], poly)) {
            continentDots.push(latLonToUnitXYZ(lat, lon));
            break;
          }
        }
      }
    }

    // 2. Faint Continent Outlines
    const continentOutlines = WORLD_CONTINENTS.map((poly) =>
      poly.map(([lon, lat]) => latLonToUnitXYZ(lat, lon))
    );

    // 3. Network Nodes on the Globe Surface
    const networkNodes = [
      // Ring accent nodes
      { lat: 40, lon: -74, type: "ring", size: 3.5 }, // New York
      { lat: 48, lon: 2, type: "ring", size: 3.6 }, // Paris/London
      { lat: -12, lon: -45, type: "ring", size: 3.4 }, // Brazil
      { lat: 35, lon: 139, type: "ring", size: 3.6 }, // Tokyo

      // Small glowing white-cyan dots (2 to 3 px)
      { lat: 37, lon: -122, type: "dot", size: 2.2 }, // San Francisco
      { lat: 25, lon: -35, type: "dot", size: 2.4 }, // Atlantic
      { lat: 52, lon: 13, type: "dot", size: 2.2 }, // Berlin
      { lat: 59, lon: 18, type: "dot", size: 2.0 }, // Stockholm
      { lat: -34, lon: -58, type: "dot", size: 2.3 }, // Buenos Aires
      { lat: 10, lon: 15, type: "dot", size: 2.4 }, // Central Africa
      { lat: -26, lon: 28, type: "dot", size: 2.2 }, // South Africa
      { lat: 25, lon: 55, type: "dot", size: 2.4 }, // Dubai
      { lat: 19, lon: 72, type: "dot", size: 2.4 }, // Mumbai
      { lat: 1, lon: 104, type: "dot", size: 2.3 }, // Singapore
      { lat: -33, lon: 151, type: "dot", size: 2.3 }, // Sydney
      { lat: 60, lon: -45, type: "dot", size: 2.0 }, // South Greenland
      { lat: 20, lon: -90, type: "dot", size: 2.2 }, // Gulf of Mexico
      { lat: 32, lon: 35, type: "dot", size: 2.2 }, // Mediterranean
      { lat: -10, lon: -20, type: "dot", size: 2.2 }, // Mid Atlantic
      { lat: 15, lon: 80, type: "dot", size: 2.2 }, // Bay of Bengal
    ].map((hub) => ({
      ...hub,
      ...latLonToUnitXYZ(hub.lat, hub.lon),
    }));

    // Interconnect network nodes with lines
    const networkEdges = [];
    for (let i = 0; i < networkNodes.length; i++) {
      for (let j = i + 1; j < networkNodes.length; j++) {
        const dx = networkNodes[i].x - networkNodes[j].x;
        const dy = networkNodes[i].y - networkNodes[j].y;
        const dz = networkNodes[i].z - networkNodes[j].z;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < 0.45) {
          networkEdges.push({ from: i, to: j });
        }
      }
    }

    // Traveling Energy Sparks along Network Lines
    const networkSparks = Array.from({ length: 14 }, () => ({
      edge: networkEdges[Math.floor(Math.random() * networkEdges.length)],
      progress: Math.random(),
      speed: (prefersReducedMotion ? 0.003 : 0.01) + Math.random() * 0.007,
    }));

    // 4. North America Hot Spot Vector (lat ~40, lon ~-100)
    const naHotspotXYZ = latLonToUnitXYZ(40, -100);

    // 5. Scattered Small Cyan Dust Particles
    const isDesktop = width >= 1024;
    const PARTICLE_COUNT = isDesktop ? 48 : 22;
    const bgParticles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.6,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.28 + 0.08),
      alpha: Math.random() * 0.45 + 0.15,
      color: Math.random() > 0.4 ? "#67e8f9" : "#38bdf8",
    }));

    // 6. Cross-Screen Transmission Laser Streams (Reduced Opacity)
    const streamBeams = Array.from({ length: 4 }, (_, idx) => ({
      offsetY: (idx - 1.5) * 65,
      progress: Math.random(),
      speed: 0.01 + idx * 0.002,
    }));

    // Dual-axis continuous rotation state
    let globeAngleY = 0.5; // Horizontal rotation (Yaw)
    let globeAngleX = 0.2; // Vertical rotation (Pitch)
    const tiltZ = 0.22;    // ~12.6 deg axial roll tilt

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const desktop = width >= 1024;
      const tablet = width >= 768 && width < 1024;

      // Position: 3D CYBER GLOBE ON LEFT SIDE
      let globeCx, globeCy, globeR, globeOpacity;
      if (desktop) {
        globeCx = width * 0.28;
        globeCy = height * 0.5;
        globeR = Math.min(295, Math.max(220, height * 0.37));
        globeOpacity = 1.0;
      } else if (tablet) {
        globeCx = width * 0.32;
        globeCy = height * 0.48;
        globeR = 200;
        globeOpacity = 0.65;
      } else {
        // Mobile
        globeCx = width * 0.5;
        globeCy = height * 0.34;
        globeR = 142;
        globeOpacity = 0.25;
      }

      // Continuous dual-axis rotation (horizontal + vertical simultaneously)
      globeAngleY += prefersReducedMotion ? 0.0006 : 0.0034;
      globeAngleX += prefersReducedMotion ? 0.0004 : 0.0020;

      // ----------------------------------------------------
      // 1. DEEP NAVY GRADIENT BACKGROUND (#0b1f4a center -> #050d24 edges)
      // ----------------------------------------------------
      const bgGrad = ctx.createRadialGradient(
        width * 0.38,
        height * 0.5,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, "#0b1f4a");
      bgGrad.addColorStop(1, "#050d24");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Scattered Small Cyan Dust Particles
      bgParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

      // ----------------------------------------------------
      // 7. GROUND GLOW: HORIZONTAL ELLIPTICAL CYAN LIGHT POOL UNDER GLOBE
      // ----------------------------------------------------
      ctx.save();
      ctx.translate(globeCx, globeCy + globeR * 1.08);
      ctx.scale(1, 0.22);
      const groundGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, globeR * 1.6);
      groundGlow.addColorStop(0, `rgba(103, 232, 249, ${0.25 * globeOpacity})`);
      groundGlow.addColorStop(0.35, `rgba(56, 189, 248, ${0.12 * globeOpacity})`);
      groundGlow.addColorStop(0.7, `rgba(14, 116, 144, ${0.04 * globeOpacity})`);
      groundGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = groundGlow;
      ctx.beginPath();
      ctx.arc(0, 0, globeR * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ----------------------------------------------------
      // 6. ATMOSPHERE: SUBTLE CYAN OUTER GLOW AROUND GLOBE
      // ----------------------------------------------------
      const atmosphereGlow = ctx.createRadialGradient(
        globeCx,
        globeCy,
        globeR * 0.94,
        globeCx,
        globeCy,
        globeR * 1.3
      );
      atmosphereGlow.addColorStop(0, `rgba(56, 189, 248, ${0.18 * globeOpacity})`);
      atmosphereGlow.addColorStop(0.5, `rgba(14, 116, 144, ${0.07 * globeOpacity})`);
      atmosphereGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(globeCx, globeCy, globeR * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Dark Royal-Blue Sphere Core Shading
      const oceanShading = ctx.createRadialGradient(
        globeCx + globeR * 0.22,
        globeCy - globeR * 0.25,
        globeR * 0.1,
        globeCx,
        globeCy,
        globeR
      );
      oceanShading.addColorStop(0, "rgba(24, 52, 108, 0.96)");
      oceanShading.addColorStop(0.55, "rgba(12, 30, 68, 0.98)");
      oceanShading.addColorStop(0.88, "rgba(6, 16, 40, 0.98)");
      oceanShading.addColorStop(1, "rgba(3, 9, 24, 0.98)");
      ctx.fillStyle = oceanShading;
      ctx.beginPath();
      ctx.arc(globeCx, globeCy, globeR, 0, Math.PI * 2);
      ctx.fill();

      // ----------------------------------------------------
      // 3D MATH ENGINE PROJECTION (SIMULTANEOUS DUAL-AXIS ROTATION: HORIZONTAL + VERTICAL)
      // ----------------------------------------------------
      const cosY = Math.cos(globeAngleY);
      const sinY = Math.sin(globeAngleY);
      const cosX = Math.cos(globeAngleX);
      const sinX = Math.sin(globeAngleX);
      const cosZ = Math.cos(tiltZ);
      const sinZ = Math.sin(tiltZ);

      const projectUnitSphere = (pt) => {
        // 1. Horizontal rotation around Y-axis (Yaw / longitude rotation)
        const x1 = pt.x * cosY + pt.z * sinY;
        const y1 = pt.y;
        const z1 = -pt.x * sinY + pt.z * cosY;

        // 2. Vertical rotation around X-axis (Pitch / latitude rotation)
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // 3. Subtle axial tilt around Z-axis (Roll / aesthetic inclination)
        const x3 = x2 * cosZ - y2 * sinZ;
        const y3 = x2 * sinZ + y2 * cosZ;
        const z3 = z2;

        const isFront = z3 >= 0;
        let px, py;

        if (isFront) {
          px = globeCx + x3 * globeR;
          py = globeCy + y3 * globeR;
        } else {
          // Clamp to horizon perimeter to prevent polygon back-tearing
          const len = Math.sqrt(x3 * x3 + y3 * y3) || 1;
          px = globeCx + (x3 / len) * globeR;
          py = globeCy + (y3 / len) * globeR;
        }

        return { px, py, z2: z3, isFront, x2: x3, y2: y3 };
      };

      // ----------------------------------------------------
      // 3. WIREFRAME GRID (Latitude & Longitude every 15 degrees)
      // ----------------------------------------------------
      ctx.save();
      ctx.beginPath();
      ctx.arc(globeCx, globeCy, globeR, 0, Math.PI * 2);
      ctx.clip();

      // Latitude Parallels (every 15 deg from -75 to 75)
      const latRings = [-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75];
      latRings.forEach((latDeg) => {
        ctx.beginPath();
        let started = false;

        for (let lonDeg = -180; lonDeg <= 180; lonDeg += 3) {
          const pt = latLonToUnitXYZ(latDeg, lonDeg);
          const p = projectUnitSphere(pt);

          if (p.isFront) {
            if (!started) {
              ctx.moveTo(p.px, p.py);
              started = true;
            } else {
              ctx.lineTo(p.px, p.py);
            }
          } else {
            if (started) {
              ctx.lineTo(p.px, p.py);
              started = false;
            }
          }
        }
        ctx.strokeStyle = `rgba(165, 243, 252, ${0.35 * globeOpacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      // Longitude Meridians (every 15 deg from -180 to 180)
      for (let lonDeg = -180; lonDeg < 180; lonDeg += 15) {
        ctx.beginPath();
        let started = false;

        for (let latDeg = -88; latDeg <= 88; latDeg += 3) {
          const pt = latLonToUnitXYZ(latDeg, lonDeg);
          const p = projectUnitSphere(pt);

          if (p.isFront) {
            if (!started) {
              ctx.moveTo(p.px, p.py);
              started = true;
            } else {
              ctx.lineTo(p.px, p.py);
            }
          } else {
            if (started) {
              ctx.lineTo(p.px, p.py);
              started = false;
            }
          }
        }
        ctx.strokeStyle = `rgba(165, 243, 252, ${0.35 * globeOpacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // ----------------------------------------------------
      // 4. HOT SPOT: SOFT MAGENTA-TO-CYAN RADIAL GLOW OVER NORTH AMERICA (lat 40, lon -100)
      // ----------------------------------------------------
      const naHotspot = projectUnitSphere(naHotspotXYZ);
      if (naHotspot.isFront) {
        const bloomRadius = globeR * 0.48;
        const bloom = ctx.createRadialGradient(
          naHotspot.px,
          naHotspot.py,
          0,
          naHotspot.px,
          naHotspot.py,
          bloomRadius
        );
        bloom.addColorStop(0, `rgba(244, 114, 182, ${0.45 * naHotspot.z2 * globeOpacity})`); // pinkish-magenta
        bloom.addColorStop(0.35, `rgba(192, 132, 252, ${0.28 * naHotspot.z2 * globeOpacity})`); // violet
        bloom.addColorStop(0.7, `rgba(103, 232, 249, ${0.14 * naHotspot.z2 * globeOpacity})`); // cyan
        bloom.addColorStop(1, "rgba(0, 217, 245, 0)");
        ctx.fillStyle = bloom;
        ctx.beginPath();
        ctx.arc(naHotspot.px, naHotspot.py, bloomRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // ----------------------------------------------------
      // 2. CONTINENTS: DENSE GLOWING DOT-MATRIX GRID (#67e8f9)
      // ----------------------------------------------------
      continentDots.forEach((pt) => {
        const p = projectUnitSphere(pt);
        if (p.isFront) {
          // Opacity varies based on depth z2, fading smoothly toward the limb
          const dotAlpha = (0.15 + 0.85 * Math.pow(p.z2, 1.15)) * globeOpacity;
          const dotRadius = 1.0 + 0.35 * p.z2;

          ctx.fillStyle = `rgba(103, 232, 249, ${dotAlpha})`;
          ctx.beginPath();
          ctx.arc(p.px, p.py, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Faint continent outlines
      continentOutlines.forEach((poly) => {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < poly.length; i++) {
          const p = projectUnitSphere(poly[i]);
          if (p.isFront) {
            if (!started) {
              ctx.moveTo(p.px, p.py);
              started = true;
            } else {
              ctx.lineTo(p.px, p.py);
            }
          } else {
            started = false;
          }
        }
        ctx.strokeStyle = `rgba(165, 243, 252, ${0.12 * globeOpacity})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      });

      ctx.restore(); // Exit sphere clipping

      // ----------------------------------------------------
      // 3. (CONT) TILTED 3D ORBITAL ELLIPTICAL RING AROUND GLOBE
      // ----------------------------------------------------
      ctx.save();
      ctx.translate(globeCx, globeCy);
      ctx.rotate(-0.48);
      ctx.strokeStyle = `rgba(165, 243, 252, ${0.32 * globeOpacity})`;
      ctx.lineWidth = 1.1;
      ctx.setLineDash([6, 10]);
      ctx.lineDashOffset = -globeAngleY * 22;
      ctx.beginPath();
      ctx.ellipse(0, 0, globeR * 1.28, globeR * 0.44, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // ----------------------------------------------------
      // 5. NETWORK NODES: SMALL GLOWING WHITE-CYAN DOTS & CONNECTING LINES
      // ----------------------------------------------------
      const projectedNodes = networkNodes.map((node) => ({
        ...node,
        ...projectUnitSphere(node),
      }));

      // Thin cyan network lines
      networkEdges.forEach(({ from, to }) => {
        const n1 = projectedNodes[from];
        const n2 = projectedNodes[to];

        if (n1.isFront && n2.isFront) {
          const edgeAlpha = Math.min(n1.z2, n2.z2);
          ctx.strokeStyle = `rgba(165, 243, 252, ${(0.32 + 0.35 * edgeAlpha) * globeOpacity})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(n1.px, n1.py);
          ctx.lineTo(n2.px, n2.py);
          ctx.stroke();
        }
      });

      // Traveling Energy Sparks along Network Lines
      networkSparks.forEach((spark) => {
        spark.progress += spark.speed;
        if (spark.progress >= 1) {
          spark.progress = 0;
          spark.edge =
            networkEdges[Math.floor(Math.random() * networkEdges.length)];
        }

        if (spark.edge) {
          const n1 = projectedNodes[spark.edge.from];
          const n2 = projectedNodes[spark.edge.to];
          if (n1.isFront && n2.isFront) {
            const curX = n1.px + (n2.px - n1.px) * spark.progress;
            const curY = n1.py + (n2.py - n1.py) * spark.progress;

            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = "#67e8f9";
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(curX, curY, 2.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Render Nodes (Mostly small 2 to 3 px glowing white-cyan dots + ring accents)
      projectedNodes.forEach((node) => {
        if (node.isFront) {
          const alpha = (0.35 + 0.65 * node.z2) * globeOpacity;

          if (node.type === "ring") {
            drawConcentricNode(ctx, node.px, node.py, node.size, alpha);
          } else {
            // Small glowing white-cyan dot
            ctx.fillStyle = "#FFFFFF";
            ctx.shadowColor = "#67e8f9";
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(node.px, node.py, node.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      });

      // Outer globe rim circle
      ctx.strokeStyle = `rgba(103, 232, 249, ${0.45 * globeOpacity})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(globeCx, globeCy, globeR, 0, Math.PI * 2);
      ctx.stroke();

      // ----------------------------------------------------
      // 8. LASER DATA BEAMS (DESKTOP RIGHT SIDE ONLY, REDUCED OPACITY)
      // ----------------------------------------------------
      if (desktop) {
        const targetBoxX = width - 480;
        const targetBoxY = height * 0.5;

        streamBeams.forEach((beam) => {
          beam.progress = (beam.progress + beam.speed) % 1;

          const startX = globeCx + globeR * 0.88;
          const startY = globeCy + beam.offsetY * 0.75;
          const endX = targetBoxX;
          const endY = targetBoxY + beam.offsetY;

          const cp1x = startX + (endX - startX) * 0.45;
          const cp1y = startY + beam.offsetY * 0.85;
          const cp2x = startX + (endX - startX) * 0.65;
          const cp2y = endY - beam.offsetY * 0.45;

          // Reduced opacity laser path line
          ctx.strokeStyle = "rgba(103, 232, 249, 0.08)";
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
          ctx.stroke();

          // Cubic Bezier point computation for traveling cyber packet
          const t = beam.progress;
          const u = 1 - t;
          const tt = t * t;
          const uu = u * u;
          const uuu = uu * u;
          const ttt = tt * t;

          const px =
            uuu * startX +
            3 * uu * t * cp1x +
            3 * u * tt * cp2x +
            ttt * endX;
          const py =
            uuu * startY +
            3 * uu * t * cp1y +
            3 * u * tt * cp2y +
            ttt * endY;

          // Subtle traveling packet
          ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
          ctx.shadowColor = "#38bdf8";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      animId = requestAnimationFrame(render);
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

DigitalNetworkBackground.displayName = "DigitalNetworkBackground";

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingSendOTP, setLoadingSendOTP] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // seconds left until resend allowed
  const [alreadyRegisteredMsg, setAlreadyRegisteredMsg] = useState("");
  const [redirectingToLogin, setRedirectingToLogin] = useState(false);
  const [count, setCount] = useState(15); // Redirecting seconds left after registration successful

  const cooldownTimerRef = useRef(null);
  const redirectTimerRef = useRef(null);
  const countdownRedirectRef = useRef(null);

  const navigate = useNavigate();

  // Auto redirect when step === 3
  useEffect(() => {
    if (step === 3) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, navigate]);

  // Cleanup all timers when component unmounts
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
      if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
      if (countdownRedirectRef.current) clearInterval(countdownRedirectRef.current);
    };
  }, []);

  const startCooldownTimer = (seconds = 30) => {
    setResendCooldown(seconds);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);

    cooldownTimerRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimerRef.current);
          cooldownTimerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();

    // Prevent sending if already loading or in cooldown or redirecting
    if (loadingSendOTP || resendCooldown > 0 || redirectingToLogin) return;

    try {
      setLoadingSendOTP(true);
      setError("");
      setMessage("");

      const res = await axios.post(`${API_BASE}/send-otp/`, { email });
      console.log("send-otp success:", res.data);

      const backendMessage = res.data?.message?.toLowerCase() || "";

      // Only allow moving to Step-2 if email sending truly succeeded
      if (backendMessage.includes("otp sent")) {
        setStep(2);
        setMessage("Verification OTP sent to your email!");
        setError("");
      } else {
        setError("Failed to send OTP. Try again later.");
        setMessage("");
        return;
      }

      // Start cooldown for resending (30 seconds)
      startCooldownTimer(30);
    } catch (err) {
      console.error("send-otp error:", err.response?.data || err.message);

      // Read backend error text
      const backendError = String(err.response?.data?.error || "").toLowerCase();

      // If backend says already registered -> redirect user to login
      if (
        backendError.includes("already") ||
        backendError.includes("registered") ||
        backendError.includes("exists")
      ) {
        setError("");
        setMessage("");
        setAlreadyRegisteredMsg("You already have a PICRYPT account");
        setRedirectingToLogin(true);

        const REDIRECT_MS = 5000;
        if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = setTimeout(() => {
          navigate("/login");
        }, REDIRECT_MS);

        let remaining = Math.ceil(REDIRECT_MS / 1000);
        if (countdownRedirectRef.current) clearInterval(countdownRedirectRef.current);
        setCount(remaining);
        countdownRedirectRef.current = setInterval(() => {
          remaining -= 1;
          setCount(remaining);
          if (remaining <= 0) {
            clearInterval(countdownRedirectRef.current);
            countdownRedirectRef.current = null;
          }
        }, 1000);
      } else {
        setError(
          err.response?.data?.error ||
          err.response?.data?.detail ||
          "Failed to send OTP. Try again later."
        );
        setMessage("");
      }
    } finally {
      setLoadingSendOTP(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loadingRegister) return;

    try {
      setLoadingRegister(true);
      setError("");
      setMessage("");

      await axios.post(`${API_BASE}/register/`, { email, otp, password });
      setStep(3);
      setError("");
      setMessage("");
    } catch (err) {
      console.error("register error:", err.response?.data || err.message);
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Invalid OTP or password error. Try again."
      );
      setMessage("");
    } finally {
      setLoadingRegister(false);
    }
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center lg:justify-end lg:pr-14 xl:pr-24 py-10 sm:py-16 px-4 relative overflow-hidden bg-[#060e22] min-h-[calc(100vh-4rem)]">
      {/* Keyframe Animations for Vivid Cyberpunk Rainbow & Chromatic Flow */}
      <style>{`
        @keyframes rainbow-border-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes chromatic-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes pulse-sheen {
          0% { transform: translateX(-100%); opacity: 0; }
          40% { opacity: 0.9; }
          80%, 100% { transform: translateX(200%); opacity: 0; }
        }
        @keyframes corner-neon-pulse {
          0%, 100% { opacity: 0.85; filter: drop-shadow(0 0 6px #00f5ff); }
          50% { opacity: 1; filter: drop-shadow(0 0 14px #ec4899); }
        }
        .animate-title-flow {
          animation: chromatic-flow 5s ease infinite;
          background-size: 250% 250%;
        }
        .animate-rainbow-spin {
          animation: rainbow-border-spin 6.5s linear infinite;
        }
      `}</style>

      {/* 1. Rotating Digital Earth Globe Canvas */}
      <DigitalNetworkBackground />

      {/* 2. Soft Ambient Multi-Color Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-1"
        style={{
          background:
            "radial-gradient(circle at 35% 50%, transparent 40%, rgba(6, 14, 34, 0.75) 100%)",
        }}
        aria-hidden="true"
      />

      {/* 3. Main Registration Container — VIBRANT MULTI-COLOR ANIMATED CYBER BORDER */}
      <motion.div
        initial={{ opacity: 0, x: 25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full max-w-[450px] z-10 mx-auto lg:mx-0 p-[3.5px] rounded-[28px] overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.9),0_0_40px_rgba(0,245,255,0.45),0_0_60px_rgba(236,72,153,0.4)]"
      >
        {/* Layer 1: Ambient Neon Bloom that spills outward */}
        <div
          className="absolute -inset-[100%] animate-rainbow-spin pointer-events-none opacity-90 blur-md"
          style={{
            background:
              "conic-gradient(from 0deg, #00f5ff 0deg, #3b82f6 55deg, #a855f7 110deg, #ec4899 165deg, #f59e0b 220deg, #10b981 275deg, #00f5ff 360deg)",
          }}
          aria-hidden="true"
        />

        {/* Layer 2: Ultra-Sharp Vivid Chromatic Laser Core */}
        <div
          className="absolute -inset-[100%] animate-rainbow-spin pointer-events-none opacity-100"
          style={{
            background:
              "conic-gradient(from 0deg, #00f5ff 0deg, #3b82f6 55deg, #a855f7 110deg, #ec4899 165deg, #f59e0b 220deg, #10b981 275deg, #00f5ff 360deg)",
          }}
          aria-hidden="true"
        />

        {/* Inner Card Body with Deep Dark Glassmorphism + Floating Multi-Color Aurora */}
        <div className="relative w-full p-6 sm:p-8 space-y-6 bg-[#060e24]/94 rounded-[25px] backdrop-blur-2xl text-white overflow-hidden border border-white/10 shadow-[inset_0_0_35px_rgba(0,245,255,0.08)]">
          
          {/* Cyberpunk 4-Corner Chromatic L-Brackets */}
          <span className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl pointer-events-none z-20 shadow-[0_0_12px_#00f5ff] animate-[corner-neon-pulse_4s_ease-in-out_infinite]" />
          <span className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-fuchsia-400 rounded-tr pointer-events-none z-20 shadow-[0_0_12px_#ec4899] animate-[corner-neon-pulse_4s_ease-in-out_infinite]" style={{ animationDelay: "1s" }} />
          <span className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-purple-400 rounded-bl pointer-events-none z-20 shadow-[0_0_12px_#a855f7] animate-[corner-neon-pulse_4s_ease-in-out_infinite]" style={{ animationDelay: "2s" }} />
          <span className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-emerald-400 rounded-br pointer-events-none z-20 shadow-[0_0_12px_#10b981] animate-[corner-neon-pulse_4s_ease-in-out_infinite]" style={{ animationDelay: "3s" }} />

          {/* Multi-Colored Ambient Aurora Orbs inside Card */}
          <div className="absolute -top-16 -left-16 w-44 h-44 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-fuchsia-500/22 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-purple-600/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-emerald-500/18 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "3s" }} />

          {/* Subtle Circuit Grid Texture */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #67e8f9 1px, transparent 0)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* ---------- CYBER SHIELD HEADER ---------- */}
          <div className="text-center space-y-3 relative z-10">
            {/* Top Gateway Pill with Chromatic Border */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-cyan-950/80 via-purple-950/70 to-fuchsia-950/80 border border-cyan-400/50 text-cyan-200 text-[11px] font-mono uppercase tracking-widest shadow-[0_0_18px_rgba(6,182,212,0.35)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span>GLOBAL SECURE GATEWAY // TLS-1.3</span>
            </div>

            {/* Glowing Holographic PICRYPT Logo Emblem */}
            <div className="relative mx-auto w-16 h-16 rounded-2xl p-[2px] bg-gradient-to-tr from-cyan-400 via-fuchsia-500 to-amber-400 shadow-[0_0_30px_rgba(236,72,153,0.45),0_0_18px_rgba(6,182,212,0.6)] group">
              <div className="w-full h-full rounded-[14px] bg-[#07132e]/90 backdrop-blur-md flex items-center justify-center p-2.5 overflow-hidden shadow-inner">
                <img
                  src={picryptLogo}
                  alt="PICRYPT Logo"
                  className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(0,245,255,0.8)] transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Shifting Chromatic Gradient Heading */}
            <motion.h2
              key={`title-${step}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-400 to-purple-300 text-center tracking-tight animate-title-flow drop-shadow-[0_0_25px_rgba(236,72,153,0.45)]"
            >
              {step === 1
                ? "Create Your PICRYPT Account"
                : step === 2
                ? "Verify OTP & Create Password"
                : "All Done !"}
            </motion.h2>

            <p className="text-slate-300 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
              {step === 1 &&
                "Establish your cryptographic identity to access advanced steganographic vaults."}
              {step === 2 &&
                "Enter the verification code sent to your registered communication channel."}
              {step === 3 &&
                "Cryptographic keys established. Your secure account is ready."}
            </p>

            {/* Step Progress Indicators with Glow */}
            <div className="flex items-center justify-center gap-2 pt-1 pb-1">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= 1
                    ? "w-8 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(103,232,249,0.9)]"
                    : "w-2 bg-slate-700"
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= 2
                    ? "w-8 bg-gradient-to-r from-purple-400 to-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.9)]"
                    : "w-2 bg-slate-700"
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step >= 3
                    ? "w-8 bg-gradient-to-r from-emerald-400 to-teal-300 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                    : "w-2 bg-slate-700"
                }`}
              />
            </div>
          </div>

          {/* ---------- ERROR & SUCCESS NOTIFICATIONS ---------- */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                key="error-box"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs font-mono flex items-center gap-2.5 shadow-[0_0_20px_rgba(239,68,68,0.35)]"
              >
                <FaExclamationTriangle className="text-red-400 shrink-0 text-sm" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}

            {message && (
              <motion.div
                key="msg-box"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono flex items-center gap-2.5 shadow-[0_0_20px_rgba(16,185,129,0.35)]"
              >
                <FaCheckCircle className="text-emerald-400 shrink-0 text-sm" />
                <span className="leading-relaxed">{message}</span>
              </motion.div>
            )}

            {alreadyRegisteredMsg && (
              <motion.div
                key="registered-box"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-400/60 text-cyan-200 text-xs font-mono flex items-center gap-2.5 shadow-[0_0_20px_rgba(103,232,249,0.35)]"
              >
                <FaCheckCircle className="text-cyan-400 shrink-0 text-sm" />
                <span className="leading-relaxed">{alreadyRegisteredMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ---------- STEP 1: SEND OTP FORM ---------- */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="relative z-10"
            >
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 mb-1.5">
                    <FaEnvelope className="text-cyan-400 text-[11px]" />
                    <span>Email ID</span>
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400 group-focus-within:text-fuchsia-400 transition-colors">
                      <FaEnvelope className="text-sm drop-shadow-[0_0_6px_rgba(103,232,249,0.5)]" />
                    </div>
                    <input
                      className={`w-full pl-10 pr-4 py-3.5 bg-[#051026]/90 border border-cyan-400/40 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40 transition-all duration-300 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(217,70,239,0.35)] ${
                        loadingSendOTP || redirectingToLogin
                          ? "opacity-60 cursor-not-allowed"
                          : ""
                      }`}
                      type="email"
                      value={email}
                      required
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setAlreadyRegisteredMsg("");
                      }}
                      placeholder="Enter your email"
                      disabled={loadingSendOTP || redirectingToLogin}
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* VIBRANT HIGH-ENERGY CYBER BUTTON */}
                <button
                  type="submit"
                  disabled={
                    loadingSendOTP ||
                    resendCooldown > 0 ||
                    !email ||
                    redirectingToLogin
                  }
                  aria-busy={loadingSendOTP}
                  aria-disabled={
                    loadingSendOTP ||
                    resendCooldown > 0 ||
                    !email ||
                    redirectingToLogin
                  }
                  className={`relative w-full py-4 px-5 rounded-xl font-extrabold uppercase tracking-wider text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-lg ${
                    loadingSendOTP || redirectingToLogin
                      ? "bg-slate-800/80 border border-slate-700/60 text-slate-400 cursor-not-allowed"
                      : resendCooldown > 0
                      ? "bg-gradient-to-r from-cyan-950/80 via-purple-950/80 to-slate-900 border border-cyan-500/40 text-cyan-300"
                      : !email.trim()
                      ? "bg-gradient-to-r from-[#0c1f47]/90 via-[#181a4e]/90 to-[#221338]/90 border border-cyan-400/50 text-cyan-200 hover:border-fuchsia-400 shadow-[0_0_20px_rgba(0,245,255,0.25)] hover:shadow-[0_0_25px_rgba(236,72,153,0.35)] cursor-pointer"
                      : "bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:from-cyan-300 hover:via-purple-400 hover:to-pink-400 text-slate-950 font-black shadow-[0_0_35px_rgba(0,245,255,0.6),0_0_25px_rgba(236,72,153,0.5)] hover:shadow-[0_0_45px_rgba(0,245,255,0.85),0_0_35px_rgba(236,72,153,0.7)] cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
                  }`}
                >
                  {/* Sweeping Light Sheen Animation */}
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 animate-[pulse-sheen_3s_ease-in-out_infinite] pointer-events-none" />

                  {redirectingToLogin ? (
                    <div className="flex items-center justify-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>
                        Redirecting to Sign In
                        {count > 0 ? ` (${count}s)` : ""}...
                      </span>
                    </div>
                  ) : loadingSendOTP ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 animate-spin text-slate-950"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Transmitting Encrypted OTP…</span>
                    </div>
                  ) : resendCooldown > 0 ? (
                    <span>Resend OTP ({resendCooldown}s)</span>
                  ) : (
                    <>
                      <span>Send OTP</span>
                      <FaArrowRight className="text-xs" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign In Link with Gradient Hover */}
              <p className="text-center text-xs sm:text-sm text-slate-400 mt-5">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400 hover:from-cyan-200 hover:to-pink-300 font-semibold underline underline-offset-4 transition-all"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}

          {/* ---------- STEP 2: OTP + PASSWORD FORM ---------- */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 space-y-4"
            >
              {/* Concentric Animated Multi-Color Radar Verification Ring */}
              <div className="relative mx-auto w-16 h-16 flex items-center justify-center my-1">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/50 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-1.5 rounded-full border border-fuchsia-400/60 shadow-[0_0_18px_rgba(236,72,153,0.5)] animate-pulse" />
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-fuchsia-600/30 border border-cyan-300/80 flex items-center justify-center text-cyan-200 shadow-[0_0_15px_rgba(0,245,255,0.6)]">
                  <FaKey className="text-base text-cyan-300" />
                </div>
              </div>

              {/* Target Channel Pill */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-cyan-950/50 via-purple-950/40 to-slate-900/60 border border-cyan-400/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-mono truncate mr-2">
                  Target: <strong className="text-cyan-300">{email}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError("");
                    setMessage("");
                  }}
                  className="text-fuchsia-400 hover:text-fuchsia-200 underline font-mono text-[11px] shrink-0 cursor-pointer"
                >
                  Change
                </button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300">
                      <FaKey className="text-cyan-400 text-[11px]" />
                      <span>Enter OTP</span>
                    </label>

                    {resendCooldown > 0 ? (
                      <span className="text-[11px] font-mono text-slate-400">
                        Resend in {resendCooldown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={loadingSendOTP}
                        className="text-[11px] font-mono text-fuchsia-400 hover:text-fuchsia-300 flex items-center gap-1 cursor-pointer transition"
                      >
                        <FaRedoAlt className="text-[9px]" />
                        <span>Resend OTP</span>
                      </button>
                    )}
                  </div>
                  <input
                    className="w-full px-4 py-3.5 bg-[#051026]/90 border border-cyan-400/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40 text-sm font-mono tracking-widest text-center shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-all duration-200"
                    type="text"
                    value={otp}
                    required
                    onChange={(e) => setOTP(e.target.value)}
                    maxLength={6}
                    placeholder="Enter OTP"
                    autoComplete="one-time-code"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-cyan-300 mb-1.5">
                    <FaLock className="text-cyan-400 text-[11px]" />
                    <span>Create Password</span>
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3.5 pr-10 bg-[#051026]/90 border border-cyan-400/40 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-400/40 text-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)] focus:shadow-[0_0_25px_rgba(217,70,239,0.35)] transition-all duration-200"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                      minLength={8}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-400 p-1 cursor-pointer transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <p className="text-[11px] font-mono text-slate-400 mt-1">
                    Minimum 8 characters with letters, numbers, and symbols.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loadingRegister}
                  className="relative w-full py-4 px-5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 hover:from-emerald-300 hover:via-cyan-300 hover:to-pink-400 text-slate-950 rounded-xl font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_35px_rgba(52,211,153,0.5),0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_45px_rgba(52,211,153,0.75)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 animate-[pulse-sheen_3s_ease-in-out_infinite] pointer-events-none" />
                  {loadingRegister ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="w-4 h-4 animate-spin text-slate-950"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      <span>Verifying Credentials…</span>
                    </div>
                  ) : (
                    <>
                      <span>Register</span>
                      <FaShieldAlt className="text-xs" />
                    </>
                  )}
                </button>
              </form>

              {/* Exact sign-in text preserved */}
              <p className="text-center text-xs sm:text-sm text-slate-400 mt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-fuchsia-400 hover:from-cyan-200 hover:to-pink-300 font-semibold underline underline-offset-4 transition-all"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          )}

          {/* ---------- STEP 3: ANIMATED SUCCESS SCREEN ---------- */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-4 relative z-10"
            >
              {/* Glowing Shield Checkmark Visual with Multi-Color Aura */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 140 }}
                className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500/25 via-teal-600/35 to-fuchsia-600/25 border border-emerald-400/60 flex justify-center items-center shadow-[0_0_35px_rgba(16,185,129,0.5),0_0_20px_rgba(236,72,153,0.3)]"
              >
                <motion.svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#00f5ff"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.35, duration: 0.7 }}
                >
                  <path d="M20 6L9 17l-5-5" />
                </motion.svg>
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300">
                PICRYPT Account Created Successfully
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
                Sign in to encrypt your data inside images and prevent unauthorized access.
              </p>

              <div className="p-3 rounded-xl bg-slate-900/70 border border-cyan-400/30 text-xs font-mono text-slate-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                Redirecting to Sign In page in{" "}
                <span className="font-bold text-cyan-300 text-sm">{count}</span>{" "}
                second{count !== 1 ? "s" : ""}...
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full mt-2 px-6 py-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-fuchsia-500 hover:from-cyan-300 hover:via-purple-400 hover:to-pink-400 text-slate-950 rounded-xl font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_35px_rgba(0,245,255,0.6),0_0_25px_rgba(236,72,153,0.5)] transition-all cursor-pointer hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Sign In Now
              </button>
            </motion.div>
          )}

          {/* ---------- BOTTOM CYBER TELEMETRY BAR ---------- */}
          <div className="pt-2 border-t border-cyan-400/30 flex items-center justify-between text-[10px] font-mono text-cyan-300/80">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              AES-256 GCM ENCRYPTED
            </span>
            <span className="text-fuchsia-300">ZERO-KNOWLEDGE PROTOCOL</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
