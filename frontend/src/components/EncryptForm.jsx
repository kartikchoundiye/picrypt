// frontend/src/components/EncryptForm.jsx

// • Handles full encryption workflow
// • Carrier image selection + validation
// • Payload file selection + management
// • Capacity feasibility check
// • Encryption API call + secure download
// • Fully responsive + mobile friendly

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

/* =========================== Utils & Assets =========================== */

import {
    formatSize,
    getCommonPayloadUnit,
    formatSizeWithUnit
} from "../utils/sizeFormat";

import picryptLogo from "../assets/picrypt_logo.png";
import ConfirmModal from "./ConfirmModal";


/* =========================== Backend API base (supports localhost, LAN & prod) ==================== */

const API_BASE = (() => {
    if (window.location.hostname === "localhost") return "http://localhost:8000/api/steghide";
    if (window.location.hostname.startsWith("192.168.")) return `http://${window.location.hostname}:8000/api/steghide`;
    // TODO: replace with actual backend domain after deployment
    return "https://your-production-backend.com/api/steghide";
})();


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
                    try { filename = decodeURIComponent(match[1]); } catch (e) { filename = match[1]; }
                }
            } else {
                // fallback: extract last path segment from URL
                try {
                    const u = new URL(downloadUrl, window.location.href);
                    const parts = u.pathname.split("/");
                    const last = parts[parts.length - 1];
                    if (last) filename = decodeURIComponent(last);
                } catch (e) {
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
        <div className={`${isMobileActive ? "block" : "hidden"} md:block`}>
            <div className="relative">

                {/* =================== LEFT GRADIENT ACCENT BAR (Visual identity)================= */}
                <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-cyan-400 to-blue-400" />
                <div className="pl-4">

                    {/* ==================== ENCRYPTION FORM CONTAINER ======================= */}
                    <form
                        onSubmit={handleEncrypt}
                        className="rounded-2xl bg-gradient-to-b from-white to-cyan-50/60 backdrop-blur border border-cyan-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 space-y-4"
                    >
                        {/* ======================================================
                            FORM HEADER
                            - Centered title
                            - Right-aligned clear button
                        ====================================================== */}
                        <div className="relative flex items-center">

                            {/* CENTER: Heading */}

                            <div className="mx-auto text-center">
                                <h3 className="flex items-center justify-center gap-2 font-semibold text-gray-800">
                                    <img
                                        src={picryptLogo}
                                        alt="PICRYPT"
                                        className="w-6 h-6 object-contain"
                                    />
                                    <span>Encrypt Data</span>
                                </h3>
                            </div>

                            {/* RIGHT: Clear button */}

                            <div className="absolute right-0">
                                <button
                                    type="button"
                                    onClick={requestEncryptClear}
                                    disabled={encLoading || !isEncryptFormDirty}
                                    title="Ctrl + Shift + E"
                                    className={`text-sm px-2 py-1 rounded ${encLoading || !isEncryptFormDirty
                                        ? "bg-gray-300 cursor-not-allowed text-gray-600"
                                        : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    ♻️ Clear
                                </button>
                            </div>
                        </div>

                        {/* ===================== CLEAR CONFIRMATION MODAL =============== */}

                        {showEncClearConfirm && (
                            <ConfirmModal
                                message="🧹 Clear encryption form ?"
                                onCancel={() => setShowEncClearConfirm(false)}
                                onConfirm={clearEncryptForm}
                            />
                        )}

                        {/* ============ carrier image input ============== */}

                        <label className="block mb-1">Carrier Image</label>

                        {/* Hidden carrier file input */}

                        <input
                            ref={encCarrierInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.tif,.tiff,.bmp"
                            onChange={e => handleCarrierSelect(e.target.files[0] || null)}
                            className="hidden"
                        />

                        {/* Carrier file selector UI */}

                        <div className="flex items-start gap-2 w-full">

                            {/* Carrier : Browse button */}

                            <button
                                type="button"
                                onClick={() => encCarrierInputRef.current?.click()}
                                className="px-4 py-2.5 bg-gray-200 rounded-md hover:bg-gray-300 text-sm shrink-0"
                            >
                                Browse
                            </button>

                            <div className="flex items-start border border-gray-300 rounded-md px-3 py-2.5 flex-1 min-w-0 bg-gray-50 hover:bg-gray-100 transition-colors">

                                {!encCarrier ? (
                                    <span className="text-sm text-gray-400">
                                        Choose carrier image
                                    </span>
                                ) : (
                                    <>
                                        <span
                                            className={`text-xs text-gray-700 cursor-pointer ${showEncCarrierFullName
                                                ? "whitespace-normal break-all"
                                                : "truncate flex-1"
                                                }`}
                                            title={encCarrier.name} // Carrier full file name on desktop by hover
                                            onClick={() => setShowEncCarrierFullName(v => !v)} // Carrier full file name on mobile by click
                                        >
                                            {encCarrier.name}
                                        </span>

                                        {/* Carrier : Remove button */}

                                        <button
                                            type="button"
                                            onClick={removeEncCarrier}
                                            className="ml-auto pl-3 text-green-500 hover:text-red-600 shrink-0 items-start"
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
                            <div className="text-sm text-red-600 mt-1">
                                {encCarrierError}
                            </div>
                        )}

                        {/* =========== CARRIER METADATA DISPLAY ============ */}

                        {carrierInfo && (
                            <div className="text-sm bg-gradient-to-r from-cyan-50 to-white p-3 border border-cyan-200 rounded-md grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">

                                {/* Carrier info */}
                                <p className="order-1 md:order-1">
                                    <b>Carrier :</b>{" "}
                                    {carrierInfo.carrier_ext.toUpperCase()} |{" "}
                                    {formatSize(carrierInfo.file_size_bytes)}
                                </p>

                                {/* Used capacity */}
                                {carrierInfo.used_bytes > 0 && (
                                    <p className="order-3 md:order-2">
                                        <b>Used Capacity :</b>{" "}
                                        {formatSize(carrierInfo.used_bytes)}
                                    </p>
                                )}

                                {/* Total capacity */}
                                {carrierInfo.capacity_bytes && (
                                    <p className="order-2 md:order-3">
                                        <b>Capacity :</b>{" "}
                                        {formatSize(carrierInfo.capacity_bytes)}
                                    </p>
                                )}

                                {/* Remaining capacity */}
                                {carrierInfo.used_bytes > 0 && (
                                    <p className="order-4 md:order-4">
                                        <b>Remaining Capacity :</b>{" "}
                                        {formatSize(carrierInfo.remaining_capacity)}
                                    </p>
                                )}

                                {/* APP-based note */}
                                {!carrierInfo.capacity_bytes && (
                                    <p className="order-2 md:order-2 text-xs text-gray-600 text-left sm:text-left md:col-span-2">
                                        <b>Note :</b> JPG / JPEG images support large payloads using APP-based embedding.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* =========== Payload files selection ============= */}

                        <label className="flex justify-between items-center mt-2 mb-1">Files to embed</label>

                        {/* Hidden initial file input */}

                        <input
                            ref={encFilesInputRef}
                            type="file"
                            accept={valid_payload_extensions}
                            multiple
                            onChange={handleEncFilesChange}
                            className="hidden"
                        />

                        {/* Hidden file input for added payload files */}

                        <input
                            ref={encAddFilesInputRef}
                            type="file"
                            accept={valid_payload_extensions}
                            multiple
                            onChange={handleAddEncFiles}
                            className="hidden"
                        />


                        {/* Payload files : Action buttons */}

                        <div className="flex items-center gap-3 w-full">
                            <button
                                type="button"
                                onClick={() => encFilesInputRef.current?.click()}
                                className="px-4 py-2.5 bg-gray-200 rounded-md hover:bg-gray-300 text-sm shrink-0"
                            >
                                Choose Files
                            </button>

                            {/* Conditional : Add more button */}

                            {encFiles.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => encAddFilesInputRef.current?.click()}
                                    className="px-3 py-2 border border-blue-400 text-blue-700 rounded-md text-sm hover:bg-blue-50 transition-colors shrink-0"
                                    title="Add more files"
                                >
                                    + Add
                                </button>
                            )}

                            <span className="text-sm text-gray-600 truncate">
                                {encFiles.length > 0
                                    ? `${encFiles.length} file${encFiles.length > 1 ? "s" : ""} selected`
                                    : "Select files to embed"}
                            </span>
                        </div>



                        {/* Payload files error */}

                        {encFilesError && (
                            <div className="text-sm text-red-600 mt-1">
                                {encFilesError}
                            </div>
                        )}

                        {/* Payload files List */}

                        {encFiles.length > 0 && (
                            <div className="text-sm bg-gradient-to-b from-white to-slate-50 border border-slate-200 p-3 rounded-md space-y-2">
                                <b>Payload Files : </b>
                                <div className="mt-3 rounded-md p-2 bg-white">
                                    <ul className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                                        {encFiles.map((file, index) => (
                                            <li
                                                key={`${file.name}_${file.size}`}
                                                className="flex items-start gap-2 px-3 py-2 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors"
                                            >
                                                {/* Payload File : index + filename */}
                                                <div className="flex items-start gap-2 min-w-0 flex-1">
                                                    <span className="text-gray-500 w-5 text-right">
                                                        {index + 1}.
                                                    </span>

                                                    <span
                                                        className={`cursor-pointer ${expandedFileIndex === index
                                                            ? "whitespace-normal break-all"
                                                            : "truncate flex-1"
                                                            }`}
                                                        title={file.name} // full file name on desktop by hovering
                                                        onClick={() =>
                                                            setExpandedFileIndex(
                                                                expandedFileIndex === index ? null : index
                                                            )
                                                        }
                                                    >
                                                        {file.name} {/* Full file name on mobile on click */}
                                                    </span>

                                                </div>

                                                {/* MIDDLE: size (fixed width ) */}
                                                <span className="w-19 sm:w-24 text-left text-gray-600">
                                                    {formatSizeWithUnit(file.size, payloadUnit)}
                                                </span>

                                                {/* Payload File : remove button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeEncFile(index)}
                                                    className=" text-green-500 hover:text-red-600 shrink-0 leading-none text-sm transition-colors"
                                                    title="Remove file"
                                                >
                                                    ✖
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Total Payload size */}
                                <p className="pt-1">
                                    <b>Payload size :</b>{" "}
                                    {formatSize(getTotalPayloadSize(encFiles))}
                                </p>

                                {/* Hint: payload selected but no carrier */}
                                {encFiles.length > 0 && !encCarrier && (
                                    <p className=" text-red-500 font-semibold text-left sm:text-left">
                                        Select a carrier file to check encryption feasibility
                                    </p>
                                )}

                                {/* Encryption status */}
                                {encFiles.length > 0 && encCarrier && (
                                    <p className="font-semibold text-left sm:text-left px-2 py-1 rounded-md inline-block">

                                        {carrierInfo?.capacity_bytes ? (
                                            getTotalPayloadSize(encFiles) <= carrierInfo.remaining_capacity ? (
                                                <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md">
                                                    ✔ Encryption possible ( LSB-based embedding )
                                                </span>
                                            ) : (
                                                <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">
                                                    ✖ Payload exceeds carrier available capacity
                                                </span>
                                            )
                                        ) : (
                                            <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md">
                                                ✔ Encryption possible ( APP-based embedding )
                                            </span>
                                        )}
                                    </p>
                                )}
                            </div>
                        )}

                        {/* ---------- Encryption Key input ----------*/}

                        <label className="block mt-4 mb-1 text-sm font-medium">
                            Encryption Key
                        </label>

                        <div className="relative">
                            <input
                                type={"password"}
                                value={encPassphrase}
                                onChange={e => setEncPassphrase(e.target.value)}
                                placeholder="Enter encryption key"
                                className="border border-gray-300 rounded-md px-3 py-2.5 w-full pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Keep this key secure. It is required for decryption.
                        </p>

                        {/* =========== Encrypt Button ============= */}

                        <button
                            type="submit"
                            disabled={encLoading}
                            className={`mt-3 px-4 py-2.5 w-full rounded-md text-sm text-white ${encLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 "}`}
                        >
                            {encLoading ? "Encrypting…" : "Encrypt"}
                        </button>

                        {encMessage && <div className="mt-3 p-2 bg-gray-50 text-sm rounded">{encMessage}</div>}

                    </form>
                </div>
            </div>
        </div>
    );
}

