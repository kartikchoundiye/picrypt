// frontend/src/modules/EncryptDecrypt.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  formatSize,
  getCommonPayloadUnit,
  formatSizeWithUnit
} from "../utils/sizeFormat";

import { motion } from "framer-motion";
import picryptLogo from "../assets/picrypt_logo.png";


const API_BASE = (() => {
  if (window.location.hostname === "localhost") return "http://localhost:8000/api/steghide";
  if (window.location.hostname.startsWith("192.168.")) return `http://${window.location.hostname}:8000/api/steghide`;
  // TODO: replace with actual backend domain after deployment
  return "https://your-production-backend.com/api/steghide";
})();

export default function EncryptDecrypt() {
  const [carrierInfo, setCarrierInfo] = useState(null);

  // ENCRYPT form state (completely independent)
  const [encCarrier, setEncCarrier] = useState(null);
  const [encFiles, setEncFiles] = useState([]);
  const [encFilesError, setEncFilesError] = useState("");
  const [encPassphrase, setEncPassphrase] = useState("");
  const [encLoading, setEncLoading] = useState(false);
  const [encMessage, setEncMessage] = useState("");
  const [encCarrierError, setEncCarrierError] = useState("");
  const encCarrierInputRef = useRef(null);
  const encFilesInputRef = useRef(null);
  const encAddFilesInputRef = useRef(null);

  // DECRYPT form state (completely independent)
  const [decCarrier, setDecCarrier] = useState(null);
  const [decPassphrase, setDecPassphrase] = useState("");
  const [decLoading, setDecLoading] = useState(false);
  const [decMessage, setDecMessage] = useState("");
  const [decCarrierError, setDecCarrierError] = useState("");
  const decCarrierInputRef = useRef(null);

  // Confirm modals
  const [showEncClearConfirm, setShowEncClearConfirm] = useState(false);
  const [showDecClearConfirm, setShowDecClearConfirm] = useState(false);

  const [expandedFileIndex, setExpandedFileIndex] = useState(null);
  const [showEncCarrierFullName, setShowEncCarrierFullName] = useState(false);
  const [showDecCarrierFullName, setShowDecCarrierFullName] = useState(false);

  const payloadUnit = getCommonPayloadUnit(encFiles);
  const isEncryptFormDirty =
    encCarrier ||
    encFiles.length > 0 ||
    encPassphrase ||
    encMessage ||
    encCarrierError ||
    encFilesError ||
    carrierInfo;

  const isDecryptFormDirty =
    decCarrier ||
    decPassphrase ||
    decMessage ||
    decCarrierError;

  useEffect(() => {
    if (!encFilesError) return;

    const timer = setTimeout(() => {
      setEncFilesError("");
    }, 4000); // ⏱️ 4 seconds (you can change this)

    return () => clearTimeout(timer);
  }, [encFilesError]);


  function handleEncFilesChange(e) {
    setEncFiles([]);
    setEncFilesError("");

    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    const invalidFiles = [];

    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop().toLowerCase();

      if (ALLOWED_PAYLOAD_EXTENSIONS.includes(ext)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    }

    const acceptedFiles = validFiles
    setEncFiles(acceptedFiles);

    // smart professional messages
    if (invalidFiles.length > 0 && acceptedFiles.length > 0) {
      setEncFilesError(
        "Some files were ignored because their format is not supported ."
      );
    } else if (invalidFiles.length > 0 && acceptedFiles.length === 0) {
      setEncFilesError(
        "Selected file types are not supported . Please choose valid files ."
      );
    }

    // reset input so same file can be re-selected
    e.target.value = "";
  }

  function handleAddEncFiles(e) {
    const selectedFiles = Array.from(e.target.files);
    const added_validFiles = [];
    const added_invalidFiles = [];

    for (const file of selectedFiles) {
      const ext = file.name.split(".").pop().toLowerCase();

      if (ALLOWED_PAYLOAD_EXTENSIONS.includes(ext)) {
        added_validFiles.push(file);
      } else {
        added_invalidFiles.push(file.name);
      }
    }

    const added_acceptedFiles = added_validFiles
    setEncFiles(prev => {
      const map = new Map(
        prev.map(f => [`${f.name}_${f.size}`, f])
      );

      for (const f of added_acceptedFiles) {
        const key = `${f.name}_${f.size}`;
        if (!map.has(key)) map.set(key, f);
      }

      return Array.from(map.values());
    });

    // smart professional messages
    if (added_invalidFiles.length > 0 && added_acceptedFiles.length > 0) {
      setEncFilesError(
        "Some files were ignored because their format is not supported ."
      );
    } else if (added_invalidFiles.length > 0 && added_acceptedFiles.length === 0) {
      setEncFilesError(
        "Selected file types are not supported . Please choose valid files ."
      );
    }

    // reset input so same file can be re-selected
    e.target.value = "";
  }

  function removeEncFile(index) {
    setEncFiles(prev => prev.filter((_, i) => i !== index));
    if (encFiles.length === 0) {
      setEncFiles([]);
      setEncFilesError("");
      if (encFilesInputRef.current || encAddFilesInputRef.current) {
        encFilesInputRef.current.value = "";
        encAddFilesInputRef.current.value = "";
      }
    }
  }

  function getTotalPayloadSize(files) {
    return files.reduce((sum, f) => sum + f.size, 0);
  }

  // helper: download a remote file URL by fetching it as a blob (shows browser save/open dialog)
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

  async function handleCarrierSelect(file) {
    setEncCarrier(null);
    setCarrierInfo(null);
    setEncCarrierError("");

    if (!file) return;
    const ext = file.name.split(".").pop().toLowerCase();


    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      // ❌ STRICT BLOCK
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

  function removeEncCarrier() {
    setEncCarrier(null);
    setShowEncCarrierFullName(false);
    setCarrierInfo(null);
    setEncCarrierError("");
    if (encCarrierInputRef.current) {
      encCarrierInputRef.current.value = "";
    }
  }

  function handleDecCarrierSelect(file) {
    setDecCarrier(null);
    setDecCarrierError("");

    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();

    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      setDecCarrierError(
        "Unsupported file type. Please select a valid stego image (.jpg, .jpeg, .png, .tif, .tiff, .bmp)."
      );

      // ❌ Strictly clear selection
      if (decCarrierInputRef.current) {
        decCarrierInputRef.current.value = "";
      }
      return;
    }

    // ✅ Valid stego image
    setDecCarrier(file);
  }

  function removeDecCarrier() {
    setDecCarrier(null);
    setShowDecCarrierFullName(false);
    setDecCarrierError("");
    setDecMessage("");
    if (decCarrierInputRef.current) {
      decCarrierInputRef.current.value = "";
    }
  }

  async function handleEncrypt(e) {
    e.preventDefault();
    setEncMessage("");
    if (!encCarrier) { setEncMessage("Please select a carrier image."); return; }
    if (encFiles.length === 0) { setEncMessage("Please select at least one file to embed."); return; }
    if (!encPassphrase) { setEncMessage("Please enter a passphrase."); return; }

    setEncLoading(true);
    try {
      const form = new FormData();
      form.append("carrier_image", encCarrier);
      encFiles.forEach(f => form.append("files", f));
      form.append("passphrase", encPassphrase);

      ///// 1) Ask backend to create stego and return its URL

      const res = await axios.post(`${API_BASE}/encrypt/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const downloadUrl = res.data.download_url || res.data.url;
      if (!downloadUrl) {
        setEncMessage("Encryption succeeded but no download URL returned by server.");
        return;
      }

      setEncMessage("Encryption successful — preparing download...");


      ///// 2) Fetch the file as blob and trigger browser Save / Open dialog

      const dl = await downloadFileFromUrl(downloadUrl, `stego_${encCarrier?.name || "image"}`);
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

  async function handleDecrypt(e) {
    e.preventDefault();
    setDecMessage("");
    if (!decCarrier) { setDecMessage("Please select a stego image for decryption."); return; }
    if (!decPassphrase) { setDecMessage("Please enter the passphrase."); return; }

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

  function requestEncryptClear() {
    if (encLoading || !isEncryptFormDirty) return;
    setShowEncClearConfirm(true);
  }

  function requestDecryptClear() {
    if (decLoading || !isDecryptFormDirty) return;
    setShowDecClearConfirm(true);
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

  useEffect(() => {
    function handleKeyDown(e) {
      // Ctrl + Shift + E → Clear Encrypt
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        if (isEncryptFormDirty && !encLoading) {
          setShowEncClearConfirm(true);
        }
      }

      // Ctrl + Shift + D → Clear Decrypt
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (isDecryptFormDirty && !decLoading) {
          setShowDecClearConfirm(true);
        }
      }

      // ESC → close any open confirm modal
      if (e.key === "Escape") {
        setShowEncClearConfirm(false);
        setShowDecClearConfirm(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEncryptFormDirty, isDecryptFormDirty, encLoading, decLoading]);


  function ConfirmModal({ message, onConfirm, onCancel }) {
    return (
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-5 w-72 text-center border">
          <p className="text-sm mb-4">{message}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={onConfirm}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Clear
            </button>
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 
            bg-gradient-to-br from-slate-100 via-white to-slate-200 
            space-y-14">

      {/* <div className="min-h-screen w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 bg-gradient-to-br from-slate-50 via-white to-slate-100 space-y-12"> */}
      <div className="text-center space-y-3">
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

      <div className="flex justify-center mt-2">
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "6rem", opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="h-1 rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-pink-400"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* -------------------- Encryption Form -----------------------*/}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl bg-gradient-to-b from-cyan-400 to-blue-400" />
          <div className="pl-4">
            <form
              onSubmit={handleEncrypt}
              className="rounded-2xl 
                bg-gradient-to-b from-white to-cyan-50/60
                backdrop-blur border border-cyan-200
                shadow-sm hover:shadow-md transition-shadow
                p-5 sm:p-6 space-y-4"
            >

              {/* <form onSubmit={handleEncrypt} className="rounded-2xl bg-white/90 backdrop-blur border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 sm:p-6 space-y-4"> */}
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

                {/* <div className="flex justify-center mt-2">
                  <div className="h-0.5 w-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full" />
                </div> */}

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

              {showEncClearConfirm && (
                <ConfirmModal
                  message="🧹 Clear encryption form ?"
                  onCancel={() => setShowEncClearConfirm(false)}
                  onConfirm={clearEncryptForm}
                />
              )}

              {/* ---------- carrier image input ----------*/}

              <label className="block mb-1">Carrier Image</label>
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
                        title={encCarrier.name} // desktop hover
                        onClick={() => setShowEncCarrierFullName(v => !v)} // mobile tap
                      >
                        {encCarrier.name}
                      </span>

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

              {encCarrierError && (
                <div className="text-sm text-red-600 mt-1">
                  {encCarrierError}
                </div>
              )}

              {carrierInfo && (
                <div className="text-sm 
                        bg-gradient-to-r from-cyan-50 to-white
                        p-3 border border-cyan-200 rounded-md 
                        grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8">

                  {/* <div className="text-sm bg-white p-3 border rounded-md grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-8"> */}

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

              {/* ---------- embedding files input ----------*/}

              <label className="flex justify-between items-center mt-2 mb-1">Files to embed</label>
              <input
                ref={encFilesInputRef}
                type="file"
                accept=".jpg, .jpeg, .png, .bmp, .tif, .tiff, .mp4, .mov, .avi, .wmv, .flv, .mkv, .webm, .mp3, .wav, .aac, .flac, .wma, .ogg, .alac, .m4a, .txt, .doc, .docx, .csv, .xls, .xlsx, .pdf, .ppt, .pptx, .rtf, .c, .cpp, .java, .py, .html, .css, .exe, .dll, .msi, .zip, .rar, .7z, .tar, .gz, .bz2, .xml, .json, .sql, .db, .dwg, .dxf"
                multiple
                onChange={handleEncFilesChange}
                className="hidden"
              />

              <div className="flex items-center gap-3 w-full">
                <button
                  type="button"
                  onClick={() => encFilesInputRef.current?.click()}
                  className="px-4 py-2.5 bg-gray-200 rounded-md hover:bg-gray-300 text-sm shrink-0"
                >
                  Choose Files
                </button>

                {/* Add more files */}
                {encFiles.length > 0 && (
                  <button
                    type="button"
                    accept=".jpg, .jpeg, .png, .bmp, .tif, .tiff, .mp4, .mov, .avi, .wmv, .flv, .mkv, .webm, .mp3, .wav, .aac, .flac, .wma, .ogg, .alac, .m4a, .txt, .doc, .docx, .csv, .xls, .xlsx, .pdf, .ppt, .pptx, .rtf, .c, .cpp, .java, .py, .html, .css, .exe, .dll, .msi, .zip, .rar, .7z, .tar, .gz, .bz2, .xml, .json, .sql, .db, .dwg, .dxf"
                    multiple
                    onClick={() => encAddFilesInputRef.current?.click()}
                    className="px-3 py-2 border border-blue-400 text-blue-700
                      rounded-md text-sm hover:bg-blue-50
                      transition-colors shrink-0"
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

              <input
                ref={encAddFilesInputRef}
                type="file"
                accept=".jpg, .jpeg, .png, .bmp, .tif, .tiff, .mp4, .mov, .avi, .wmv, .flv, .mkv, .webm, .mp3, .wav, .aac, .flac, .wma, .ogg, .alac, .m4a, .txt, .doc, .docx, .csv, .xls, .xlsx, .pdf, .ppt, .pptx, .rtf, .c, .cpp, .java, .py, .html, .css, .exe, .dll, .msi, .zip, .rar, .7z, .tar, .gz, .bz2, .xml, .json, .sql, .db, .dwg, .dxf"
                multiple
                onChange={handleAddEncFiles}
                className="hidden"
              />

              {encFilesError && (
                <div className="text-sm text-red-600 mt-1">
                  {encFilesError}
                </div>
              )}

              {encFiles.length > 0 && (
                <div className="text-sm 
                        bg-gradient-to-b from-white to-slate-50
                        border border-slate-200
                        p-3 rounded-md space-y-2">

                  {/* <div className="text-sm border bg-white p-3 rounded-md space-y-2"> */}

                  {/* Payload files */}
                  <b>Payload Files : </b>
                  <div className="mt-3 rounded-md p-2 bg-white">
                    <ul className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                      {encFiles.map((file, index) => (
                        <li
                          key={`${file.name}_${file.size}`}
                          className="flex items-start gap-2 px-3 py-2 
                            border border-slate-200 rounded-md 
                            bg-white hover:bg-slate-50 transition-colors"
                        // className="flex items-start gap-2 px-3 py-2 border rounded-md text-sm bg-gray-50"
                        >
                          {/* LEFT: index + filename */}
                          <div className="flex items-start gap-2 min-w-0 flex-1">
                            <span className="text-gray-500 w-5 text-right">
                              {index + 1}.
                            </span>

                            <span
                              className={`cursor-pointer ${expandedFileIndex === index
                                ? "whitespace-normal break-all"
                                : "truncate flex-1"
                                }`}
                              title={file.name} // desktop hover
                              onClick={() =>
                                setExpandedFileIndex(
                                  expandedFileIndex === index ? null : index
                                )
                              }
                            >
                              {file.name}
                            </span>

                          </div>

                          {/* MIDDLE: size (fixed width, left aligned) */}
                          <span className="w-19 sm:w-24 text-left text-gray-600">
                            {formatSizeWithUnit(file.size, payloadUnit)}
                          </span>

                          {/* RIGHT: remove */}
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

                  {/* Payload size */}
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

                      {/* <p className="font-semibold text-left sm:text-left"> */}
                      {carrierInfo?.capacity_bytes ? (
                        getTotalPayloadSize(encFiles) <= carrierInfo.remaining_capacity ? (
                          <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md">
                            {/* <span className="text-green-700"> */}
                            ✔ Encryption possible ( LSB-based embedding )
                          </span>
                        ) : (
                          <span className="text-red-600 bg-red-50 px-2 py-1 rounded-md">
                            {/* <span className="text-red-600"> */}
                            ✖ Payload exceeds carrier available capacity
                          </span>
                        )
                      ) : (
                        <span className="text-green-700 bg-green-50 px-2 py-1 rounded-md">
                          {/* <span className="text-green-700"> */}
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
                  className="border border-gray-300 rounded-md px-3 py-2.5
               w-full pr-10 text-sm
               focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Keep this key secure. It is required for decryption.
              </p>

              <button
                type="submit"
                disabled={encLoading}
                // className={`mt-3 px-4 py-2.5 w-full rounded-md text-sm text-white ${encLoading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
                className={`mt-3 px-4 py-2.5 w-full rounded-md text-sm text-white ${encLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 "}`}
              >
                {encLoading ? "Encrypting…" : "Encrypt"}
              </button>

              {encMessage && <div className="mt-3 p-2 bg-gray-50 text-sm rounded">{encMessage}</div>}

            </form>
          </div>
        </div>


        {/* -------------------------------- Decryption Form ------------------------------ */}

        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl
                  bg-gradient-to-b from-emerald-400 to-emerald-400" />
          <div className="pl-4">
            <form
              onSubmit={handleDecrypt}
              className="rounded-2xl 
                bg-gradient-to-b from-white to-emerald-50/60
                backdrop-blur border border-emerald-200
                shadow-sm hover:shadow-md transition-shadow
                p-5 sm:p-6 space-y-4"
            >

              {/* <form onSubmit={handleDecrypt} className="rounded-2xl bg-white/95 backdrop-blur
                border border-gray-200
                shadow-sm hover:shadow-md transition-shadow
                p-5 sm:p-6 space-y-4"> */}

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
                  className="border border-gray-300 rounded-md px-3 py-2.5
               w-full pr-10 text-sm
               focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Must match the encryption key used earlier.
              </p>

              <button
                type="submit"
                disabled={decLoading}
                // className={`mt-3 px-4 py-2.5 w-full rounded-md text-sm text-white ${decLoading ? "bg-gray-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"}`}
                className={`mt-3 px-4 py-2.5 w-full rounded-md text-sm text-white ${decLoading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"}`}
              >
                {decLoading ? "Decrypting…" : "Decrypt"}
              </button>

              {decMessage && <div className="mt-3 p-2 bg-gray-50 text-sm rounded">{decMessage}</div>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

