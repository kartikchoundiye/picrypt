// frontend/src/modules/Home.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion } from "framer-motion";
import { useLottie } from "lottie-react";
import gsap from "gsap";
import encryptionAnimation from "../assets/encryption-animation.json";
import CyberLockIllustration from "../components/CyberLockIllustration";
import CyberTrustCarousel from "../components/CyberTrustCarousel";
import CyberTechCard from "../components/CyberTechCard";

// Wrapper component using useLottie hook — avoids CJS/ESM default-export interop issue
function LottieView({ animationData, className }) {
  const { View } = useLottie({ animationData, loop: true, autoplay: true });
  return <div className={className}>{View}</div>;
}

const features = [
  { title: "Privacy Protection", description: "Prevent unauthorized access to your personal images.", icon: "🔒" },
  { title: "Secure Sharing", description: "Share sensitive visuals confidently, knowing they’re encrypted.", icon: "📤" },
  { title: "High Speed Encryption", description: "Encrypt images quickly without performance lag.", icon: "⚡" },
  { title: "Cross-Platform Support", description: "Works on all devices and browsers.", icon: "🌐" },
  { title: "Multi-User Support", description: "Share encrypted files securely within groups.", icon: "👥" },
  { title: "User-Friendly Interface", description: "Easy-to-use UI for all skill levels.", icon: "🎨" },
  { title: "Advanced Algorithms", description: "State-of-the-art cryptographic methods.", icon: "🧩" },
  { title: "Regular Updates", description: "Continuous improvements and security patches.", icon: "🔄" },
];

// New encryption technology cards data
const encryptionTechCards = [
  {
    title: "AES-256 Encryption",
    description: "We employ the Advanced Encryption Standard with 256-bit keys, one of the most robust encryption methods trusted worldwide by governments and financial institutions.",
    icon: "🔒",
  },
  {
    title: "End-to-End Encryption",
    description: "Your data is encrypted on your device before transmission, ensuring that only you and your intended recipients can access the content.",
    icon: "🔑",
  },
  {
    title: "Zero-Knowledge Architecture",
    description: "We never store or have access to your encryption keys, guaranteeing that your images stay confidential even from us.",
    icon: "❌",
  },
  {
    title: "Multi-Layer Security",
    description: "Combining symmetric and asymmetric encryption techniques adds multiple protective layers against unauthorized access and tampering.",
    icon: "🛡️",
  },
  {
    title: "Future-Proof Protocols",
    description: "PICRYPT adopts modern cryptographic protocols that are resilient against emerging threats, including quantum computing.",
    icon: "🔮",
  },
  {
    title: "Secure Key Management",
    description: "Encryption keys are created and managed securely with industry best practices to prevent leakage or compromise.",
    icon: "🔐",
  },
];

