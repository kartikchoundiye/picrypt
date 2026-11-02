// frontend/src/components/DecryptForm.jsx

import { useState, useRef, useEffect } from "react";
import axios from "axios";
// import { formatSize } from "../utils/sizeFormat";
import ConfirmModal from "./ConfirmModal";
import { DecryptContainerArtwork } from "./CyberContainerArtworks";

import { ENDPOINTS } from "../utils/api";

const API_BASE = ENDPOINTS.STEGHIDE;

const ALLOWED_IMAGE_EXTENSIONS = [
    "jpg", "jpeg", "png", "bmp", "tif", "tiff"
];

export default function DecryptForm({ isMobileActive }) {
    // STATE: Decryption form
    const [decCarrier, setDecCarrier] = useState(null);
    const [decPassphrase, setDecPassphrase] = useState("");

    const [decCarrierError, setDecCarrierError] = useState("");
    const [decMessage, setDecMessage] = useState("");
    const [decLoading, setDecLoading] = useState(false);

    // STATE: UI helpers
    const [showDecClearConfirm, setShowDecClearConfirm] = useState(false);
    const [showDecCarrierFullName, setShowDecCarrierFullName] = useState(false);

    // REFS: File inputs
    const decCarrierInputRef = useRef(null);

    const isDecryptFormDirty =
        decCarrier ||
        decPassphrase ||
        decMessage ||
        decCarrierError;

    // EFFECT : Keyboard shortcuts (Clear & Escape)
    useEffect(() => {
        function handleKeyDown(e) {

            // Ctrl + Shift + D → Clear Decrypt
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
                e.preventDefault();
                if (isDecryptFormDirty && !decLoading) {
                    setShowDecClearConfirm(true);
                }
            }

            // ESC → close any open confirm modal
            if (e.key === "Escape") {
                setShowDecClearConfirm(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDecryptFormDirty, decLoading]);

    // ======================================================
    // HANDLER: Select stego image
    // ======================================================

    const handleDecCarrierSelect = async (file) => {
        setDecCarrier(null);
        setDecCarrierError("");

        if (!file) return;

        const ext = file.name.split(".").pop().toLowerCase();

        if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
            setDecCarrierError(
                "Unsupported file type. Please select a valid stego image (.jpg, .jpeg, .png, .tif, .tiff, .bmp)."
            );

            if (decCarrierInputRef.current) {
                decCarrierInputRef.current.value = "";
            }
            return;
        }

        setDecCarrier(file);
    }

    // ======================================================
    // HANDLER: Remove stego image 
    // ======================================================

    const removeDecCarrier = () => {
        setDecCarrier(null);
        setShowDecCarrierFullName(false);
        setDecCarrierError("");
        setDecMessage("");
        if (decCarrierInputRef.current) {
            decCarrierInputRef.current.value = "";
        }
    }

    // ======================================================
    // HANDLER: Decryption submit
    // ======================================================

    const handleDecrypt = async (e) => {
        e.preventDefault();
        setDecMessage("");
        if (!decCarrier) { setDecMessage("Please select a stego image for decryption."); return; }
        if (!decPassphrase) { setDecMessage("Please enter the decryption key."); return; }

        setDecLoading(true);
        try {
            const form = new FormData();
            form.append("stego_image", decCarrier);
            form.append("passphrase", decPassphrase);

            const res = await axios.post(`${API_BASE}/decrypt/`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const url = res.data.download_url || res.data.url;
            setDecMessage("Decryption successful. Download link: " + url);
            if (url) window.open(url, "_blank");
        } catch (err) {
            setDecMessage(err.response?.data?.error || "Decryption failed: " + (err.message || ""));
        } finally {
            setDecLoading(false);
        }
    }

    // ======================================================
    // CLEAR FORM LOGIC
    // ======================================================

    function requestDecryptClear() {
        if (decLoading || !isDecryptFormDirty) return;
        setShowDecClearConfirm(true);
    }

    function clearDecryptForm() {
        if (decLoading) return; // safety

        // React state
        setDecCarrier(null);
        setDecPassphrase("");
        setDecMessage("");
        setDecCarrierError("");
        setDecLoading(false);

        // DOM file input
        if (decCarrierInputRef.current) {
            decCarrierInputRef.current.value = "";
        }
        setShowDecClearConfirm(false);
    }

    return (
        <div className="w-full md:h-full flex flex-col">
            <div className="relative edp-panel-base edp-panel-decrypt rounded-2xl overflow-hidden p-5 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.65)] md:h-full flex flex-col">

                {/* 1. TRAVELING PERIMETER NEON BORDER BEAM (Emerald Identity) */}
                <svg className="ctc-border-svg" aria-hidden="true">
                    <defs>
                        <linearGradient id="edpDecGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00D6A0">
                                <animate attributeName="stop-color" values="#00D6A0;#06B6D4;#10B981;#00D6A0" dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="50%" stopColor="#06B6D4">
                                <animate attributeName="stop-color" values="#06B6D4;#10B981;#00D6A0;#06B6D4" dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#10B981">
                                <animate attributeName="stop-color" values="#10B981;#00D6A0;#06B6D4;#10B981" dur="6s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>
                        <filter id="edpDecGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="16" pathLength="1000" className="etc-border-track" />
                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="16" pathLength="1000" fill="none" stroke="url(#edpDecGrad)" strokeWidth="2.5" strokeLinecap="round" className="edp-beam-decrypt" filter="url(#edpDecGlow)" />
                </svg>

                {/* 2. CYBERNETIC CORNER BRACKETS */}
                <div className="ctc-corner-bracket top-left edp-corner-emerald" aria-hidden="true" />
                <div className="ctc-corner-bracket top-right edp-corner-emerald" aria-hidden="true" />
                <div className="ctc-corner-bracket bottom-left edp-corner-emerald" aria-hidden="true" />
                <div className="ctc-corner-bracket bottom-right edp-corner-emerald" aria-hidden="true" />

                {/* 3. CYBERSECURITY CONTAINER BACKGROUND ARTWORK */}
                <DecryptContainerArtwork />

                {/* ==================== DECRYPTION FORM ======================= */}
                <form
                    onSubmit={handleDecrypt}
                    className="relative z-10 space-y-4 text-slate-200"
                >
                    {/* FORM HEADER */}
                    <div className="relative flex items-center mb-2">
                        {/* CENTER: Heading & Holographic Icon */}
                        <div className="mx-auto text-center flex items-center justify-center gap-3">
                            <div className="edp-icon-aperture edp-aperture-emerald flex items-center justify-center text-lg">
                                <span>🔑</span>
                            </div>
                            <h3 className="font-bold text-lg text-white tracking-wide">
                                Decrypt Data
                            </h3>
                        </div>

                        {/* RIGHT: Clear button */}
                        <div className="absolute right-0">
                            <button
                                type="button"
                                onClick={requestDecryptClear}
                                disabled={decLoading || !isDecryptFormDirty}
                                title="Ctrl + Shift + D"
                                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                                    decLoading || !isDecryptFormDirty
                                        ? "border-slate-800 bg-[#0d1627]/60 text-slate-600 cursor-not-allowed"
                                        : "border-emerald-500/30 bg-[#132038] hover:bg-[#1a2d50] text-emerald-300 hover:text-white shadow-sm cursor-pointer"
                                }`}
                            >
                                ♻️ Clear
                            </button>
                        </div>
                    </div>

                    {/* CLEAR CONFIRMATION MODAL */}
                    {showDecClearConfirm && (
                        <ConfirmModal
                            message="🧹 Clear decryption form ?"
                            onCancel={() => setShowDecClearConfirm(false)}
                            onConfirm={clearDecryptForm}
                        />
                    )}

                    {/* ============ STEGO IMAGE INPUT ============== */}
                    <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        Stego Image
                    </label>

                    <input
                        ref={decCarrierInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.tif,.tiff,.bmp"
                        onChange={e => handleDecCarrierSelect(e.target.files[0] || null)}
                        className="hidden"
                    />

                    <div className="flex items-start gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => decCarrierInputRef.current?.click()}
                            className="px-4 py-2.5 bg-[#14262c] hover:bg-[#1b353e] text-emerald-300 hover:text-white border border-emerald-500/35 rounded-lg text-sm font-medium shrink-0 transition-colors cursor-pointer"
                        >
                            Browse
                        </button>

                        <div className="flex items-start border border-emerald-500/25 rounded-lg px-3 py-2.5 flex-1 min-w-0 bg-[#09161a]/80 hover:border-emerald-500/40 transition-colors">
                            {!decCarrier ? (
                                <span className="text-sm text-slate-500">
                                    Choose stego image
                                </span>
                            ) : (
                                <>
                                    <span
                                        className={`text-xs text-slate-200 cursor-pointer ${showDecCarrierFullName
                                            ? "whitespace-normal break-all"
                                            : "truncate flex-1"
                                            }`}
                                        title={decCarrier.name}
                                        onClick={() => setShowDecCarrierFullName(v => !v)}
                                    >
                                        {decCarrier.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={removeDecCarrier}
                                        className="ml-auto pl-3 text-emerald-400 hover:text-red-400 shrink-0 text-sm transition-colors cursor-pointer"
                                        title="Remove stego image"
                                    >
                                        ✖
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {decCarrierError && (
                        <div className="text-xs text-red-400 mt-1 bg-red-950/40 border border-red-500/30 p-2 rounded-lg">
                            {decCarrierError}
                        </div>
                    )}

                    {/* ---------- Decryption Key input ----------*/}
                    <label className="block mt-4 mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                        Decryption Key
                    </label>

                    <div className="relative">
                        <input
                            type={"password"}
                            value={decPassphrase}
                            onChange={e => setDecPassphrase(e.target.value)}
                            placeholder="Enter decryption key"
                            className="border border-emerald-500/30 rounded-lg px-3.5 py-2.5 w-full pr-10 text-sm bg-[#09161a]/90 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/60 focus:border-emerald-400 transition-all font-mono"
                        />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                        Must match the encryption key used earlier.
                    </p>

                    {/* =========== Decrypt Button ============= */}
                    <button
                        type="submit"
                        disabled={decLoading}
                        className={`mt-4 px-4 py-3.5 w-full rounded-xl text-sm font-bold tracking-wide uppercase text-white bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_20px_rgba(0,214,160,0.35)] hover:shadow-[0_0_30px_rgba(0,214,160,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
                    >
                        {decLoading ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                <span>Decrypting…</span>
                            </>
                        ) : (
                            <span>🔑 Decrypt</span>
                        )}
                    </button>

                    {decMessage && (
                        <div className={`mt-3 p-3 rounded-xl text-xs border flex items-center gap-2 shadow-inner ${
                            decMessage.includes("failed") || decMessage.includes("error")
                                ? "border-red-500/40 bg-red-950/40 text-red-200"
                                : "border-emerald-500/30 bg-[#09161a]/90 text-emerald-200"
                        }`}>
                            {decMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
