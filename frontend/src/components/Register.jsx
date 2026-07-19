// frontend/src/components/Register.jsx

import React , { useState , useEffect , useRef  } from "react";
import { Link , useNavigate} from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// const API_BASE = "http://localhost:8000/api/auth";

const API_BASE = (() => {
  if (window.location.hostname === "localhost") return "http://localhost:8000/api/auth";
  // if (window.location.hostname.startsWith("192.168.")) return `http://${window.location.hostname}:8000/api/auth`;
  if (window.location.hostname.startsWith("192.168.")) return `http://192.168.43.38:8000/api/auth`;
  // TODO: replace with actual backend domain after deployment
  return "https://your-production-backend.com/api/auth";
})();

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loadingSendOTP, setLoadingSendOTP] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);              // seconds left until resend allowed
  const [alreadyRegisteredMsg, setAlreadyRegisteredMsg] = useState("");
  const [redirectingToLogin, setRedirectingToLogin] = useState(false);
  const [count, setCount] = useState(15);       // Redirecting seconds left after registration successful 

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

  const handleSendOTP = async (e) => {
  e.preventDefault();

  // Prevent sending if already loading or in cooldown
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
      setMessage("OTP sent to your email!");
      setError("");
    } else {
      setError("Failed to send OTP. Try again later.");
      setMessage("");
      return;
    }

    // start cooldown for resending (e.g., 30 seconds)
    const COOLDOWN_SECONDS = 30; // change this value as you like
    setResendCooldown(COOLDOWN_SECONDS);
    
    // clear any existing cooldown timer just in case
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

  } catch (err) {
      console.error("send-otp error:", err.response?.data || err.message);
      console.error(
        "send-otp error:",
        err.response?.status,
        err.response?.data,
        err.message
      );

      // read backend error text (your backend uses key "error")
      const backendError = String(err.response?.data?.error || "").toLowerCase();

      // If backend says already registered -> redirect user to login
      if (backendError.includes("already") || backendError.includes("registered") || backendError.includes("exists")) {
        setError("");
        setMessage("");
        setAlreadyRegisteredMsg("You already have a PICRYPT account");
        setRedirectingToLogin(true);

        // disable send/cooldown ui while redirecting
        const REDIRECT_MS = 5000;
        if (redirectTimerRef.current) clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = setTimeout(() => {
          navigate("/login");
        }, REDIRECT_MS);

        // optional: show a small countdown on the button or message — we show it via countdownRedirectRef
        let remaining = Math.ceil(REDIRECT_MS / 1000);

        // clear existing countdown if any
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
        setError("Failed to send OTP. Try again later.");
        setMessage("");
      }
    } finally {
      setLoadingSendOTP(false);
    }
  };

  const handleRegister = async (e) => {
      e.preventDefault();
      try {
        await axios.post(`${API_BASE}/register/`, { email, otp, password });
        setStep(3);
        setError("");
        setMessage("");
        // setCount(15);
      } catch (err) {
        console.error("register error:", err.response?.data || err.message);
        setError("OTP or password error. Try again.");
        setMessage("");
      }
    };

  return (
    <div className="flex justify-center items-start min-h-screen pt-20 bg-gray-50">    
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-xl rounded-xl border border-gray-200">

        {/* ---------- STEP HEADINGS ---------- */}

        <h2 className="text-2xl font-bold text-teal-600 text-center mb-4">
          {step === 1 ? "Create Your PICRYPT Account" : step === 2 ? "Verify OTP & Create Password" : "All Done !"}
        </h2>
        
        {/* ---------- ERROR & MESSAGES ---------- */}

        {error && <p className="text-center mb-2 text-red-600">{error}</p>}
        {message && <p className="text-center mb-2 text-green-600">{message}</p>}

        {/* ---------- STEP 1: SEND OTP FORM ---------- */}

        {step === 1 && (
          <div>

            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700"> Email ID </label>
                <input
                  className={`mt-1 w-full px-4 py-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500 ${loadingSendOTP || redirectingToLogin ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                  type="email"
                  value={email}
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setAlreadyRegisteredMsg("");   // reset special message when user edits email
                  }}
                  placeholder="Enter your email"
                  disabled={loadingSendOTP || redirectingToLogin}
                />
              </div>

              {alreadyRegisteredMsg && (
                <p className="text-center text-green-600 font-medium -mt-1">
                  {alreadyRegisteredMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loadingSendOTP || resendCooldown > 0 || !email || redirectingToLogin}
                aria-busy={loadingSendOTP}
                aria-disabled={loadingSendOTP || resendCooldown > 0 || !email || redirectingToLogin}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition
                  ${loadingSendOTP || resendCooldown > 0 || !email || redirectingToLogin ? "bg-gray-400 cursor-not-allowed text-gray-800" : "bg-teal-600 hover:bg-teal-700 text-white"}`}
              >
                {redirectingToLogin ? (
                  // Show redirect text and countdown
                  <div className="flex items-center justify-center space-x-2">
                    <span>Redirecting to Sign In{count > 0 ? ` (${count}s)` : ""}...</span>
                  </div>
                ) : loadingSendOTP ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span>Sending…</span>
                  </div>
                ) : resendCooldown > 0 ? (
                  <span>Resend OTP ({resendCooldown}s)</span>
                ) : (
                  <span>Send OTP</span>
                )}
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-3">
              Already have an account ? <Link to="/login" className="text-teal-600 font-medium">Sign in</Link>
            </p>
          </div>
        )}


        {/* ---------- STEP 2: OTP + PASSWORD FORM ---------- */}

        {step === 2 && (
          <div>
            <form onSubmit={handleRegister} className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Enter OTP </label>
              <input
                className="w-full px-4 py-2 border rounded focus:ring-teal-400"
                type="text"
                value={otp}
                required
                onChange={e => setOTP(e.target.value)}
                maxLength={6}
                placeholder="Enter OTP"
              />

              <label className="block text-sm font-medium text-gray-700">Create Password </label>
              <input
                className="w-full px-4 py-2 border rounded focus:ring-teal-400"
                type="password"
                value={password}
                required
                minLength={8}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
              />
              <button type="submit" className="w-full py-2 bg-teal-500 hover:bg-teal-600 text-white rounded font-semibold transition">
                Register
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-3">
              Already have an account ? <Link to="/login" className="text-teal-600 font-medium">Sign in</Link>
            </p>
        </div>
          
        )}


        {/* ---------- STEP 3: ANIMATED SUCCESS SCREEN ---------- */}
        
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            {/* teal circular check */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              className="mx-auto h-20 w-20 rounded-full bg-teal-600 flex justify-center items-center shadow-md"
            >
              <motion.svg
                xmlns="http://www.w3.org/2000/svg"
                width="55"
                height="55"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <path d="M20 6L9 17l-5-5" />
              </motion.svg>
            </motion.div>

            <h2 className="text-3xl font-extrabold text-teal-700">
              PICRYPT Account Created Successfully
            </h2>

            <p className="text-gray-700 text-lg">
              Sign in to encrypt your data inside images and prevent unauthorized access.
            </p>

            <p className="text-sm text-gray-500 mt-3">
              Redirecting to Sign In page in{" "}
              <span className="font-bold">{count}</span>{" "}
              second{count !== 1 ? "s" : ""}...
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-4 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold shadow transition"
            >
              Sign In Now
            </button>
          </motion.div>
        )}
      </div>


      {/* TEMPORARY TEST BUTTON — REMOVE BEFORE PRODUCTION */}
      {/* <button
        onClick={() => {
          setCount(60);   // Set countdown to 60 only for test
          setStep(3);     // Switch to success screen
        }}
        className="absolute bottom-10 mx-auto px-4 py-2 bg-gray-200 text-gray-700 rounded-md shadow"
      >
        Test Success Screen
      </button> */}


    </div>
  );
}