export function Home() {
  const navigate = useNavigate();
  const heroRef = useRef(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { scale: 0.96, opacity: 0.85 },
        {
          scale: 1.06,
          opacity: 1,
          repeat: -1,
          yoyo: true,
          duration: 4,
          ease: "sine.inOut",
        }
      );
    }
  }, []);

  return (
    <div className="w-full bg-gray-100">
      {/* HERO & LOTTIE */}
      <motion.section
            key="hero-lottie-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 pt-12 md:pt-20 pb-10 px-6 md:px-12"
            style={{ minHeight: "540px" }}
          >
            <div className="flex-1 flex justify-center md:justify-end items-center w-full order-1 md:order-2 md:pl-6 lg:pl-10">
              <CyberLockIllustration animationData={encryptionAnimation} />
            </div>
            <div className="flex-1 flex flex-col justify-center items-start text-left order-2 md:order-1 pt-2 md:pt-6">
              {/* Security Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium mb-5 shadow-[0_0_14px_rgba(6,182,212,0.25)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                Next-Gen Image Steganography & AES-256 Vault
              </div>

              {/* Main Headline */}
              <h1 ref={heroRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white drop-shadow-sm leading-[1.15] tracking-tight">
                Hide Your Message.{" "}
                <span className="bg-linear-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">
                  Encrypt Your Image.
                </span>{" "}
                Own Your Privacy.
              </h1>

              {/* Supporting Subtext */}
              <p className="text-slate-300 mb-8 leading-relaxed text-base sm:text-lg max-w-xl font-normal">
                Go beyond ordinary image security with PICRYPT. Encrypt images and conceal secret messages inside them to help keep your private information protected.
              </p>

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                <button
                  onClick={() => navigate("/crypt")}
                  className="group inline-flex items-center gap-2.5 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.35)] hover:shadow-[0_0_30px_rgba(6,182,212,0.55)] transition-all transform hover:-translate-y-0.5 cursor-pointer text-base"
                >
                  <span>Protect Your Image</span>
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>

              {/* Trust & Connectivity Highlights */}
              <div className="mt-8 pt-6 border-t border-cyan-500/15 w-full flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">✓</span> Zero-Knowledge
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-teal-400 font-bold">✓</span> Client-Side Privacy
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400 font-bold">✓</span> Lossless Stego Recovery
                </div>
              </div>
            </div>
          </motion.section>

      {/* WHY TRUST ON PICRYPT - Swiper Multiple Blocks */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="ctc-heading-wrapper">
            <h2 className="ctc-neon-heading text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Why Trust on PICRYPT
            </h2>
            <div className="ctc-heading-beam" aria-hidden="true" />
          </div>

          {/* ===== ANIMATED NEON UNDERLINE ===== */}
          <div className="flex justify-center mt-3">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="ctc-neon-underline"
            />
          </div>
        </motion.div>

        <CyberTrustCarousel />
      </section>

      {/* ENCRYPTION TECHNOLOGY BEHIND PICRYPT */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div className="ctc-heading-wrapper">
            <h2 className="ctc-neon-heading text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Encryption Technology Behind PICRYPT
            </h2>
            <div className="ctc-heading-beam" aria-hidden="true" />
          </div>

          {/* ===== ANIMATED NEON UNDERLINE ===== */}
          <div className="flex justify-center mt-3">
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="ctc-neon-underline"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto w-full items-stretch">
          {encryptionTechCards.map((card, idx) => (
            <CyberTechCard
              key={idx}
              idx={idx}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center w-full py-12">
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => navigate("/crypt")}
          className="mx-auto bg-teal-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow hover:bg-teal-700 transition-all cursor-pointer"
        >
          Get Started Now
        </motion.button>
      </section>
    </div>
  );
}

export default Home;




// const features = [
//   // Expanded example features list for virtualization demo
//   { title: "Privacy Protection", description: "Prevent unauthorized access to your personal images.", icon: "🔒" },
//   { title: "Data Integrity", description: "Guard your visual data against tampering or unauthorized copying.", icon: "🛡️" },
//   { title: "Secure Sharing", description: "Share sensitive visuals confidently, knowing they’re encrypted.", icon: "📤" },
//   { title: "High Speed Encryption", description: "Encrypt images quickly without performance lag.", icon: "⚡" },
//   { title: "User-Friendly Interface", description: "Easy-to-use UI for all skill levels.", icon: "🎨" },
//   { title: "Cross-Platform Support", description: "Works on all devices and browsers.", icon: "🌐" },
//   { title: "Strong Password Options", description: "Multiple options to secure your encryption keys.", icon: "🔑" },
//   { title: "Secure File Storage", description: "Encrypted images safely stored in the cloud.", icon: "☁️" },
//   { title: "Real-Time Processing", description: "Immediate encryption and decryption feedback.", icon: "⏱️" },
//   { title: "Advanced Algorithms", description: "State-of-the-art cryptographic methods.", icon: "🧩" },
//   { title: "Open Source", description: "Transparent and community-vetted code.", icon: "💻" },
//   { title: "Regular Updates", description: "Continuous improvements and security patches.", icon: "🔄" },
//   { title: "24/7 Customer Support", description: "Always here to help you secure your images.", icon: "🛎️" },
//   { title: "Multi-Layer Security", description: "Enhanced security with multiple encryption layers.", icon: "🛡️" },
//   { title: "Offline Mode", description: "Encrypt images without need for internet.", icon: "📴" },
//   { title: "Customizable Settings", description: "Fine-tune your encryption preferences.", icon: "⚙️" },
//   { title: "Automatic Backups", description: "Never lose your encrypted files.", icon: "📦" },
//   { title: "Audit and Logs", description: "Track encryption activities securely.", icon: "📋" },
//   { title: "Integration APIs", description: "Easily integrate PICRYPT with other apps.", icon: "🔗" },
//   { title: "Multi-User Support", description: "Share encrypted files securely within groups.", icon: "👥" },
// ];


// const features = [
//   { title: "Privacy Protection", description: "Prevent unauthorized access to your personal images.", icon: "🔒" },
//   { title: "Secure Sharing", description: "Share sensitive visuals confidently, knowing they’re encrypted.", icon: "📤" },
//   { title: "Multi-Layer Security", description: "Enhanced security with multiple encryption layers.", icon: "🛡️" },
//   { title: "High Speed Encryption", description: "Encrypt images quickly without performance lag.", icon: "⚡" },
//   { title: "Cross-Platform Support", description: "Works on all devices and browsers.", icon: "🌐" },
//   { title: "Multi-User Support", description: "Share encrypted files securely within groups.", icon: "👥" },
//   { title: "User-Friendly Interface", description: "Easy-to-use UI for all skill levels.", icon: "🎨" },
//   { title: "Advanced Algorithms", description: "State-of-the-art cryptographic methods.", icon: "🧩" },
//   { title: "Regular Updates", description: "Continuous improvements and security patches.", icon: "🔄" },
// ];
