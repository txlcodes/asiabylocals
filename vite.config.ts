import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '127.0.0.1',
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://127.0.0.1:3001',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    // Ensure all routes serve index.html for client-side routing
    build: {
      rollupOptions: {
        input: './index.html',
        output: {
          // Split vendor libraries into separate cacheable chunks
          manualChunks: (id) => {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/react-helmet-async')) {
              return 'vendor-helmet';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('node_modules/@prisma') || id.includes('node_modules/prisma')) {
              return 'vendor-prisma';
            }
          }
        }
      },
      // Raise warning threshold — 2MB bundle needs lazy loading (Next.js migration will fix this)
      chunkSizeWarningLimit: 3000
    }
  };
});
