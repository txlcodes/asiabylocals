// API Configuration
// Frontend on Vercel, Backend on Render
// Set NEXT_PUBLIC_API_URL in Vercel env vars to your Render backend URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Frontend URL (auto-detected on Vercel, fallback for local dev)
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
