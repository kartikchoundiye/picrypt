// frontend/src/components/EncryptForm.jsx

// • Handles full encryption workflow
// • Carrier image selection + validation
// • Payload file selection + management
// • Capacity feasibility check
// • Encryption API call + secure download
// • Fully responsive + mobile friendly

import { useState, useRef, useEffect } from "react";
import axios from "axios";

/* =========================== Utils & Assets =========================== */

import {
    formatSize,
    getCommonPayloadUnit,
    formatSizeWithUnit
} from "../utils/sizeFormat";

import picryptLogo from "../assets/picrypt_logo.png";
import ConfirmModal from "./ConfirmModal";
import { EncryptContainerArtwork } from "./CyberContainerArtworks";


import { ENDPOINTS } from "../utils/api";

const API_BASE = ENDPOINTS.STEGHIDE;

/* ======================== CONSTANTS: Allowed extensions ====================== */

const ALLOWED_IMAGE_EXTENSIONS = [
    "jpg", "jpeg", "png", "bmp", "tif", "tiff"
];

const ALLOWED_PAYLOAD_EXTENSIONS = [
    // images
    "jpg", "jpeg", "png", "bmp", "tif", "tiff",

    // video
    "mp4", "mov", "avi", "wmv", "flv", "mkv", "webm",

    // audio
    "mp3", "wav", "aac", "flac", "wma", "ogg", "alac", "m4a",

    // documents
    "txt", "doc", "docx", "csv", "xls", "xlsx", "pdf", "ppt", "pptx", "rtf",

    //Program files
    "c", "cpp", "java", "py", "html", "css",

    //applications (executables)
    "exe", "dll", "msi",

    // archives
    "zip", "rar", "7z", "tar", "gz", "bz2",

    //database files 
    "xml", "json", "sql", "db",

    //cad files 
    "dwg", "dxf"
];

