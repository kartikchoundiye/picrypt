// frontend/src/components/CyberTrustCarousel.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import CyberTrustCard from "./CyberTrustCard";

/**
 * PICRYPT — 8-CARD 3D GLASSMORPHISM CAROUSEL
 *
 * All 8 Original Cards Preserved Verbatim:
 * 1. User-Friendly Interface  (🎨) — Easy-to-use UI for all skill levels.
 * 2. Advanced Algorithms      (🧩) — State-of-the-art cryptographic methods.
 * 3. Regular Updates          (🔄) — Continuous improvements and security patches.
 * 4. Privacy Protection       (🔒) — Prevent unauthorized access to your personal images.
 * 5. Secure Sharing           (📤) — Share sensitive visuals confidently, knowing they’re encrypted.
 * 6. High Speed Encryption    (⚡) — Encrypt images quickly without performance lag.
 * 7. Cross-Platform Support   (🌐) — Works on all devices and browsers.
 * 8. Multi-User Support       (👥) — Share encrypted files securely within groups.
 *
 * Timing & Navigation:
 * - Precise 2.0-second cycle (never stays stuck for > 5s).
 * - Smooth 600ms 3D glide transition (leaving 1.4s clear view per card).
 * - Manual Left & Right navigation arrow buttons with cyber glass styling.
 * - Clicking left or right card/button immediately transitions & restarts the 2s timer.
 */

export const TRUST_CARDS_DATA = [
  {
    id: 1,
    title: "User-Friendly Interface",
    description: "Easy-to-use UI for all skill levels.",
    icon: "🎨",
  },
  {
    id: 2,
    title: "Advanced Algorithms",
    description: "State-of-the-art cryptographic methods.",
    icon: "🧩",
  },
  {
    id: 3,
    title: "Regular Updates",
    description: "Continuous improvements and security patches.",
    icon: "🔄",
  },
  {
    id: 4,
    title: "Privacy Protection",
    description: "Prevent unauthorized access to your personal images.",
    icon: "🔒",
  },
  {
    id: 5,
    title: "Secure Sharing",
    description: "Share sensitive visuals confidently, knowing they’re encrypted.",
    icon: "📤",
  },
  {
    id: 6,
    title: "High Speed Encryption",
    description: "Encrypt images quickly without performance lag.",
    icon: "⚡",
  },
  {
    id: 7,
    title: "Cross-Platform Support",
    description: "Works on all devices and browsers.",
    icon: "🌐",
  },
  {
    id: 8,
    title: "Multi-User Support",
    description: "Share encrypted files securely within groups.",
    icon: "👥",
  },
];

const TOTAL_CARDS = TRUST_CARDS_DATA.length; // Exactly 8 cards
const AUTO_PLAY_INTERVAL = 2000; // Strictly 2.0 seconds

