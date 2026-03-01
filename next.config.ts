import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Keep all URLs identical — no trailing slashes added
  trailingSlash: false,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'www.asiabylocals.com' },
    ],
  },

  // Pass API URL to the client safely
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001',
  },

  // Strict redirects — add any URL changes here (currently none)
  async redirects() {
    return [
      // Example — only add if a URL actually changes:
      // { source: '/old-url', destination: '/new-url', permanent: true },
    ];
  },

  // Headers for SEO & security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