export default function EncryptForm({ isMobileActive }) {

    // STATE: Carrier & payload metadata
    const [carrierInfo, setCarrierInfo] = useState(null);

    // STATE: Encryption form
    const [encCarrier, setEncCarrier] = useState(null);
    const [encFiles, setEncFiles] = useState([]);
    const [encPassphrase, setEncPassphrase] = useState("");

    const [encFilesError, setEncFilesError] = useState("");
    const [encCarrierError, setEncCarrierError] = useState("");
    const [encMessage, setEncMessage] = useState("");
    const [encLoading, setEncLoading] = useState(false);

    // STATE: UI helpers
    const [showEncClearConfirm, setShowEncClearConfirm] = useState(false);
    const [showEncCarrierFullName, setShowEncCarrierFullName] = useState(false);
    const [expandedFileIndex, setExpandedFileIndex] = useState(null);

    // REFS: File inputs
    const encCarrierInputRef = useRef(null);
    const encFilesInputRef = useRef(null);
    const encAddFilesInputRef = useRef(null);

    // DERIVED VALUES
    const payloadUnit = getCommonPayloadUnit(encFiles);

    const isEncryptFormDirty =
        encCarrier ||
        encFiles.length > 0 ||
        encPassphrase ||
        encMessage ||
        encCarrierError ||
        encFilesError ||
        carrierInfo;

    const valid_payload_extensions = ".jpg, .jpeg, .png, .bmp, .tif, .tiff, .mp4, .mov, .avi, .wmv, .flv, .mkv, .webm, .mp3, .wav, .aac, .flac, .wma, .ogg, .alac, .m4a, .txt, .doc, .docx, .csv, .xls, .xlsx, .pdf, .ppt, .pptx, .rtf, .c, .cpp, .java, .py, .html, .css, .exe, .dll, .msi, .zip, .rar, .7z, .tar, .gz, .bz2, .xml, .json, .sql, .db, .dwg, .dxf"

    // EFFECT: Auto-hide payload error after timeout

    useEffect(() => {
        if (!encFilesError) return;
        const timer = setTimeout(() => { setEncFilesError(""); }, 4000);  // ⏱️ 4 seconds (you can change this)
        return () => clearTimeout(timer);
    }, [encFilesError]);

    // EFFECT : Keyboard shortcuts (Clear & Escape)

    useEffect(() => {
        function handleKeyDown(e) {

            // Ctrl + Shift + E → Clear Encrypt
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
                e.preventDefault();
                if (isEncryptFormDirty && !encLoading) {
                    setShowEncClearConfirm(true);
                }
            }

            // ESC → close any open confirm modal
            if (e.key === "Escape") {
                setShowEncClearConfirm(false);
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isEncryptFormDirty, encLoading]);


    // ======================================================
    // HANDLER: Select carrier image
    // ======================================================

    const handleCarrierSelect = async (file) => {
        setEncCarrier(null);
        setCarrierInfo(null);
        setEncCarrierError("");

        if (!file) return;
        const ext = file.name.split(".").pop().toLowerCase();


        if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
            setEncCarrierError(
                "Unsupported file type. Please select an image (.jpg, .jpeg, .png, .tif, .tiff, .bmp)."
            );

            // Clear file input immediately
            if (encCarrierInputRef.current) {
                encCarrierInputRef.current.value = "";
            }
            return;
        }

        setEncCarrier(file);

        const form = new FormData();
        form.append("carrier_image", file);

        try {
            const res = await axios.post(`${API_BASE}/carrier-info/`, form);
            setCarrierInfo(res.data);
        } catch {
            setCarrierInfo(null);
        }
    }

    // ======================================================
    // HANDLER: Remove carrier
    // ======================================================

    const removeEncCarrier = () => {
        setEncCarrier(null);
        setShowEncCarrierFullName(false);
        setCarrierInfo(null);
        setEncCarrierError("");
        setEncMessage("");
        if (encCarrierInputRef.current) {
            encCarrierInputRef.current.value = "";
        }
    }

    // ======================================================
    // HELPER: Validate & separate payload files
    // ======================================================

    function processPayloadFiles(fileList) {
        const validFiles = [];
        const invalidFiles = [];
        for (const file of fileList) {
            const ext = file.name.split(".").pop().toLowerCase();

            if (ALLOWED_PAYLOAD_EXTENSIONS.includes(ext)) {
                validFiles.push(file);
            } else {
                invalidFiles.push(file.name);
            }
        }

        return {
            validFiles,
            invalidFiles,
        };
    }

    // ======================================================
    // HELPER: Generate payload error message
    // ======================================================

    function getPayloadErrorMessage(invalidFiles, validFilesCount) {
        if (invalidFiles.length > 0 && validFilesCount > 0) {
            return "Some files were ignored because their format is not supported.";
        }

        if (invalidFiles.length > 0 && validFilesCount === 0) {
            return "Selected file types are not supported. Please choose valid files.";
        }

        return ""; // no error
    }

    // ======================================================
    // HANDLER: Initial payload selection
    // ======================================================

    const handleEncFilesChange = (e) => {
        setEncFiles([]);
        setEncFilesError("");

        const selectedFiles = Array.from(e.target.files);
        const { validFiles, invalidFiles } = processPayloadFiles(selectedFiles);

        setEncFiles(validFiles);

        const errorMsg = getPayloadErrorMessage(invalidFiles, validFiles.length);
        if (errorMsg) setEncFilesError(errorMsg);

        e.target.value = "";
    }

    // ======================================================
    // HANDLER: Add more payload files
    // ======================================================

    const handleAddEncFiles = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const { validFiles, invalidFiles } = processPayloadFiles(selectedFiles);

        setEncFiles(prev => {
            const map = new Map(
                prev.map(f => [`${f.name}_${f.size}`, f])
            );

            for (const file of validFiles) {
                const key = `${file.name}_${file.size}`;
                if (!map.has(key)) map.set(key, file);
            }

            return Array.from(map.values());
        });

        const errorMsg = getPayloadErrorMessage(invalidFiles, validFiles.length);
        if (errorMsg) setEncFilesError(errorMsg);

        e.target.value = "";
    }

    // ======================================================
    // HANDLER: Remove payload file
    // ======================================================

    const removeEncFile = (index) => {
        setEncFiles(prev => {
            const updated_list = prev.filter((_, i) => i !== index);

            if (updated_list.length === 0) {
                setEncFiles([]);
                setEncFilesError("");
                if (encFilesInputRef.current) encFilesInputRef.current.value = "";
                if (encAddFilesInputRef.current) encAddFilesInputRef.current.value = "";
            }

            return updated_list;
        });
    };


    // ======================================================
    // UTILITY: Payload size
    // ======================================================

    function getTotalPayloadSize(files) {
        return files.reduce((sum, f) => sum + f.size, 0);
    }

    // ======================================================
    // HANDLER: Encryption submit
    // ======================================================

    const handleEncrypt = async (e) => {
        e.preventDefault();
        setEncMessage("");
        if (!encCarrier) { setEncMessage("Please select a carrier image."); return; }
        if (encFiles.length === 0) { setEncMessage("Please select at least one file to embed."); return; }
        if (!encPassphrase) { setEncMessage("Please enter a encryption key."); return; }

        setEncLoading(true);
        try {
            const form = new FormData();
            form.append("carrier_image", encCarrier);
            encFiles.forEach(f => form.append("files", f));
            form.append("passphrase", encPassphrase);

            // 1️⃣ Ask backend to create stego and return its URL

            const res = await axios.post(`${API_BASE}/encrypt/`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const downloadUrl = res.data.download_url || res.data.url;
            if (!downloadUrl) {
                setEncMessage("Encryption succeeded but no download URL returned by server.");
                return;
            }

            setEncMessage("Encryption successful — preparing download...");


            // 2️⃣ Fetch the file as blob and trigger browser Save / Open dialog

            const dl = await downloadFileFromUrl(downloadUrl, `${encCarrier?.name || "image"}`);
            if (dl.ok) {
                setEncMessage(`Encryption successful — saved as ${dl.filename}`);
            } else {
                setEncMessage("Encryption succeeded but automatic download failed. Use this link: " + downloadUrl);
            }
        } catch (err) {
            console.error("Encrypt error:", err);
            setEncMessage(err.response?.data?.error || "Encryption failed: " + (err.message || ""));
        } finally {
            setEncLoading(false);
        }
    }

    // ======================================================
    // Helper: download a remote file URL by fetching it as a blob (shows browser save/open dialog)
    // ======================================================

    async function downloadFileFromUrl(downloadUrl, defaultName = "stego_file") {
        try {
            // GET as blob
            const resp = await axios.get(downloadUrl, { responseType: "blob" });
            const blob = resp.data;

            // determine filename from Content-Disposition header if present
            let filename = defaultName;
            const cd = resp.headers && resp.headers["content-disposition"];
            if (cd) {
                const match = cd.match(/filename\*?=(?:UTF-8'')?["']?([^;"']+)["']?/i);
                if (match && match[1]) {
                    try { filename = decodeURIComponent(match[1]); } catch (_e) { filename = match[1]; }
                }
            } else {
                // fallback: extract last path segment from URL
                try {
                    const u = new URL(downloadUrl, window.location.href);
                    const parts = u.pathname.split("/");
                    const last = parts[parts.length - 1];
                    if (last) filename = decodeURIComponent(last);
                } catch (_e) {
                    // ignore
                }
            }

            // create object URL and trigger download (browser will show Open/Save dialog)
            const objectUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = objectUrl;
            a.download = filename; // setting download attribute triggers "Save as"
            document.body.appendChild(a);
            a.click();
            a.remove();
            // release
            setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
            return { ok: true, filename };
        } catch (err) {
            console.error("downloadFileFromUrl error:", err);
            return { ok: false, error: err };
        }
    }

    // ======================================================
    // CLEAR FORM LOGIC
    // ======================================================

    function requestEncryptClear() {
        if (encLoading || !isEncryptFormDirty) return;
        setShowEncClearConfirm(true);
    }

    function clearEncryptForm() {
        if (encLoading) return; // extra safety

        // React state
        setEncCarrier(null);
        setEncFiles([]);
        setEncPassphrase("");
        setEncMessage("");
        setEncCarrierError("");
        setEncFilesError("");
        setCarrierInfo(null);
        setEncLoading(false);

        // DOM file inputs
        if (encCarrierInputRef.current) {
            encCarrierInputRef.current.value = "";
        }
        if (encFilesInputRef.current) {
            encFilesInputRef.current.value = "";
        }
        setShowEncClearConfirm(false);
    }

    return (
        /* ======================================================
        MOBILE / DESKTOP VISIBILITY WRAPPER
        - Mobile: controlled via isMobileActive
        - Desktop: always visible (md:block)
        ====================================================== */
        <div className={`${isMobileActive ? "block" : "hidden"} md:block md:h-full`}>
            <div className="relative edp-panel-base edp-panel-encrypt rounded-2xl overflow-hidden p-5 sm:p-7 shadow-[0_15px_45px_rgba(0,0,0,0.65)] md:h-full flex flex-col">

                {/* 1. TRAVELING PERIMETER NEON BORDER BEAM */}
                <svg className="ctc-border-svg" aria-hidden="true">
                    <defs>
                        <linearGradient id="edpEncGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00D9F5">
                                <animate attributeName="stop-color" values="#00D9F5;#398BFF;#06B6D4;#00D9F5" dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="50%" stopColor="#398BFF">
                                <animate attributeName="stop-color" values="#398BFF;#06B6D4;#00D9F5;#398BFF" dur="6s" repeatCount="indefinite" />
                            </stop>
                            <stop offset="100%" stopColor="#06B6D4">
                                <animate attributeName="stop-color" values="#06B6D4;#00D9F5;#398BFF;#06B6D4" dur="6s" repeatCount="indefinite" />
                            </stop>
                        </linearGradient>
                        <filter id="edpEncGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="16" pathLength="1000" className="etc-border-track" />
                    <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="16" pathLength="1000" fill="none" stroke="url(#edpEncGrad)" strokeWidth="2.5" strokeLinecap="round" className="edp-beam-encrypt" filter="url(#edpEncGlow)" />
                </svg>

                {/* 2. CYBERNETIC CORNER BRACKETS */}
                <div className="ctc-corner-bracket top-left" aria-hidden="true" />
                <div className="ctc-corner-bracket top-right" aria-hidden="true" />
                <div className="ctc-corner-bracket bottom-left" aria-hidden="true" />
                <div className="ctc-corner-bracket bottom-right" aria-hidden="true" />

                {/* 3. CYBERSECURITY CONTAINER BACKGROUND ARTWORK */}
                <EncryptContainerArtwork />

                {/* ==================== ENCRYPTION FORM ======================= */}
                <form
                    onSubmit={handleEncrypt}
                    className="relative z-10 space-y-4 text-slate-200"
                >
                    {/* FORM HEADER */}
                    <div className="relative flex items-center mb-2">
                        {/* CENTER: Heading & Holographic Icon */}
                        <div className="mx-auto text-center flex items-center justify-center gap-3">
                            <div className="edp-icon-aperture edp-aperture-cyan flex items-center justify-center">
                                <img
                                    src={picryptLogo}
                                    alt="PICRYPT"
                                    className="w-5 h-5 object-contain"
                                />
                            </div>
                            <h3 className="font-bold text-lg text-white tracking-wide">
                                Encrypt Data
                            </h3>
                        </div>

                        {/* RIGHT: Clear button */}
                        <div className="absolute right-0">
                            <button
                                type="button"
                                onClick={requestEncryptClear}
                                disabled={encLoading || !isEncryptFormDirty}
                                title="Ctrl + Shift + E"
                                className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                                    encLoading || !isEncryptFormDirty
                                        ? "border-slate-800 bg-[#0d1627]/60 text-slate-600 cursor-not-allowed"
                                        : "border-cyan-500/30 bg-[#132038] hover:bg-[#1a2d50] text-cyan-300 hover:text-white shadow-sm cursor-pointer"
                                }`}
                            >
                                ♻️ Clear
                            </button>
                        </div>
                    </div>

                    {/* CLEAR CONFIRMATION MODAL */}
                    {showEncClearConfirm && (
                        <ConfirmModal
                            message="🧹 Clear encryption form ?"
                            onCancel={() => setShowEncClearConfirm(false)}
                            onConfirm={clearEncryptForm}
                        />
                    )}

                    {/* ============ CARRIER IMAGE INPUT ============== */}
                    <label className="block mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                        Carrier Image
                    </label>

                    <input
                        ref={encCarrierInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.tif,.tiff,.bmp"
                        onChange={e => handleCarrierSelect(e.target.files[0] || null)}
                        className="hidden"
                    />

                    <div className="flex items-start gap-2 w-full">
                        <button
                            type="button"
                            onClick={() => encCarrierInputRef.current?.click()}
                            className="px-4 py-2.5 bg-[#14233e] hover:bg-[#1b3055] text-cyan-300 hover:text-white border border-cyan-500/35 rounded-lg text-sm font-medium shrink-0 transition-colors cursor-pointer"
                        >
                            Browse
                        </button>

                        <div className="flex items-start border border-cyan-500/25 rounded-lg px-3 py-2.5 flex-1 min-w-0 bg-[#0a1324]/80 hover:border-cyan-500/40 transition-colors">
                            {!encCarrier ? (
                                <span className="text-sm text-slate-500">
                                    Choose carrier image
                                </span>
                            ) : (
                                <>
                                    <span
                                        className={`text-xs text-slate-200 cursor-pointer ${showEncCarrierFullName
                                            ? "whitespace-normal break-all"
                                            : "truncate flex-1"
                                            }`}
                                        title={encCarrier.name}
                                        onClick={() => setShowEncCarrierFullName(v => !v)}
                                    >
                                        {encCarrier.name}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={removeEncCarrier}
                                        className="ml-auto pl-3 text-cyan-400 hover:text-red-400 shrink-0 text-sm transition-colors cursor-pointer"
                                        title="Remove carrier"
                                    >
                                        ✖
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Carrier validation error */}
                    {encCarrierError && (
                        <div className="text-xs text-red-400 mt-1 bg-red-950/40 border border-red-500/30 p-2 rounded-lg">
                            {encCarrierError}
                        </div>
                    )}

                    {/* =========== CARRIER METADATA DISPLAY ============ */}
                    {carrierInfo && (
                        <div className="text-xs bg-[#0b1426]/90 p-3.5 border border-cyan-500/30 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 text-slate-300 shadow-inner">
                            <p className="order-1 md:order-1">
                                <b className="text-cyan-300">Carrier :</b>{" "}
                                {carrierInfo.carrier_ext.toUpperCase()} |{" "}
                                {formatSize(carrierInfo.file_size_bytes)}
                            </p>

                            {carrierInfo.used_bytes > 0 && (
                                <p className="order-3 md:order-2">
                                    <b className="text-cyan-300">Used Capacity :</b>{" "}
                                    {formatSize(carrierInfo.used_bytes)}
                                </p>
                            )}

                            {carrierInfo.capacity_bytes && (
                                <p className="order-2 md:order-3">
                                    <b className="text-cyan-300">Capacity :</b>{" "}
                                    {formatSize(carrierInfo.capacity_bytes)}
                                </p>
                            )}

                            {carrierInfo.used_bytes > 0 && (
                                <p className="order-4 md:order-4">
                                    <b className="text-cyan-300">Remaining Capacity :</b>{" "}
                                    {formatSize(carrierInfo.remaining_capacity)}
                                </p>
                            )}

                            {!carrierInfo.capacity_bytes && (
                                <p className="order-2 md:order-2 text-xs text-slate-400 text-left sm:text-left md:col-span-2">
                                    <b className="text-cyan-300">Note :</b> JPG / JPEG images support large payloads using APP-based embedding.
                                </p>
                            )}
                        </div>
                    )}

                    {/* =========== PAYLOAD FILES SELECTION ============= */}
                    <label className="flex justify-between items-center mt-2 mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                        Files to embed
                    </label>

                    <input
                        ref={encFilesInputRef}
                        type="file"
                        accept={valid_payload_extensions}
                        multiple
                        onChange={handleEncFilesChange}
                        className="hidden"
                    />

                    <input
                        ref={encAddFilesInputRef}
                        type="file"
                        accept={valid_payload_extensions}
                        multiple
                        onChange={handleAddEncFiles}
                        className="hidden"
                    />

                    <div className="flex items-center gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => encFilesInputRef.current?.click()}
                            className="px-4 py-2.5 bg-[#14233e] hover:bg-[#1b3055] text-cyan-300 hover:text-white border border-cyan-500/35 rounded-lg text-sm font-medium shrink-0 transition-colors cursor-pointer"
                        >
                            Choose Files
                        </button>

                        {encFiles.length > 0 && (
                            <button
                                type="button"
                                onClick={() => encAddFilesInputRef.current?.click()}
                                className="px-3 py-2 border border-blue-500/50 text-blue-300 hover:text-white hover:bg-blue-900/30 rounded-lg text-sm transition-colors shrink-0 cursor-pointer"
                                title="Add more files"
                            >
                                + Add
                            </button>
                        )}

                        <span className="text-xs text-slate-400 truncate">
                            {encFiles.length > 0
                                ? `${encFiles.length} file${encFiles.length > 1 ? "s" : ""} selected`
                                : "Select files to embed"}
                        </span>
                    </div>

                    {/* Payload files error */}
                    {encFilesError && (
                        <div className="text-xs text-red-400 mt-1 bg-red-950/40 border border-red-500/30 p-2 rounded-lg">
                            {encFilesError}
                        </div>
                    )}

                    {/* Payload files List */}
                    {encFiles.length > 0 && (
                        <div className="text-xs bg-[#0b1426]/90 border border-cyan-500/25 p-3.5 rounded-xl space-y-2 text-slate-300 shadow-inner">
                            <b className="text-cyan-300">Payload Files : </b>
                            <div className="mt-2 rounded-lg p-2 bg-[#070e1c] border border-slate-800">
                                <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                                    {encFiles.map((file, index) => (
                                        <li
                                            key={`${file.name}_${file.size}`}
                                            className="flex items-center gap-2 px-3 py-2 border border-slate-700/60 rounded-md bg-[#0a1324] hover:border-cyan-500/40 transition-colors"
                                        >
                                            <span className="text-slate-500 w-5 text-right font-mono">
                                                {index + 1}.
                                            </span>

                                            <span
                                                className={`cursor-pointer text-slate-200 ${expandedFileIndex === index
                                                    ? "whitespace-normal break-all"
                                                    : "truncate flex-1"
                                                    }`}
                                                title={file.name}
                                                onClick={() =>
                                                    setExpandedFileIndex(
                                                        expandedFileIndex === index ? null : index
                                                    )
                                                }
                                            >
                                                {file.name}
                                            </span>

                                            <span className="w-19 sm:w-24 text-left text-slate-400 font-mono text-[11px]">
                                                {formatSizeWithUnit(file.size, payloadUnit)}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={() => removeEncFile(index)}
                                                className="text-cyan-400 hover:text-red-400 shrink-0 text-sm transition-colors cursor-pointer"
                                                title="Remove file"
                                            >
                                                ✖
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <p className="pt-1">
                                <b className="text-cyan-300">Payload size :</b>{" "}
                                {formatSize(getTotalPayloadSize(encFiles))}
                            </p>

                            {encFiles.length > 0 && !encCarrier && (
                                <p className="text-amber-400 text-xs font-semibold">
                                    ⚠️ Select a carrier file to check encryption feasibility
                                </p>
                            )}

                            {encFiles.length > 0 && encCarrier && (
                                <p className="font-semibold text-left pt-1">
                                    {carrierInfo?.capacity_bytes ? (
                                        getTotalPayloadSize(encFiles) <= carrierInfo.remaining_capacity ? (
                                            <span className="text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-md text-xs inline-block">
                                                ✔ Encryption possible ( LSB-based embedding )
                                            </span>
                                        ) : (
                                            <span className="text-red-400 bg-red-950/70 border border-red-500/40 px-2.5 py-1 rounded-md text-xs inline-block">
                                                ✖ Payload exceeds carrier available capacity
                                            </span>
                                        )
                                    ) : (
                                        <span className="text-emerald-300 bg-emerald-950/70 border border-emerald-500/40 px-2.5 py-1 rounded-md text-xs inline-block">
                                            ✔ Encryption possible ( APP-based embedding )
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    )}

                    {/* ---------- Encryption Key input ----------*/}
                    <label className="block mt-4 mb-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                        Encryption Key
                    </label>

                    <div className="relative">
                        <input
                            type={"password"}
                            value={encPassphrase}
                            onChange={e => setEncPassphrase(e.target.value)}
                            placeholder="Enter encryption key"
                            className="border border-cyan-500/30 rounded-lg px-3.5 py-2.5 w-full pr-10 text-sm bg-[#0a1324]/90 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-cyan-400 transition-all font-mono"
                        />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                        Keep this key secure. It is required for decryption.
                    </p>

                    {/* =========== Encrypt Button ============= */}
                    <button
                        type="submit"
                        disabled={encLoading}
                        className={`mt-4 px-4 py-3.5 w-full rounded-xl text-sm font-bold tracking-wide uppercase text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:to-cyan-400 shadow-[0_0_20px_rgba(0,217,245,0.35)] hover:shadow-[0_0_30px_rgba(0,217,245,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
                    >
                        {encLoading ? (
                            <>
                                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin inline-block" />
                                <span>Encrypting…</span>
                            </>
                        ) : (
                            <span>🔒 Encrypt</span>
                        )}
                    </button>

                    {encMessage && (
                        <div className={`mt-3 p-3 rounded-xl text-xs border flex items-center gap-2 shadow-inner ${
                            encMessage.includes("failed") || encMessage.includes("error")
                                ? "border-red-500/40 bg-red-950/40 text-red-200"
                                : "border-cyan-500/30 bg-[#091122]/90 text-cyan-200"
                        }`}>
                            {encMessage}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
