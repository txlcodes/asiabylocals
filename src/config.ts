// API Configuration
// In production, set VITE_API_URL environment variable
// Fallback to current origin for unified deployment (frontend + backend on same domain)
export const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001');

// Frontend URL
export const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');



