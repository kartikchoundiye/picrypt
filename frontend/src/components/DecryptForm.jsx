// frontend/src/components/DecryptForm.jsx

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
// import { formatSize } from "../utils/sizeFormat";
import ConfirmModal from "./ConfirmModal";

/* =========================== Backend API base (supports localhost, LAN & prod) ==================== */

const API_BASE = (() => {
    if (window.location.hostname === "localhost") return "http://localhost:8000/api/steghide";
    if (window.location.hostname.startsWith("192.168.")) return `http://${window.location.hostname}:8000/api/steghide`;
    // TODO: replace with actual backend domain after deployment
    return "https://your-production-backend.com/api/steghide";
})();

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
        <div className={`${isMobileActive ? "block" : "hidden"} md:block`}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-emerald-400 to-emerald-400" />
                <div className="pl-4">
                    <form
                        onSubmit={handleDecrypt}
                        className="rounded-2xl bg-gradient-to-b from-white to-emerald-50/60 backdrop-blur border border-emerald-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 space-y-4"
                    >
                        <div className="relative flex items-center">
                            {/* CENTER: Heading */}
                            <div className="mx-auto text-center">
                                <h3 className="flex items-center font-semibold justify-center text-gray-800 ">🔑 Decrypt data</h3>
                            </div>

                            {/* RIGHT: Clear button */}
                            <div className="absolute right-0">
                                <button
                                    type="button"
                                    onClick={requestDecryptClear}
                                    disabled={decLoading || !isDecryptFormDirty}
                                    title="Ctrl + Shift + D"
                                    className={`text-sm px-2 py-1 rounded ${decLoading || !isDecryptFormDirty
                                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                                        : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    ♻️ Clear
                                </button>
                            </div>
                        </div>

                        {showDecClearConfirm && (
                            <ConfirmModal
                                message="🧹 Clear decryption form ?"
                                onCancel={() => setShowDecClearConfirm(false)}
                                onConfirm={clearDecryptForm}
                            />
                        )}

                        <label className="block mb-1">Stego Image</label>
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
                                className="px-4 py-2.5 bg-gray-200 rounded-md hover:bg-gray-300 text-sm shrink-0"
                            >
                                Browse
                            </button>

                            <div className="flex items-start border border-gray-300 rounded-md px-3 py-2.5 flex-1 min-w-0 bg-gray-50 hover:bg-gray-100 transition-colors">
                                {!decCarrier ? (
                                    <span className="text-sm text-gray-400">
                                        Choose stego image
                                    </span>
                                ) : (
                                    <>
                                        <span
                                            className={`text-xs text-gray-700 cursor-pointer ${showDecCarrierFullName
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
                                            className="ml-auto pl-3 text-green-500 hover:text-red-600 shrink-0 items-start"
                                            title="Remove stego image"
                                        >
                                            ✖
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {decCarrierError && (
                            <div className="text-sm text-red-600 mt-1">
                                {decCarrierError}
                            </div>
                        )}

                        <label className="block mt-4 mb-1 text-sm font-medium">
                            Decryption Key
                        </label>

                        <div className="relative">
                            <input
                                type={"password"}
                                value={decPassphrase}
                                onChange={e => setDecPassphrase(e.target.value)}
                                placeholder="Enter decryption key"
                                className="border border-gray-300 rounded-md px-3 py-2.5 w-full pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                            />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Must match the encryption key used earlier.
                        </p>

                        <button
                            type="submit"
                            disabled={decLoading}
                            className={`mt-3 px-4 py-2.5 w-full rounded-md text-sm text-white ${decLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"}`}
                        >
                            {decLoading ? "Decrypting…" : "Decrypt"}
                        </button>

                        {decMessage && <div className="mt-3 p-2 bg-gray-50 text-sm rounded">{decMessage}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}

