// Centralized API configuration for PICRYPT
// Sourced dynamically from Vite (import.meta.env.VITE_API_URL) with smart fallbacks

const getApiBaseUrl = () => {
  // 1. Vite environment variable
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, "");
  }
  
  // Commented by agent, reason: 'process' is not defined in Vite/browser context — removed to fix no-undef lint error
  // if (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) {
  //   return process.env.REACT_APP_API_URL.replace(/\/+$/, "");
  // }
  // End commented by agent

  // 3. Fallback based on browser window hostname
  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:8000/api";
    }
  }

  return "/api";
};

export const API_BASE_URL = getApiBaseUrl();

export const ENDPOINTS = {
  AUTH: `${API_BASE_URL}/auth`,
  STEGHIDE: `${API_BASE_URL}/steghide`,
  ENCRYPT: `${API_BASE_URL}/steghide/encrypt/`,
  DECRYPT: `${API_BASE_URL}/steghide/decrypt/`,
  HISTORY: `${API_BASE_URL}/steghide/history/`,
  CARRIER_INFO: `${API_BASE_URL}/steghide/carrier-info/`,
};

export default API_BASE_URL;
