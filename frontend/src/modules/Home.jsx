// frontend/src/modules/Home.jsx

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import gsap from "gsap";
import picryptVideo from "../assets/PICRYPT.mp4";
import encryptionAnimation from "../assets/encryption-animation.json";

// import '../swiper-fix.css';

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

// TechCard component for encryption tech section
function TechCard({ icon, title, description }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      onClick={() => setExpanded(!expanded)}
      className="cursor-pointer bg-gradient-to-t from-blue-50 via-white to-blue-100 p-6 rounded-xl shadow-md max-w-xs mx-auto text-center select-none"
      whileHover={{ y: -8, boxShadow: "0 8px 20px rgba(0,0,0,0.12)", scale: 1.04 }}
      layout
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <motion.p
        initial={false}
        animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden text-gray-700"
      >
        {description}
      </motion.p>
      {!expanded && (
        <p className="text-blue-600 mt-2 font-semibold">Tap to read more</p>
      )}
    </motion.div>
  );
}

export function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [readyToPlay, setReadyToPlay] = useState(false);
  const controls = useAnimation();
  const heroRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    setVideoEnded(false);
    setReadyToPlay(false);
  }, []);

  useEffect(() => {
    if (videoEnded) controls.start("visible");
  }, [videoEnded, controls]);

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

  useEffect(() => {
    if (readyToPlay && videoRef.current) videoRef.current.play();
  }, [readyToPlay]);

  return (
    <div className="w-full bg-gray-100">
      {/* VIDEO SECTION */}
      <AnimatePresence>
        {!videoEnded && (
          <motion.div
            key="intro-video"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="flex justify-center items-start z-10"
            style={{
              width: "100vw",
              background: "#000",
              overflow: "hidden",
              position: "relative",
              height: "auto",
            }}
          >
            {!readyToPlay ? (
              <>
                <video
                  src={picryptVideo}
                  autoPlay
                  controls={false}
                  muted
                  playsInline
                  onEnded={() => setVideoEnded(true)}
                  className="block w-full h-[calc(100vh-80px)] object-cover md:h-[calc(100vh-80px)] md:w-full mobile-video"
                  style={{ maxHeight: "700px", minHeight: "260px", minWidth: "100vw" }}
                />
                <style>{`
                  @media (max-width: 768px) {
                    .mobile-video {
                      width: 90vw !important;
                      height: auto !important;
                      margin: 12px auto !important;
                      border-radius: 12px;
                      object-fit: contain !important;
                    }
                  }
                `}</style>
              </>
            ) : (
              <video
                ref={videoRef}
                src={picryptVideo}
                controls={false}
                autoPlay
                muted={false}
                playsInline
                onEnded={() => setVideoEnded(true)}
                className="block w-full h-[calc(100vh-80px)] object-cover md:h-[calc(100vh-80px)] md:w-full mobile-video"
                style={{ maxHeight: "700px", minHeight: "260px", minWidth: "100vw" }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO & LOTTIE (after video) */}
      <AnimatePresence>
        {videoEnded && (
          <motion.section
            key="hero-lottie-content"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.8 }}
            className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-12 pt-16 px-6 md:px-16"
            style={{ minHeight: "500px" }}
          >
            <div className="flex-1 flex justify-center md:justify-end items-center w-full order-1 md:order-2">
              <Lottie animationData={encryptionAnimation} loop={true} className="w-full max-w-md h-auto" />
            </div>
            <div className="flex-1 flex flex-col justify-center md:justify-start items-start text-left order-2 md:order-1">
              <h1 ref={heroRef} className="text-3xl md:text-5xl font-extrabold mb-6 text-gray-900 drop-shadow leading-[1.1]">
                Safeguard Your Memories, Secure Your Communication
              </h1>
              <p className="text-gray-700 mb-8 leading-relaxed text-lg max-w-xl">
                Take control of your digital privacy with PICRYPT — the effortless image encryption tool designed to protect what matters most.
              </p>
              <button className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-teal-700 transition-all">
                Encrypt Your First Image
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* WHY TRUST ON PICRYPT - Swiper Multiple Blocks */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-8 text-gray-900">
          Why Trust on PICRYPT
        </h2>

        {/* ===== DIVIDER ===== */}
        <div className="flex justify-center space-y-2 mb-8">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "6rem", opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400"
          />
        </div>
        
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 5 }
          }}
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          style={{ paddingBottom: 40 }}
        >
          {features.map((feature, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col items-center bg-gradient-to-t from-blue-50 via-white to-blue-100 p-8 rounded-xl shadow-md max-w-xs mx-auto text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* ENCRYPTION TECHNOLOGY BEHIND PICRYPT */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <h2 className="text-center text-3xl md:text-4xl font-bold mb-12 text-gray-900">
          Encryption Technology Behind PICRYPT
        </h2>

        {/* ===== DIVIDER ===== */}
        <div className="flex justify-center space-y-2 mb-8">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "6rem", opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {encryptionTechCards.map((card, idx) => (
            <TechCard
              key={idx}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center w-full">
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          onClick={() => { }}
          className=" bottom-10  mx-auto bg-teal-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow hover:bg-teal-700 transition-all"
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
