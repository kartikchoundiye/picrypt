// frontend/src/modules/Contact.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! 🚀");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    // <div className="min-h-screen w-full mx-auto p-4 md:p-8 bg-gradient-to-r from-cyan-100 to-pink-100 space-y-10 pt-3 sm:pt-24">
    <div className="min-h-screen w-full mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-100 via-white to-slate-200 space-y-10 pt-3 sm:pt-24">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-center text-3xl md:text-4xl font-bold mb-10  bg-gradient-to-r from-cyan-500 via-blue-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
          Contact Us
        </h1>

        {/* ===== DIVIDER ===== */}
        <div className="flex justify-center space-y-2 mb-6">
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "6rem", opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400"
          />
        </div>

        {/* 🔹 Desktop: 2 Columns | Mobile: 1 Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* ---- Left : Contact Form ---- */}
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5 border border-gray-300">
            <p className="text-gray-700 text-lg md:text-xl text-center">
              Have questions about Picrypt or need support? Drop us a message below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg min-h-[130px] focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              />

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg shadow-md transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* ---- Right : Founder Info ---- */}
          <div className="space-y-6">

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                🧠 Vision & Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Picrypt was founded by <strong>Gitesh Jare , Jayesh Dabhade , Kartik Choundiye</strong> to empower users with secure image encryption tools that are simple, private, and delightful to use.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                🛠 Tech Stack & Skills
              </h3>
              <p className="text-gray-700 leading-relaxed">
                The founders are skilled in React, Django , JavaScript, Python and IAM strategy — building apps that are both secure and visually engaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-300">
              <h3 className="text-xl font-semibold text-teal-700 mb-2">
                🌐 Connect with the Founder
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Reach out via GitHub, LinkedIn, Instagram or email to collaborate or ask questions. They love solving problems and exploring ideas with the tech community.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>

  );
};

export default Contact;
