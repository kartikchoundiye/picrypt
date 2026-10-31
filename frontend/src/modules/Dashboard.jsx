// frontend/src/modules/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../utils/api";

const API_BASE = ENDPOINTS.STEGHIDE;

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const accessToken = localStorage.getItem("access_token") || localStorage.getItem("token");

  async function fetchHistory() {
    setLoading(true);
    setError("");
    try {
      const headers = {};
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
      const res = await axios.get(`${API_BASE}/history/`, { headers });
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to load history:", err);
      if (err.response?.status === 401) {
        setError("You must be signed in to view history.");
      } else {
        setError(err.response?.data?.detail || "Failed to fetch history.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function renderFilesInfo(files_info) {
    if (!files_info || files_info.length === 0) return <em className="text-slate-400">No files recorded</em>;
    return (
      <ul className="list-disc list-inside space-y-1 text-slate-300">
        {files_info.map((f, i) => (
          <li key={i}>
            <span className="text-cyan-300 font-mono">{f.name || f.filename || f.file_name}</span>{" "}
            <span className="text-slate-400">({Math.round((f.size || f.bytes || 0) / 1024)} KB)</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-cyan-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AUDIT LOG // USER TELEMETRY
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Activity History
          </h2>
        </div>
        <button
          onClick={fetchHistory}
          disabled={loading}
          className="self-start sm:self-auto px-4 py-2 bg-[#0c1629] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white rounded-xl text-xs font-mono uppercase tracking-wider transition cursor-pointer"
        >
          {loading ? "Refreshing..." : "↻ Refresh Logs"}
        </button>
      </div>

      {loading && (
        <div className="p-6 bg-[#0c1629]/80 border border-cyan-500/30 rounded-2xl text-center text-cyan-300 font-mono animate-pulse">
          Fetching encryption telemetry logs…
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/60 border border-red-500/30 text-red-300 rounded-2xl font-mono text-sm">
          {error}
        </div>
      )}

      {!loading && history.length === 0 && !error && (
        <div className="p-8 bg-[#0c1629]/60 border border-cyan-500/20 rounded-2xl text-center text-slate-400 font-mono">
          No steganographic activity recorded yet.
        </div>
      )}

      <div className="space-y-4">
        {history.map((row) => (
          <div
            key={row.id}
            className="p-5 sm:p-6 rounded-2xl bg-[#0c1629]/85 border border-cyan-500/25 shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-md space-y-3 transition hover:border-cyan-400"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-500/15">
              <div>
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                      row.action === "encrypt"
                        ? "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40"
                        : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                    }`}
                  >
                    {row.action === "encrypt" ? "🔒 Encrypted" : "🔑 Decrypted"}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(row.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  Carrier: <span className="font-mono text-white">{row.carrier_filename || "—"}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                    row.success ? "text-emerald-400 bg-emerald-950/50" : "text-red-400 bg-red-950/50"
                  }`}
                >
                  {row.success ? "✓ Success" : "✕ Failed"}
                </span>
                {row.stego_filename && (
                  <a
                    className="px-3.5 py-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(0,217,245,0.3)] transition"
                    href={`${window.location.origin}${row.stego_filename.startsWith("/") ? "" : "/"}${
                      row.stego_filename.startsWith("stego")
                        ? (import.meta.env.VITE_MEDIA_URL || "/media/") + row.stego_filename
                        : "/media/" + row.stego_filename
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download Stego
                  </a>
                )}
              </div>
            </div>

            <div className="text-sm">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-300 mb-1">Payload Files:</div>
              {renderFilesInfo(row.files_info)}
            </div>

            {row.error_message && (
              <div className="text-xs font-mono text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-500/20">
                Error: {row.error_message}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}