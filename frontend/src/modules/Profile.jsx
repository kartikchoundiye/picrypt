// frontend/src/modules/Profile.jsx

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { ENDPOINTS } from "../utils/api";
import {
  FaShieldAlt,
  FaUserShield,
  FaKey,
  FaEnvelope,
  FaPhoneAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCamera,
  FaSignOutAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCalendarAlt,
  FaClock,
  FaHistory,
  FaUserEdit,
  FaCheck,
  FaTimes,
} from "react-icons/fa";

export default function Profile({ defaultTab = "overview" }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState(defaultTab);

  // Initialize profile with cached localStorage credentials so UI never shows a blank error screen
  const getInitialProfile = () => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        const name = u.username || u.email || "User";
        const mail = u.email || (name.includes("@") ? name : "");
        return {
          username: name,
          email: mail,
          contact_number: "",
          phone_verified: false,
          avatar: null,
          account_created_at: null,
          password_updated_at: null,
          is_active: true,
          email_verified: !!mail,
        };
      }
    } catch (_e) {
      // ignore
    }
    return null;
  };

  // User Profile State
  const [profile, setProfile] = useState(getInitialProfile);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  // Edit Personal Information State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editUsername, setEditUsername] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) return JSON.parse(stored).username || "";
    } catch (_e) {
      // ignore
    }
    return "";
  });
  const [editPhone, setEditPhone] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoMessage, setInfoMessage] = useState({ type: "", text: "" });

  // Avatar Upload State
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef(null);

  // Email Change with OTP State
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState(1); // 1: Input email, 2: Enter OTP
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownTimerRef = useRef(null);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });

  // Audit Logs State (from History)
  const [historyLogs, setHistoryLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Get Auth Token
  const getAccessToken = () =>
    localStorage.getItem("access_token") || localStorage.getItem("token");

  // Fetch Profile on Load
  const fetchProfile = async () => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    setPageError("");

    try {
      const res = await axios.get(ENDPOINTS.PROFILE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
      setEditUsername(res.data.username || "");
      setEditPhone(res.data.contact_number || "");
    } catch (err) {
      console.error("Error fetching profile:", err);

      // Handle 401 Unauthorized with automatic silent token refresh
      if (err.response?.status === 401) {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          try {
            const refreshRes = await axios.post(`${ENDPOINTS.AUTH}/token/refresh/`, {
              refresh: refreshToken,
            });
            if (refreshRes.data?.access) {
              const newAccess = refreshRes.data.access;
              localStorage.setItem("access_token", newAccess);
              const retryRes = await axios.get(ENDPOINTS.PROFILE, {
                headers: { Authorization: `Bearer ${newAccess}` },
              });
              setProfile(retryRes.data);
              setEditUsername(retryRes.data.username || "");
              setEditPhone(retryRes.data.contact_number || "");
              setLoading(false);
              return;
            }
          } catch (refreshErr) {
            console.error("Token refresh failed:", refreshErr);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            navigate("/login");
            return;
          }
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user");
          navigate("/login");
          return;
        }
      }

      // Actionable error diagnostics
      if (err.response?.status === 404) {
        setPageError(
          "Backend endpoint '/api/auth/profile/' returned 404 Not Found. If using Render, please push the latest backend code to GitHub so Render can deploy. If testing locally, make sure your Django server is running at http://127.0.0.1:8000."
        );
      } else if (!err.response) {
        setPageError(
          "Cannot reach backend server. If testing locally, start Django using 'python manage.py runserver'. If hosted on Render, the server may take ~30 seconds to wake from sleep."
        );
      } else {
        setPageError(
          err.response?.data?.detail || err.response?.data?.error || "Failed to load account profile."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch Activity History Logs
  const fetchHistory = async () => {
    const token = getAccessToken();
    if (!token) return;
    setLogsLoading(true);
    try {
      const res = await axios.get(ENDPOINTS.HISTORY, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistoryLogs(res.data || []);
    } catch (err) {
      console.error("Error loading history logs:", err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Clean up cooldown timer
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  // Handle Tab Switch from URL or Props
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    } else if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [location.state, defaultTab]);

  // Handle Personal Info Update (Username & Phone)
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;

    setInfoSaving(true);
    setInfoMessage({ type: "", text: "" });

    try {
      const res = await axios.put(
        ENDPOINTS.PROFILE,
        {
          username: editUsername,
          contact_number: editPhone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProfile(res.data.profile);
      setIsEditingInfo(false);
      setInfoMessage({
        type: "success",
        text: res.data.message || "Account information updated successfully.",
      });

      // Update localStorage username so Navbar updates
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.username = res.data.profile.username;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (_e) {
        // ignore json parse errors
      }
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to update profile information.";
      setInfoMessage({ type: "error", text: msg });
    } finally {
      setInfoSaving(false);
    }
  };

  // Handle Avatar Image File Upload
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = getAccessToken();
    if (!token) return;

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.put(ENDPOINTS.PROFILE, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data.profile);
      setInfoMessage({
        type: "success",
        text: "Profile avatar updated successfully.",
      });
    } catch (err) {
      const msg =
        err.response?.data?.error || "Failed to upload avatar image.";
      setInfoMessage({ type: "error", text: msg });
    } finally {
      setAvatarUploading(false);
    }
  };

  // Start Resend OTP Cooldown
  const startCooldown = (seconds = 30) => {
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

  // Send Email Change OTP
  const handleSendEmailOtp = async (e) => {
    if (e) e.preventDefault();
    const token = getAccessToken();
    if (!token) return;

    setEmailLoading(true);
    setEmailError("");
    setEmailSuccess("");

    try {
      const res = await axios.post(
        ENDPOINTS.EMAIL_CHANGE_OTP,
        { new_email: newEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEmailSuccess(res.data.message || "Verification code sent to your email.");
      setEmailStep(2);
      startCooldown(30);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to send email verification code.";
      setEmailError(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  // Verify Email Change OTP
  const handleVerifyEmailOtp = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;

    setEmailLoading(true);
    setEmailError("");

    try {
      const res = await axios.post(
        ENDPOINTS.EMAIL_CHANGE_VERIFY,
        {
          new_email: newEmail,
          otp: emailOtp,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update profile in state
      setProfile((prev) => ({
        ...prev,
        email: res.data.email,
        username: res.data.username,
      }));

      // Update localStorage user
      try {
        const u = JSON.parse(localStorage.getItem("user") || "{}");
        u.email = res.data.email;
        u.username = res.data.username;
        localStorage.setItem("user", JSON.stringify(u));
      } catch (_e) {
        // ignore
      }

      setEmailSuccess("Email address verified and updated successfully!");
      setTimeout(() => {
        setShowEmailModal(false);
        setEmailStep(1);
        setNewEmail("");
        setEmailOtp("");
        setEmailSuccess("");
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to verify OTP code.";
      setEmailError(msg);
    } finally {
      setEmailLoading(false);
    }
  };

  // Calculate Password Strength
  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: "Empty", color: "#64748B" };
    let score = 0;
    if (pwd.length >= 8) score += 20;
    if (pwd.length >= 12) score += 10;
    if (/[A-Z]/.test(pwd)) score += 20;
    if (/[a-z]/.test(pwd)) score += 20;
    if (/[0-9]/.test(pwd)) score += 15;
    if (/[\W_]/.test(pwd)) score += 15;

    if (score < 40) return { score, label: "Weak", color: "#EF4444" };
    if (score < 70) return { score, label: "Moderate", color: "#F59E0B" };
    if (score < 90) return { score, label: "Strong", color: "#00D9F5" };
    return { score: 100, label: "Military-Grade", color: "#00D6A0" };
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = getAccessToken();
    if (!token) return;

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    if (passwordStrength.score < 60) {
      setPasswordMessage({
        type: "error",
        text: "Please choose a stronger password meeting all security requirements.",
      });
      return;
    }

    setPasswordLoading(true);
    setPasswordMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        ENDPOINTS.CHANGE_PASSWORD,
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPasswordMessage({
        type: "success",
        text: res.data.message || "Password changed successfully.",
      });

      // Clear password inputs
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Refresh profile to update password timestamp
      fetchProfile();
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.detail ||
        "Failed to update password.";
      setPasswordMessage({ type: "error", text: msg });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    const token = getAccessToken();

    try {
      if (refreshToken && token) {
        await axios.post(
          ENDPOINTS.AUTH + "/logout/",
          { refresh: refreshToken },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (_err) {
      // ignore server logout errors
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      navigate("/login");
      window.location.reload();
    }
  };

  // Helper date formatter
  const formatDate = (isoStr) => {
    if (!isoStr) return "Not recorded";
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (_e) {
      return isoStr;
    }
  };

  const formatDateTime = (isoStr) => {
    if (!isoStr) return "Not recorded";
    try {
      const d = new Date(isoStr);
      return d.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (_e) {
      return isoStr;
    }
  };

  // Calculate Overall Security Score
  const calculateSecurityScore = () => {
    if (!profile) return 60;
    let score = 50; // base active account
    if (profile.email_verified) score += 25;
    if (profile.contact_number && profile.contact_number.trim().length > 5)
      score += 15;
    if (profile.password_updated_at) score += 10;
    return Math.min(score, 100);
  };

  const overallSecurityScore = calculateSecurityScore();

  return (
    <div className="profile-page-root w-full min-h-[calc(100vh-4rem)] bg-[#070D1A] text-slate-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div
        className="absolute top-1/4 left-1/12 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 right-1/12 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* ==================== 1. COMMAND CENTER HEADER ==================== */}
        <div className="text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-cyan-500/20">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono uppercase tracking-widest shadow-[0_0_12px_rgba(0,217,245,0.2)] mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              COMMAND CENTER // SECURITY VAULT
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center justify-center sm:justify-start gap-3">
              <FaShieldAlt className="text-cyan-400 text-2xl sm:text-3xl" />
              <span>Profile & Account Security</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl">
              Manage your cryptographic identity, authenticated communication channels, and encryption security parameters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-950/40 hover:text-red-300 text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-sm"
              title="Terminate active session"
            >
              <FaSignOutAlt />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Loading / Error Notifications */}
        {loading && (
          <div className="p-8 rounded-2xl bg-[#0c1629]/90 border border-cyan-500/30 text-center text-cyan-300 font-mono flex items-center justify-center gap-3 animate-pulse">
            <span className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
            <span>Decrypting user identity credentials…</span>
          </div>
        )}

        {pageError && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-sm font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-red-400 shrink-0 text-base" />
              <span className="leading-relaxed">{pageError}</span>
            </div>
            <button
              onClick={fetchProfile}
              className="px-3.5 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-400/60 text-red-100 text-xs font-mono uppercase tracking-wider shrink-0 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_0_10px_rgba(239,68,68,0.4)]"
            >
              ↻ Retry Connection
            </button>
          </div>
        )}

        {profile && (
          <>
            {/* ==================== 2. NAVIGATION TABS ==================== */}
            <div className="flex items-center gap-2 border-b border-cyan-500/20 overflow-x-auto pb-1 scrollbar-thin">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,217,245,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-cyan-950/40"
                }`}
              >
                <FaUserShield />
                <span>Identity & Overview</span>
              </button>

              <button
                onClick={() => setActiveTab("personal")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "personal"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,217,245,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-cyan-950/40"
                }`}
              >
                <FaUserEdit />
                <span>Personal Info</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "security"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,217,245,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-cyan-950/40"
                }`}
              >
                <FaKey />
                <span>Password & Security</span>
              </button>

              <button
                onClick={() => setActiveTab("logs")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "logs"
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(0,217,245,0.35)]"
                    : "text-slate-400 hover:text-white hover:bg-cyan-950/40"
                }`}
              >
                <FaHistory />
                <span>Audit Telemetry</span>
              </button>
            </div>

            {/* Global Notification Banner */}
            {infoMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl text-xs sm:text-sm font-mono flex items-center justify-between border ${
                  infoMessage.type === "success"
                    ? "border-emerald-500/40 bg-emerald-950/60 text-emerald-200"
                    : "border-red-500/40 bg-red-950/60 text-red-200"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {infoMessage.type === "success" ? (
                    <FaCheckCircle className="text-emerald-400 shrink-0" />
                  ) : (
                    <FaExclamationTriangle className="text-red-400 shrink-0" />
                  )}
                  <span>{infoMessage.text}</span>
                </div>
                <button
                  onClick={() => setInfoMessage({ type: "", text: "" })}
                  className="text-slate-400 hover:text-white ml-2 cursor-pointer"
                >
                  <FaTimes />
                </button>
              </motion.div>
            )}

            {/* ==================== 3. TAB CONTENT ==================== */}
            <div className="space-y-8">
              {/* ──────────────── TAB 1: IDENTITY & OVERVIEW ──────────────── */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
                  {/* Left Column: Profile Identity Card (Cols 1-5) */}
                  <div className="lg:col-span-5 relative rounded-2xl bg-[#0c1629]/90 border border-cyan-500/30 p-6 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl flex flex-col justify-between overflow-hidden group">
                    {/* Top Cyber Line Glow */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-500" />

                    <div>
                      {/* Avatar & Badges Header */}
                      <div className="flex flex-col sm:flex-row items-center gap-5 pb-6 border-b border-cyan-500/15">
                        {/* Avatar Container with Upload trigger */}
                        <div className="relative group/avatar">
                          <input
                            ref={avatarInputRef}
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleAvatarChange}
                            className="hidden"
                          />
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-extrabold shadow-[0_0_20px_rgba(0,217,245,0.4)] overflow-hidden border-2 border-cyan-400/50">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.username}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>
                                {profile.username
                                  ? profile.username[0].toUpperCase()
                                  : "U"}
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => avatarInputRef.current?.click()}
                            disabled={avatarUploading}
                            className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-[#070D1A] border border-cyan-400 text-cyan-300 hover:text-white shadow-md hover:scale-110 transition cursor-pointer"
                            title="Upload new avatar image"
                          >
                            <FaCamera className="text-xs" />
                          </button>
                        </div>

                        {/* Username & Status Info */}
                        <div className="text-center sm:text-left space-y-1 min-w-0 flex-1">
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide truncate max-w-full">
                              {profile.username}
                            </h2>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
                              ACTIVE // ID #{profile.id}
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm text-cyan-400 font-mono truncate" title={profile.email}>
                            {profile.email}
                          </p>

                          <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono bg-cyan-950/50 border border-cyan-500/20 text-cyan-300">
                              <FaCheck className="text-emerald-400 text-[10px]" /> Email Verified
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Profile Detail Fields */}
                      <div className="py-5 space-y-3.5 text-xs sm:text-sm font-mono">
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070e1c] border border-slate-800">
                          <span className="text-slate-400 flex items-center gap-2">
                            <FaEnvelope className="text-cyan-400" /> Registered Email:
                          </span>
                          <span className="text-slate-200 font-semibold truncate max-w-[200px]" title={profile.email}>
                            {profile.email}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070e1c] border border-slate-800">
                          <span className="text-slate-400 flex items-center gap-2">
                            <FaPhoneAlt className="text-emerald-400" /> Contact Number:
                          </span>
                          <span className="text-slate-200 font-semibold">
                            {profile.contact_number || "Not configured"}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070e1c] border border-slate-800">
                          <span className="text-slate-400 flex items-center gap-2">
                            <FaCalendarAlt className="text-purple-400" /> Account Created:
                          </span>
                          <span className="text-slate-200">
                            {formatDate(profile.date_joined)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#070e1c] border border-slate-800">
                          <span className="text-slate-400 flex items-center gap-2">
                            <FaClock className="text-teal-400" /> Last Login:
                          </span>
                          <span className="text-slate-200">
                            {formatDateTime(profile.last_login)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action trigger */}
                    <div className="pt-4 border-t border-cyan-500/15 flex items-center justify-between">
                      <span className="text-xs text-slate-400 font-mono">
                        Security Encryption Tier: AES-256
                      </span>
                      <button
                        onClick={() => setActiveTab("personal")}
                        className="text-xs text-cyan-300 hover:text-white font-mono uppercase tracking-wider underline cursor-pointer"
                      >
                        Edit Details →
                      </button>
                    </div>
                  </div>

                  {/* Right Column: Security Status Overview (Cols 6-12) */}
                  <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                    {/* Security Health Score Card */}
                    <div className="rounded-2xl bg-[#0c1629]/90 border border-cyan-500/30 p-6 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                        {/* Circular Meter */}
                        <div className="relative flex items-center justify-center shrink-0">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                              cx="64"
                              cy="64"
                              r="52"
                              stroke="rgba(6, 182, 212, 0.15)"
                              strokeWidth="8"
                              fill="none"
                            />
                            <circle
                              cx="64"
                              cy="64"
                              r="52"
                              stroke="url(#securityScoreGrad)"
                              strokeWidth="8"
                              fill="none"
                              strokeDasharray={2 * Math.PI * 52}
                              strokeDashoffset={
                                2 * Math.PI * 52 * (1 - overallSecurityScore / 100)
                              }
                              strokeLinecap="round"
                              className="transition-all duration-1000 ease-out"
                            />
                            <defs>
                              <linearGradient id="securityScoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#00D9F5" />
                                <stop offset="100%" stopColor="#00D6A0" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute text-center">
                            <span className="text-2xl font-black text-white font-mono">
                              {overallSecurityScore}%
                            </span>
                            <span className="block text-[10px] uppercase font-mono text-cyan-300">
                              Armor Tier
                            </span>
                          </div>
                        </div>

                        {/* Health Details */}
                        <div className="space-y-3 flex-1 text-center sm:text-left">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            VAULT INTEGRITY: EXCELLENT
                          </div>
                          <h3 className="text-xl font-bold text-white tracking-wide">
                            Account Security Overview
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Your identity credentials are cryptographically mapped with authenticated token access. All carrier steganography and password records use zero-knowledge parameters.
                          </p>
                        </div>
                      </div>

                      {/* Mini Security Criteria List */}
                      <div className="mt-6 pt-5 border-t border-cyan-500/15 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                        <div className="p-3 rounded-xl bg-[#070e1c] border border-cyan-500/20 space-y-1">
                          <div className="text-slate-400">EMAIL CHANNEL</div>
                          <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <FaCheckCircle /> Verified Active
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#070e1c] border border-cyan-500/20 space-y-1">
                          <div className="text-slate-400">PHONE CHANNEL</div>
                          <div
                            className={`font-bold flex items-center gap-1.5 ${
                              profile.contact_number
                                ? "text-emerald-400"
                                : "text-amber-400"
                            }`}
                          >
                            {profile.contact_number ? (
                              <>
                                <FaCheckCircle /> Configured
                              </>
                            ) : (
                              <>
                                <FaExclamationTriangle /> Unset
                              </>
                            )}
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[#070e1c] border border-cyan-500/20 space-y-1">
                          <div className="text-slate-400">PASSWORD STATUS</div>
                          <div className="text-cyan-300 font-bold flex items-center gap-1.5">
                            <FaLock /> Active / Encrypted
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Access Action Banners */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setActiveTab("personal")}
                        className="p-5 rounded-2xl bg-[#0c1629]/80 border border-cyan-500/25 hover:border-cyan-400 transition-all duration-200 cursor-pointer shadow-md group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="p-2 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                            <FaEnvelope />
                          </span>
                          <span className="text-xs font-mono text-cyan-400 group-hover:translate-x-1 transition-transform">
                            Edit →
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          Change Registered Email
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Secure 2-step OTP verification directly to your new inbox.
                        </p>
                      </div>

                      <div
                        onClick={() => setActiveTab("security")}
                        className="p-5 rounded-2xl bg-[#0c1629]/80 border border-purple-500/25 hover:border-purple-400 transition-all duration-200 cursor-pointer shadow-md group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="p-2 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-500/30">
                            <FaKey />
                          </span>
                          <span className="text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">
                            Update →
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                          Rotate Password
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Update and re-hash your passphrase with PBKDF2/SHA-256.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ──────────────── TAB 2: PERSONAL INFORMATION ──────────────── */}
              {activeTab === "personal" && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Card Container */}
                  <div className="rounded-2xl bg-[#0c1629]/90 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                          <FaUserEdit className="text-cyan-400" />
                          <span>Personal Identity Parameters</span>
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                          Manage your display credentials and authenticated communication channels.
                        </p>
                      </div>

                      {!isEditingInfo ? (
                        <button
                          type="button"
                          onClick={() => setIsEditingInfo(true)}
                          className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl text-xs font-mono uppercase tracking-wider shadow-sm transition cursor-pointer self-start sm:self-auto"
                        >
                          ✎ Edit Information
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingInfo(false);
                            setEditUsername(profile.username);
                            setEditPhone(profile.contact_number || "");
                          }}
                          className="px-3 py-1.5 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono transition cursor-pointer self-start sm:self-auto"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <form onSubmit={handleSaveInfo} className="space-y-5">
                      {/* Field 1: Username */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300">
                          Username
                        </label>
                        <input
                          type="text"
                          value={isEditingInfo ? editUsername : profile.username}
                          onChange={(e) => setEditUsername(e.target.value)}
                          disabled={!isEditingInfo || infoSaving}
                          required
                          className={`w-full px-4 py-3 rounded-xl font-mono text-sm border transition-all ${
                            isEditingInfo
                              ? "bg-[#070e1c] border-cyan-500/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              : "bg-[#091120] border-slate-800 text-slate-300 cursor-not-allowed opacity-80"
                          }`}
                        />
                        <span className="block text-[11px] text-slate-400">
                          Used as your primary handle across encryption audit logs.
                        </span>
                      </div>

                      {/* Field 2: Email (With OTP Trigger) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300">
                            Registered Email Address
                          </label>
                          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                            <FaCheckCircle /> Verified
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="email"
                            value={profile.email}
                            disabled
                            className="flex-1 px-4 py-3 rounded-xl font-mono text-sm bg-[#091120] border border-slate-800 text-slate-300 cursor-not-allowed opacity-80"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setShowEmailModal(true);
                              setEmailStep(1);
                              setEmailError("");
                              setEmailSuccess("");
                            }}
                            className="px-4 py-3 bg-[#132038] hover:bg-[#1a2d50] text-cyan-300 hover:text-white border border-cyan-500/35 rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer whitespace-nowrap shadow-sm"
                          >
                            Change Email
                          </button>
                        </div>
                        <span className="block text-[11px] text-slate-400">
                          Changing your email requires mandatory OTP verification for account protection.
                        </span>
                      </div>

                      {/* Field 3: Contact Number */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300">
                          Contact / Phone Number
                        </label>
                        <input
                          type="text"
                          value={isEditingInfo ? editPhone : profile.contact_number || ""}
                          onChange={(e) => setEditPhone(e.target.value)}
                          disabled={!isEditingInfo || infoSaving}
                          placeholder="+1 555-019-2834"
                          className={`w-full px-4 py-3 rounded-xl font-mono text-sm border transition-all ${
                            isEditingInfo
                              ? "bg-[#070e1c] border-cyan-500/50 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
                              : "bg-[#091120] border-slate-800 text-slate-300 cursor-not-allowed opacity-80"
                          }`}
                        />
                        <span className="block text-[11px] text-slate-400">
                          Optional secondary phone channel for high-priority security notifications.
                        </span>
                      </div>

                      {/* Save Changes Button (Visible in Edit Mode) */}
                      {isEditingInfo && (
                        <div className="pt-4 flex items-center gap-3">
                          <button
                            type="submit"
                            disabled={infoSaving}
                            className="px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 shadow-[0_0_20px_rgba(0,217,245,0.35)] transition cursor-pointer disabled:opacity-50"
                          >
                            {infoSaving ? "Saving Updates…" : "Save Profile Changes"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingInfo(false);
                              setEditUsername(profile.username);
                              setEditPhone(profile.contact_number || "");
                            }}
                            className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              )}

              {/* ──────────────── TAB 3: PASSWORD & SECURITY ──────────────── */}
              {activeTab === "security" && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Password Change Card */}
                  <div className="rounded-2xl bg-[#0c1629]/90 border border-purple-500/30 p-6 sm:p-8 shadow-[0_15px_45px_rgba(0,0,0,0.7)] backdrop-blur-xl space-y-6">
                    <div className="pb-4 border-b border-purple-500/20">
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
                        <FaKey className="text-purple-400" />
                        <span>Cryptographic Passphrase Rotation</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        Rotate your account password regularly to ensure robust zero-knowledge protection.
                      </p>
                    </div>

                    {passwordMessage.text && (
                      <div
                        className={`p-4 rounded-xl text-xs sm:text-sm font-mono flex items-center gap-2.5 border ${
                          passwordMessage.type === "success"
                            ? "border-emerald-500/40 bg-emerald-950/60 text-emerald-200"
                            : "border-red-500/40 bg-red-950/60 text-red-200"
                        }`}
                      >
                        {passwordMessage.type === "success" ? (
                          <FaCheckCircle className="text-emerald-400 shrink-0" />
                        ) : (
                          <FaExclamationTriangle className="text-red-400 shrink-0" />
                        )}
                        <span>{passwordMessage.text}</span>
                      </div>
                    )}

                    <form onSubmit={handleChangePassword} className="space-y-5">
                      {/* Current Password */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-wider text-purple-300">
                          Current Passphrase
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="Enter your current password"
                            className="w-full px-4 py-3 pr-11 bg-[#070e1c] border border-purple-500/30 rounded-xl font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-wider text-purple-300">
                          New Secure Passphrase
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter new strong password"
                            className="w-full px-4 py-3 pr-11 bg-[#070e1c] border border-purple-500/30 rounded-xl font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>

                        {/* Live Password Strength Meter */}
                        {newPassword && (
                          <div className="pt-2 space-y-2">
                            <div className="flex items-center justify-between text-xs font-mono">
                              <span className="text-slate-400">Strength:</span>
                              <span
                                className="font-bold uppercase tracking-wider"
                                style={{ color: passwordStrength.color }}
                              >
                                {passwordStrength.label} ({passwordStrength.score}%)
                              </span>
                            </div>

                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-300"
                                style={{
                                  width: `${passwordStrength.score}%`,
                                  backgroundColor: passwordStrength.color,
                                }}
                              />
                            </div>

                            {/* Requirements Checklist */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                              <span
                                className={`flex items-center gap-1.5 ${
                                  newPassword.length >= 8
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {newPassword.length >= 8 ? "✓" : "○"} 8+ Characters
                              </span>
                              <span
                                className={`flex items-center gap-1.5 ${
                                  /[A-Z]/.test(newPassword)
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {/[A-Z]/.test(newPassword) ? "✓" : "○"} Uppercase (A-Z)
                              </span>
                              <span
                                className={`flex items-center gap-1.5 ${
                                  /[a-z]/.test(newPassword)
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {/[a-z]/.test(newPassword) ? "✓" : "○"} Lowercase (a-z)
                              </span>
                              <span
                                className={`flex items-center gap-1.5 ${
                                  /[0-9]/.test(newPassword)
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {/[0-9]/.test(newPassword) ? "✓" : "○"} Number (0-9)
                              </span>
                              <span
                                className={`flex items-center gap-1.5 ${
                                  /[\W_]/.test(newPassword)
                                    ? "text-emerald-400"
                                    : "text-slate-500"
                                }`}
                              >
                                {/[\W_]/.test(newPassword) ? "✓" : "○"} Special Char
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirm New Password */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-mono uppercase tracking-wider text-purple-300">
                          Confirm New Passphrase
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Re-enter new password"
                            className="w-full px-4 py-3 pr-11 bg-[#070e1c] border border-purple-500/30 rounded-xl font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={passwordLoading}
                          className="w-full py-3.5 px-6 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 shadow-[0_0_20px_rgba(144,101,245,0.35)] transition cursor-pointer disabled:opacity-50"
                        >
                          {passwordLoading ? "Hashing & Applying…" : "Update Security Passphrase"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* ──────────────── TAB 4: AUDIT TELEMETRY LOGS ──────────────── */}
              {activeTab === "logs" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                        <FaHistory className="text-cyan-400" />
                        <span>Steganographic Telemetry Audit</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400">
                        Cryptographic operations recorded under your account.
                      </p>
                    </div>

                    <button
                      onClick={fetchHistory}
                      disabled={logsLoading}
                      className="px-4 py-2 rounded-xl bg-[#0c1629] border border-cyan-500/30 text-cyan-300 hover:text-white text-xs font-mono uppercase tracking-wider transition cursor-pointer self-start sm:self-auto"
                    >
                      {logsLoading ? "Querying Logs…" : "↻ Refresh Audit"}
                    </button>
                  </div>

                  {logsLoading && (
                    <div className="p-8 rounded-2xl bg-[#0c1629]/90 border border-cyan-500/30 text-center text-cyan-300 font-mono animate-pulse">
                      Retrieving steganographic activity records…
                    </div>
                  )}

                  {!logsLoading && historyLogs.length === 0 && (
                    <div className="p-8 rounded-2xl bg-[#0c1629]/60 border border-slate-800 text-center text-slate-400 font-mono">
                      No steganographic activity logs found under this account.
                    </div>
                  )}

                  <div className="space-y-4">
                    {historyLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-5 sm:p-6 rounded-2xl bg-[#0c1629]/85 border border-cyan-500/25 shadow-md backdrop-blur-md space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/15">
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                                log.action === "encrypt"
                                  ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40"
                                  : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                              }`}
                            >
                              {log.action === "encrypt" ? "🔒 Encrypted" : "🔑 Decrypted"}
                            </span>
                            <span className="text-xs font-mono text-slate-400">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>

                          <span
                            className={`text-xs font-mono font-semibold px-2.5 py-0.5 rounded ${
                              log.success
                                ? "text-emerald-400 bg-emerald-950/50"
                                : "text-red-400 bg-red-950/50"
                            }`}
                          >
                            {log.success ? "✓ Success" : "✕ Failed"}
                          </span>
                        </div>

                        <div className="text-xs sm:text-sm font-mono text-slate-300">
                          Carrier Image: <span className="text-white font-semibold">{log.carrier_filename || "—"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ==================== 4. EMAIL CHANGE WITH OTP MODAL ==================== */}
      <AnimatePresence>
        {showEmailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-md rounded-2xl bg-[#0c1629] border border-cyan-500/40 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.85)] relative text-white space-y-5"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    <FaEnvelope />
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-white tracking-wide">
                      Update Registered Email
                    </h4>
                    <span className="text-xs font-mono text-cyan-400">
                      Phase {emailStep} of 2 // Verification
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
                >
                  <FaTimes />
                </button>
              </div>

              {emailError && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-400 shrink-0" />
                  <span>{emailError}</span>
                </div>
              )}

              {emailSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-400 shrink-0" />
                  <span>{emailSuccess}</span>
                </div>
              )}

              {/* STEP 1: Enter New Email */}
              {emailStep === 1 && (
                <form onSubmit={handleSendEmailOtp} className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    Enter the new email address you wish to bind to this PICRYPT account. A 6-digit OTP will be dispatched.
                  </p>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300">
                      New Email Address
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="e.g. security@picrypt.com"
                      required
                      className="w-full px-4 py-3 bg-[#070e1c] border border-cyan-500/30 rounded-xl font-mono text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={emailLoading || !newEmail}
                      className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 transition cursor-pointer disabled:opacity-50"
                    >
                      {emailLoading ? "Dispatching Code…" : "Send Verification Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(false)}
                      className="px-4 py-3 rounded-xl text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white border border-slate-700 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Verify OTP */}
              {emailStep === 2 && (
                <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    Enter the 6-digit code sent to <strong className="text-cyan-300">{newEmail}</strong>.
                  </p>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono uppercase tracking-wider text-cyan-300">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={emailOtp}
                      onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="123456"
                      required
                      className="w-full text-center tracking-[0.5em] text-lg font-mono px-4 py-3 bg-[#070e1c] border border-cyan-500/40 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || emailLoading}
                      onClick={handleSendEmailOtp}
                      className="text-cyan-400 hover:underline disabled:text-slate-600 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {resendCooldown > 0
                        ? `Resend Code (${resendCooldown}s)`
                        : "Resend Code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailStep(1)}
                      className="text-slate-400 hover:text-white underline cursor-pointer"
                    >
                      Edit New Email
                    </button>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={emailLoading || emailOtp.length !== 6}
                      className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 transition cursor-pointer disabled:opacity-50"
                    >
                      {emailLoading ? "Verifying…" : "Verify & Apply Email"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

