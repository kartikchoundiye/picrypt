// frontend/src/modules/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { ENDPOINTS } from "../utils/api";

const API_BASE = ENDPOINTS.STEGHIDE;

export default function Dashboard() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get auth token from localStorage (adjust key to your implementation)
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

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function renderFilesInfo(files_info) {
    if (!files_info || files_info.length === 0) return <em>No files recorded</em>;
    return (
      <ul className="list-disc list-inside">
        {files_info.map((f, i) => (
          <li key={i}>
            {f.name || f.filename || f.file_name} — {Math.round((f.size || f.bytes || 0) / 1024)} KB
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Activity History</h2>

      {loading && <div className="p-4 bg-gray-100 rounded">Loading…</div>}
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {!loading && history.length === 0 && !error && (
        <div className="p-4 bg-gray-50 rounded">No history found yet.</div>
      )}

      <div className="space-y-4 mt-4">
        {history.map((row) => (
          <div key={row.id} className="p-4 border rounded-md bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm text-gray-500">{new Date(row.timestamp).toLocaleString()}</div>
                <div className="text-lg font-semibold">{row.action === "encrypt" ? "Encrypted" : "Decrypted"}</div>
                <div className="text-sm text-gray-600">Carrier: {row.carrier_filename || "—"}</div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-600">Status: {row.success ? "Success" : "Failed"}</div>
                {row.stego_filename && (
                  <a
                    className="inline-block mt-2 px-3 py-1 bg-teal-600 text-white rounded text-sm"
                    href={`${window.location.origin}${row.stego_filename.startsWith("/") ? "" : "/"}${row.stego_filename.startsWith("stego") ? (import.meta.env.VITE_MEDIA_URL || "/media/") + row.stego_filename : "/media/" + row.stego_filename}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download stego
                  </a>
                )}
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <div className="font-medium">Files:</div>
              {renderFilesInfo(row.files_info)}
            </div>

            {row.error_message && (
              <div className="mt-2 text-sm text-red-600">Error: {row.error_message}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