export default function CyberTrustCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const timerRef = useRef(null);

  // Responsive breakpoint & reduced-motion listener
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  // Timer starter with automatic advance every 2 seconds
  const startAutoPlayTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!prefersReducedMotion) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % TOTAL_CARDS);
      }, AUTO_PLAY_INTERVAL);
    }
  }, [prefersReducedMotion]);

  // Start timer on mount & cleanup on unmount
  useEffect(() => {
    startAutoPlayTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoPlayTimer]);

  // Manual Previous Slide (moves left & restarts 2s countdown)
  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + TOTAL_CARDS) % TOTAL_CARDS);
    startAutoPlayTimer();
  }, [startAutoPlayTimer]);

  // Manual Next Slide (moves right & restarts 2s countdown)
  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TOTAL_CARDS);
    startAutoPlayTimer();
  }, [startAutoPlayTimer]);

  // Viewport categorization
  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  // Calculate 3D transformation values for each card relative to activeIndex
  const getCardTransform = (index) => {
    // Shortest circular offset (-4 to +4)
    let diff = (index - activeIndex) % TOTAL_CARDS;
    if (diff > 4) diff -= TOTAL_CARDS;
    if (diff < -4) diff += TOTAL_CARDS;

    const isCenter = diff === 0;

    // ─────────────────────────────────────────────────────────────
    // A. MOBILE VIEWPORT (< 768px)
    // 1 Full front-facing card centered (0deg) + subtle visible edges of neighbors
    // ─────────────────────────────────────────────────────────────
    if (isMobile) {
      if (isCenter) {
        return {
          transform: "translateX(0%) scale(1) rotateY(0deg) rotateX(0deg)",
          zIndex: 30,
          opacity: 1,
          filter: "none",
          visibility: "visible",
        };
      }
      if (diff === 1) {
        // Right neighbor
        return {
          transform: "translateX(84%) scale(0.90) rotateY(-4deg)",
          zIndex: 20,
          opacity: 0.68,
          filter: "brightness(0.85) blur(0.3px)",
          visibility: "visible",
        };
      }
      if (diff === -1) {
        // Left neighbor
        return {
          transform: "translateX(-84%) scale(0.90) rotateY(4deg)",
          zIndex: 20,
          opacity: 0.68,
          filter: "brightness(0.85) blur(0.3px)",
          visibility: "visible",
        };
      }
      // Outer cards hidden off-stage
      return {
        transform: `translateX(${diff > 0 ? "130%" : "-130%"}) scale(0.75) rotateY(${diff > 0 ? -6 : 6}deg)`,
        zIndex: 0,
        opacity: 0,
        filter: "none",
        visibility: "hidden",
      };
    }

    // ─────────────────────────────────────────────────────────────
    // B. TABLET VIEWPORT (768px – 1023px)
    // Centered front-facing active card (0deg) + balanced adjacent cards
    // ─────────────────────────────────────────────────────────────
    if (isTablet) {
      if (isCenter) {
        return {
          transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg) rotateX(0deg) translateZ(0px)",
          zIndex: 30,
          opacity: 1,
          filter: "none",
          visibility: "visible",
        };
      }
      if (diff === 1) {
        return {
          transform: "translateX(240px) translateY(0px) scale(0.91) rotateY(-3.5deg) translateZ(-30px)",
          zIndex: 20,
          opacity: 0.85,
          filter: "brightness(0.90)",
          visibility: "visible",
        };
      }
      if (diff === -1) {
        return {
          transform: "translateX(-240px) translateY(0px) scale(0.91) rotateY(3.5deg) translateZ(-30px)",
          zIndex: 20,
          opacity: 0.85,
          filter: "brightness(0.90)",
          visibility: "visible",
        };
      }
      if (diff === 2) {
        return {
          transform: "translateX(430px) translateY(0px) scale(0.83) rotateY(-5.5deg) translateZ(-65px)",
          zIndex: 10,
          opacity: 0.40,
          filter: "brightness(0.75) blur(0.8px)",
          visibility: "visible",
        };
      }
      if (diff === -2) {
        return {
          transform: "translateX(-430px) translateY(0px) scale(0.83) rotateY(5.5deg) translateZ(-65px)",
          zIndex: 10,
          opacity: 0.40,
          filter: "brightness(0.75) blur(0.8px)",
          visibility: "visible",
        };
      }
      return {
        transform: `translateX(${diff > 0 ? "620px" : "-620px"}) scale(0.74) rotateY(${diff > 0 ? -7 : 7}deg) translateZ(-100px)`,
        zIndex: 0,
        opacity: 0,
        filter: "none",
        visibility: "hidden",
      };
    }

    // ─────────────────────────────────────────────────────────────
    // C. DESKTOP VIEWPORT (≥ 1024px)
    // Front-facing active card (0deg) + subtle 3-5deg adjacent & 5-7deg farther
    // ─────────────────────────────────────────────────────────────
    if (isCenter) {
      return {
        transform: "translateX(0px) translateY(0px) scale(1) rotateY(0deg) rotateX(0deg) translateZ(0px)",
        zIndex: 30,
        opacity: 1,
        filter: "none",
        visibility: "visible",
      };
    }
    if (diff === 1) {
      return {
        transform: "translateX(295px) translateY(0px) scale(0.92) rotateY(-4deg) translateZ(-35px)",
        zIndex: 20,
        opacity: 0.88,
        filter: "brightness(0.92)",
        visibility: "visible",
      };
    }
    if (diff === -1) {
      return {
        transform: "translateX(-295px) translateY(0px) scale(0.92) rotateY(4deg) translateZ(-35px)",
        zIndex: 20,
        opacity: 0.88,
        filter: "brightness(0.92)",
        visibility: "visible",
      };
    }
    if (diff === 2) {
      return {
        transform: "translateX(530px) translateY(0px) scale(0.84) rotateY(-6.5deg) translateZ(-75px)",
        zIndex: 10,
        opacity: 0.45,
        filter: "brightness(0.78) blur(0.8px)",
        visibility: "visible",
      };
    }
    if (diff === -2) {
      return {
        transform: "translateX(-530px) translateY(0px) scale(0.84) rotateY(6.5deg) translateZ(-75px)",
        zIndex: 10,
        opacity: 0.45,
        filter: "brightness(0.78) blur(0.8px)",
        visibility: "visible",
      };
    }
    // Outer hidden cards (diff === 3, -3, 4)
    return {
      transform: `translateX(${diff > 0 ? "760px" : "-760px"}) scale(0.75) rotateY(${diff > 0 ? -8 : 8}deg) translateZ(-120px)`,
      zIndex: 0,
      opacity: 0,
      filter: "none",
      visibility: "hidden",
    };
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Why Trust on PICRYPT 3D Glass Cards Carousel"
      className="ctc-carousel-container relative w-full flex flex-col items-center select-none py-2"
    >
      {/* 3D CAROUSEL PERSPECTIVE STAGE */}
      <div
        className="ctc-carousel-stage relative w-full h-[370px] sm:h-[400px] md:h-[420px] flex items-center justify-center overflow-hidden"
        style={{
          perspective: isMobile ? "900px" : "1200px",
          perspectiveOrigin: "center center",
        }}
      >
        {/* MANUAL LEFT ARROW BUTTON */}
        <button
          onClick={prevSlide}
          aria-label="Previous cybersecurity card"
          className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/85 hover:bg-cyan-950/90 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white shadow-[0_0_20px_rgba(0,217,245,0.35)] hover:shadow-[0_0_28px_rgba(0,217,245,0.55)] transition-all transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* MANUAL RIGHT ARROW BUTTON */}
        <button
          onClick={nextSlide}
          aria-label="Next cybersecurity card"
          className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/85 hover:bg-cyan-950/90 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-white shadow-[0_0_20px_rgba(0,217,245,0.35)] hover:shadow-[0_0_28px_rgba(0,217,245,0.55)] transition-all transform hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* ALL 8 3D GLASS CARDS */}
        {TRUST_CARDS_DATA.map((card, idx) => {
          const styles = getCardTransform(idx);
          const isCenter = idx === activeIndex;

          let diff = (idx - activeIndex) % TOTAL_CARDS;
          if (diff > 4) diff -= TOTAL_CARDS;
          if (diff < -4) diff += TOTAL_CARDS;

          return (
            <div
              key={card.id}
              onClick={() => {
                if (diff === -1) prevSlide();
                else if (diff === 1) nextSlide();
              }}
              className={`ctc-carousel-card-slot absolute flex items-center justify-center will-change-transform ${
                diff === 1 || diff === -1 ? "cursor-pointer" : ""
              }`}
              style={{
                transform: styles.transform,
                zIndex: styles.zIndex,
                opacity: styles.opacity,
                filter: styles.filter,
                visibility: styles.visibility,
                pointerEvents: isCenter || diff === 1 || diff === -1 ? "auto" : "none",
                transition: prefersReducedMotion
                  ? "none"
                  : "transform 600ms cubic-bezier(0.25, 1, 0.5, 1), opacity 600ms ease, filter 600ms ease",
              }}
              aria-hidden={!isCenter}
              aria-current={isCenter ? "true" : "false"}
            >
              <CyberTrustCard
                cardId={card.id}
                icon={card.icon}
                title={card.title}
                description={card.description}
                index={idx}
                isCenter={isCenter}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
