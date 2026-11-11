/**
 * Base URL for API requests.
 * In development: defaults to http://localhost:3000 (or uses VITE_API_URL if defined).
 * In production: uses VITE_API_URL if defined (for separated frontend/backend hosting like Vercel/Render),
 * or falls back to empty string "" for same-domain / reverse-proxy / monolithic hosting.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "");
