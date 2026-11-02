// frontend/src/components/Footer.jsx

import logo from "../assets/picrypt_logo.png";

const footerStyles = `
.cyber-footer {
  position: relative;
  background-color: #070D1A;
  background-image:
    radial-gradient(circle at 18% 30%, rgba(0, 217, 245, 0.08) 0%, transparent 45%),
    radial-gradient(circle at 82% 40%, rgba(144, 101, 245, 0.07) 0%, transparent 45%),
    radial-gradient(circle at 50% 90%, rgba(0, 214, 160, 0.06) 0%, transparent 50%);
  color: #F1F5FF;
  overflow: hidden;
  border-top: 1px solid rgba(0, 217, 245, 0.25);
  box-shadow: 0 -15px 40px rgba(0, 0, 0, 0.7);
}

.footer-top-divider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00D9F5 0%, #398BFF 25%, #9065F5 50%, #ED63CE 75%, #00D6A0 90%, #00D9F5 100%);
  background-size: 200% 100%;
  animation: footerGradientFlow 6s linear infinite;
  box-shadow: 0 0 12px rgba(0, 217, 245, 0.6), 0 0 24px rgba(144, 101, 245, 0.35);
  z-index: 10;
}

@keyframes footerGradientFlow {
  0% { background-position: 0% 0%; }
  100% { background-position: 200% 0%; }
}

.footer-bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.55;
}

.footer-circuit-line {
  stroke-dasharray: 8 8;
  animation: footerCircuitDash 3s linear infinite;
  transition: opacity 0.3s ease;
}

.footer-circuit-line.line-slow {
  stroke-dasharray: 10 10;
  animation: footerCircuitDash 4.5s linear infinite;
}

@keyframes footerCircuitDash {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -32; }
}

.footer-circuit-node {
  animation: footerNodePulse 2.5s ease-in-out infinite alternate;
}

@keyframes footerNodePulse {
  0% { r: 3; opacity: 0.75; }
  100% { r: 4.5; opacity: 1; }
}

.footer-particle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  animation: footerParticleFloat 4s ease-in-out infinite alternate;
}

@keyframes footerParticleFloat {
  0% { transform: translateY(0px) scale(0.9); opacity: 0.35; }
  100% { transform: translateY(-12px) scale(1.15); opacity: 0.75; }
}

.footer-container {
  position: relative;
  z-index: 5;
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 1.5rem 2.5rem;
}

@media (max-width: 640px) {
  .footer-container {
    padding: 2.5rem 1rem 2rem;
  }
}

.footer-logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  filter: drop-shadow(0 0 14px rgba(0, 217, 245, 0.55));
  transition: transform 0.3s ease, filter 0.3s ease;
}

.footer-logo-wrap:hover .footer-logo-img {
  transform: scale(1.08) rotate(3deg);
  filter: drop-shadow(0 0 20px rgba(0, 217, 245, 0.8));
}

.footer-brand-heading {
  background: linear-gradient(90deg, #00D9F5 0%, #398BFF 35%, #9065F5 70%, #ED63CE 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  display: inline-block;
  letter-spacing: -0.02em;
  filter: drop-shadow(0 0 16px rgba(0, 217, 245, 0.35));
}

.footer-nav-link {
  position: relative;
  display: inline-block;
  color: #F1F5FF;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: color 0.25s ease, transform 0.25s ease;
  padding-bottom: 2px;
}

.footer-nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, #00D9F5, #398BFF);
  border-radius: 9999px;
  box-shadow: 0 0 8px #00D9F5;
  transition: width 0.3s ease;
}

.footer-nav-link:hover { color: #00D9F5; transform: translateX(3px); }
.footer-nav-link:hover::after { width: 100%; }

.footer-social-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.125rem;
  background: rgba(13, 23, 41, 0.82);
  border: 1px solid rgba(0, 217, 245, 0.22);
  border-radius: 0.75rem;
  color: #F1F5FF;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.footer-contact-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-contact-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

@media (min-width: 480px) {
  .footer-contact-group { flex-wrap: nowrap; }
}

.footer-social-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
}

.footer-social-btn.gmail { border-color: rgba(234, 67, 53, 0.35); }
.footer-social-btn.gmail:hover {
  border-color: #EA4335;
  color: #FFFFFF;
  transform: translateY(-3px);
  background: rgba(234, 67, 53, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(234, 67, 53, 0.45);
}
.footer-social-btn.gmail:hover .footer-social-icon {
  transform: scale(1.18);
  filter: drop-shadow(0 0 10px rgba(234, 67, 53, 0.75));
}

.footer-social-btn.mobile { border-color: rgba(0, 214, 160, 0.35); }
.footer-social-btn.mobile:hover {
  border-color: #00D6A0;
  color: #FFFFFF;
  transform: translateY(-3px);
  background: rgba(0, 214, 160, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(0, 214, 160, 0.45);
}
.footer-social-btn.mobile:hover .footer-social-icon {
  transform: scale(1.18);
  filter: drop-shadow(0 0 10px rgba(0, 214, 160, 0.75));
}

.footer-social-btn.instagram { border-color: rgba(237, 99, 206, 0.35); }
.footer-social-btn.instagram:hover {
  border-color: #ED63CE;
  color: #FFFFFF;
  transform: translateY(-3px);
  background: rgba(237, 99, 206, 0.12);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px rgba(237, 99, 206, 0.45);
}
.footer-social-btn.instagram:hover .footer-social-icon {
  transform: scale(1.18);
  filter: drop-shadow(0 0 10px rgba(237, 99, 206, 0.75));
}

.footer-bottom {
  position: relative;
  z-index: 5;
  border-top: 1px solid rgba(0, 217, 245, 0.12);
  padding: 1.5rem;
  text-align: center;
  background: rgba(7, 13, 26, 0.7);
}

.footer-bottom-text {
  color: #A9BCD5;
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

@media (prefers-reduced-motion: reduce) {
  .footer-top-divider,
  .footer-circuit-line,
  .footer-particle,
  .footer-logo-wrap:hover .footer-logo-img,
  .footer-social-btn:hover {
    animation: none !important;
    transform: none !important;
  }
}
`;

