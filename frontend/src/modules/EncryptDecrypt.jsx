// frontend/src/modules/EncryptDecrypt.jsx
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import EncryptForm from "../components/EncryptForm";
import DecryptForm from "../components/DecryptForm";

export default function EncryptDecrypt() {
  const [mobileTab, setMobileTab] = useState("encrypt");

  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-gradient-to-br from-slate-100 via-white to-slate-200 space-y-7">

      {/* ===== HEADER ===== */}
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
        >
          <span
            className="bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm"
          >
            PICRYPT
          </span>
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base sm:text-lg font-medium text-gray-800"
        >
          Image-Based Encryption & Decryption
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto"
        >
          Protect your data by hiding it securely inside images
        </motion.p>
      </div>

      {/* ===== DIVIDER ===== */}
      <div className="flex justify-center ">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400"
        />
      </div>

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-2 gap-6">
        <EncryptForm />
        <DecryptForm />
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-6">

        {/* ===== MOBILE TOGGLE ===== */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl border bg-white shadow-sm overflow-hidden">
            <button
              onClick={() => setMobileTab("encrypt")}
              className={`px-6 py-2 text-sm font-semibold transition-all duration-200 
                ${mobileTab === "encrypt"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-inner scale-105"
                  : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Encryption
            </button>

            <button
              onClick={() => setMobileTab("decrypt")}
              className={`px-6 py-2 text-sm font-semibold transition-all duration-200 
                ${mobileTab === "decrypt"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-inner scale-105"
                  : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              Decryption
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {mobileTab === "encrypt" && (
            <motion.div
              key="encrypt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <EncryptForm isMobileActive={mobileTab === "encrypt"} />
            </motion.div>
          )}

          {mobileTab === "decrypt" && (
            <motion.div
              key="decrypt"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <DecryptForm isMobileActive={mobileTab === "decrypt"} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

