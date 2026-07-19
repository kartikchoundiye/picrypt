// frontend/src/modules/About.jsx

import React from "react";
import { motion } from "framer-motion";
import {
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileCode,
  FaFileAlt,
  FaDatabase,
} from "react-icons/fa";

const About = () => {
  const categories = [
    {
      title: "Image Data",
      icon: <FaFileImage size={32} className="text-blue-500" />,
      extensions: [".png", ".jpeg", ".jpg"],
      gradient: "from-blue-50 to-blue-100 border border-blue-200",
    },
    {
      title: "Video Data",
      icon: <FaFileVideo size={32} className="text-red-500" />,
      extensions: [".mp4", ".mov", ".avi", ".mkv"],
      gradient: "from-red-50 to-red-100 border border-red-200",
    },
    {
      title: "Audio Data",
      icon: <FaFileAudio size={32} className="text-purple-500" />,
      extensions: [".mp3", ".wav", ".ogg", ".wma"],
      gradient: "from-purple-50 to-purple-100 border border-purple-200",
    },
    {
      title: "Program Files",
      icon: <FaFileCode size={32} className="text-green-500" />,
      extensions: [".c", ".java", ".py", ".jsx", ".js"],
      gradient: "from-green-50 to-green-100 border border-green-200",
    },
    {
      title: "Documents",
      icon: <FaFileAlt size={32} className="text-yellow-500" />,
      // extensions: [".doc", ".docx", ".pdf", ".txt", ".pptx", ".xlsx"],
      extensions: [".doc", ".txt", ".xlsx"],
      gradient: "from-yellow-50 to-yellow-100 border border-yellow-200",
    },
    {
      title: "Database / Data Files",
      icon: <FaDatabase size={32} className="text-pink-500" />,
      extensions: [".xml", ".db", ".sql", ".sqlite", ".json"],
      gradient: "from-pink-50 to-pink-100 border border-pink-200",
    },
  ];

  return (
    // <div className="min-h-screen w-full mx-auto p-4 md:p-8 bg-gradient-to-r from-cyan-100 to-pink-100 space-y-10 pt-3 sm:pt-24">
    <div className="min-h-screen w-full mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-100 via-white to-slate-200 space-y-10 pt-3 sm:pt-24">
      <div className="max-w-7xl mx-auto text-center ">
        {/* MOBILE HEADING FIX */}
        <h1
          className="text-3xl sm:text-5xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm mb-4 flex justify-center gap-3"
          // className="text-3xl sm:text-5xl font-bold text-teal-700 mb-4 flex justify-center gap-3"
        >
          <div className="sm:size-[42px] text-blue-500 from-cyan-500 via-blue-500 to-pink-500" />
          About Picrypt
        </h1>

        <p className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed mb-10">
          Picrypt is an AES-256 (Advanced Encryption Standard) based platform that allows users to securely hide different
          types of data inside images using strong cryptographic techniques. Whether it's documents,
          code, or photos — Picrypt ensures your sensitive data remains encrypted and tamper-proof.
        </p>

        {/* ===== DIVIDER ===== */}
        <div className="flex justify-center space-y-2 mb-6">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "6rem", opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400"
          />
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
          🛡 Securely encrypt these types of data inside images:
        </h2>

        {/* MOBILE CARD FIX (2 cards per row on mobile, 3 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 mt-6">
          {categories.map((item, idx) => (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl shadow-md bg-gradient-to-br ${item.gradient}
                transition transform hover:-translate-y-2 hover:shadow-2xl hover:scale-105 cursor-pointer`}
            >
              <div className="flex justify-center mb-2 sm:mb-3">{item.icon}</div>
              <h3 className="text-sm sm:text-xl font-semibold text-gray-800 mb-1">
                {item.title}
              </h3>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-gray-600 text-xs sm:text-sm">
                {item.extensions.map((ext, i) => (
                  <span key={i} className="whitespace-nowrap text-center">
                    {ext}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 sm:mt-16 text-gray-700 italic font-medium text-base sm:text-lg px-4 pb-6">
          🔒 “With Picrypt, privacy is not just a feature — it's a guarantee.”
        </p>
      </div>
    </div>
  );
};

export default About;