const GmailIcon = () => (
  <svg viewBox="0 0 48 48" className="footer-social-icon gmail-icon" width="20" height="20" aria-hidden="true">
    <path fill="#4caf50" d="M45 16.2l-5 2.75-5 4.75L35 40h7c1.657 0 3-1.343 3-3V16.2z" />
    <path fill="#1e88e5" d="M3 16.2l3.614 1.71L13 23.7V40H6c-1.657 0-3-1.343-3-3V16.2z" />
    <polygon fill="#e53935" points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17" />
    <path fill="#c62828" d="M3 12.298V16.2l10 7.5V11.2L9.876 8.859C9.132 8.301 8.228 8 7.298 8 4.924 8 3 9.924 3 12.298z" />
    <path fill="#fbc02d" d="M45 12.298V16.2l-10 7.5V11.2l3.124-2.341C38.868 8.301 39.772 8 40.702 8 43.076 8 45 9.924 45 12.298z" />
  </svg>
);

const MobileIcon = () => (
  <svg viewBox="0 0 24 24" className="footer-social-icon phone-icon" width="20" height="20" aria-hidden="true" fill="none">
    <defs>
      <linearGradient id="footerPhoneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00D6A0" />
        <stop offset="100%" stopColor="#00D9F5" />
      </linearGradient>
      <linearGradient id="footerPhoneGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
    </defs>
    <path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke="url(#footerPhoneGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="url(#footerPhoneGlow)"
      fillOpacity="0.25"
    />
    <path d="M14 3.5a6 6 0 0 1 6 6" stroke="#00D9F5" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M14 7a2.5 2.5 0 0 1 2.5 2.5" stroke="#00D6A0" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="footer-social-icon instagram-icon" width="20" height="20" aria-hidden="true" fill="none">
    <defs>
      <radialGradient id="footerIgGrad" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497" />
        <stop offset="10%" stopColor="#fdf497" />
        <stop offset="45%" stopColor="#fd5949" />
        <stop offset="60%" stopColor="#d6249f" />
        <stop offset="90%" stopColor="#285AEB" />
      </radialGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="6" stroke="url(#footerIgGrad)" strokeWidth="2" />
    <circle cx="12" cy="12" r="4.5" stroke="url(#footerIgGrad)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.3" fill="url(#footerIgGrad)" />
  </svg>
);

const PARTICLES = [
  { size: 3, top: "25%", left: "12%", color: "#00D9F5", dur: "4.5s", delay: "0s" },
  { size: 2.5, top: "65%", left: "28%", color: "#398BFF", dur: "5.2s", delay: "1.2s" },
  { size: 3.5, top: "35%", left: "62%", color: "#9065F5", dur: "4.8s", delay: "0.6s" },
  { size: 3, top: "75%", left: "85%", color: "#00D6A0", dur: "5.5s", delay: "1.8s" },
  { size: 2, top: "20%", left: "92%", color: "#ED63CE", dur: "4.2s", delay: "2.4s" },
];

const Footer = () => {
  return (
    <footer className="cyber-footer">
    <style>{footerStyles}</style>
    {/* 1. ANIMATED TOP NEON GRADIENT DIVIDER */}
      <div className="footer-top-divider" aria-hidden="true" />

      {/* 2. SUBTLE CYBER CIRCUIT & AMBIENT SVG BACKDROP */}
      <div className="footer-bg-canvas" aria-hidden="true">
        <svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            {/* Dynamic Multi-Color Cycling Gradient 1 (Left Circuit) */}
            <linearGradient id="footerLineGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D9F5">
                <animate attributeName="stop-color" values="#00D9F5;#398BFF;#9065F5;#ED63CE;#00D9F5" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#398BFF">
                <animate attributeName="stop-color" values="#398BFF;#9065F5;#ED63CE;#00D9F5;#398BFF" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#9065F5">
                <animate attributeName="stop-color" values="#9065F5;#ED63CE;#00D9F5;#398BFF;#9065F5" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            {/* Dynamic Multi-Color Cycling Gradient 2 (Right Circuit) */}
            <linearGradient id="footerLineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00D6A0">
                <animate attributeName="stop-color" values="#00D6A0;#00D9F5;#398BFF;#ED63CE;#00D6A0" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="#00D9F5">
                <animate attributeName="stop-color" values="#00D9F5;#398BFF;#ED63CE;#00D6A0;#00D9F5" dur="6s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#ED63CE">
                <animate attributeName="stop-color" values="#ED63CE;#00D6A0;#00D9F5;#398BFF;#ED63CE" dur="6s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            {/* Continuous Horizontal Fiber Gradient */}
            <linearGradient id="footerLineGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00D9F5" />
              <stop offset="35%" stopColor="#398BFF" />
              <stop offset="70%" stopColor="#9065F5" />
              <stop offset="100%" stopColor="#00D6A0" />
            </linearGradient>

            {/* Neon Glow Filter */}
            <filter id="footerCircuitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Top Circuit Path (Flowing above text) */}
          <path
            d="M 0 45 L 240 45 L 280 80 L 620 80 L 660 45 L 1100 45 L 1140 80 L 1440 80"
            fill="none"
            stroke="url(#footerLineGrad1)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="footer-circuit-line"
            filter="url(#footerCircuitGlow)"
          />
          <circle cx="280" cy="80" r="3.5" fill="#00D9F5" filter="url(#footerCircuitGlow)" className="footer-circuit-node" />
          <circle cx="660" cy="45" r="3.5" fill="#9065F5" filter="url(#footerCircuitGlow)" className="footer-circuit-node" />
          <circle cx="1140" cy="80" r="3.5" fill="#ED63CE" filter="url(#footerCircuitGlow)" className="footer-circuit-node" />

          {/* Bottom Circuit Path (Flowing below text) */}
          <path
            d="M 0 255 L 340 255 L 380 280 L 780 280 L 820 255 L 1200 255 L 1240 280 L 1440 280"
            fill="none"
            stroke="url(#footerLineGrad2)"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="footer-circuit-line line-slow"
            filter="url(#footerCircuitGlow)"
          />
          <circle cx="380" cy="280" r="3.5" fill="#00D6A0" filter="url(#footerCircuitGlow)" className="footer-circuit-node" />
          <circle cx="820" cy="255" r="3.5" fill="#00D9F5" filter="url(#footerCircuitGlow)" className="footer-circuit-node" />
          <circle cx="1240" cy="280" r="3.5" fill="#ED63CE" filter="url(#footerCircuitGlow)" className="footer-circuit-node" />
        </svg>

        {/* Floating Digital Particles */}
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="footer-particle"
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

      {/* 3. MAIN FOOTER CONTENT */}
      <div className="footer-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">

          {/* BRAND & MISSION (Columns 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="footer-logo-wrap flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#0e1b33]/80 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,217,245,0.2)] backdrop-blur-md">
                <img src={logo} alt="PICRYPT Logo" className="footer-logo-img" />
              </div>
              <div>
                <h2 className="footer-brand-heading text-2xl font-extrabold tracking-tight">
                  PICRYPT
                </h2>
                <span className="block text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase drop-shadow-[0_0_6px_rgba(0,217,245,0.4)]">
                  SECURITY PROTOCOL
                </span>
              </div>
            </div>

            <p className="text-white text-sm sm:text-base font-bold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Secure Your Images. Protect Your Information.
            </p>

            <p className="text-[#E2EAF4] text-xs sm:text-sm font-medium leading-relaxed max-w-sm drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Image-Based Encryption & Steganography. Conceal sensitive visual data with state-of-the-art cryptographic algorithms.
            </p>
          </div>

          {/* QUICK LINKS (Columns 6-8) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-300 flex items-center gap-2 drop-shadow-[0_0_6px_rgba(0,217,245,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#00D9F5]" />
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <a href="/" className="footer-nav-link">
                  Home
                </a>
              </li>
              <li>
                <a href="/crypt" className="footer-nav-link">
                  Encrypt/Decrypt
                </a>
              </li>
              <li>
                <a href="/about" className="footer-nav-link">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="footer-nav-link">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* CONTACT & SOCIAL CHANNELS (Columns 9-12) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-widest uppercase text-purple-300 flex items-center gap-2 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 inline-block shadow-[0_0_8px_#A855F7]" />
              Connect With Us
            </h3>
            <div className="footer-contact-links pt-1">
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:picrypt.official@outlook.com"
                  className="footer-social-btn gmail"
                  aria-label="Email PICRYPT"
                  title="picrypt.official@outlook.com"
                >
                  <GmailIcon />
                  <span>Email</span>
                </a>

                <a
                  href="https://www.instagram.com/picrypt.official/"
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social-btn instagram"
                  aria-label="Instagram"
                  title="@picrypt.official"
                >
                  <InstagramIcon />
                  <span>Instagram</span>
                </a>
              </div>

              <div className="footer-contact-group">
                <a
                  href="tel:+919172083556"
                  className="footer-social-btn mobile"
                  aria-label="Call +91 9172083556"
                  title="+91 9172083556"
                >
                  <MobileIcon />
                  <span>+91 9172083556</span>
                </a>

                <a
                  href="tel:+917758079925"
                  className="footer-social-btn mobile"
                  aria-label="Call +91 7758079925"
                  title="+91 7758079925"
                >
                  <MobileIcon />
                  <span>+91 7758079925</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-emerald-400 pt-2 font-mono font-semibold tracking-wider flex items-center gap-2 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10B981]" />
              STATUS: ENCRYPT. HIDE. PROTECT.
            </p>
          </div>

        </div>
      </div>

      {/* 4. COPYRIGHT SECTION */}
      <div className="footer-bottom">
        <p className="footer-bottom-text">
          © {new Date().getFullYear()} Picrypt. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
