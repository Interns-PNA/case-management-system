// Central access point for the backend base URL.
// Set via VITE_API_BASE_URL at build time; empty string = same-origin
// (nginx proxies /api and /uploads to the backend in production).
export const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/+$/,
  "",
);
