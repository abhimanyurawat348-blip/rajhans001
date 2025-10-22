import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'RHPS School Portal',
        short_name: 'RHPS Portal',
        description: 'Royal Hindustan Private School Society - Smart Learning Platform with Dronacharya AI',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        // Using the final RHPS app icon in SVG format
        icons: [
          {
            src: 'public/app-icon-final.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'public/app-icon-final.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    // Vite handles history API fallback automatically for SPA routing
  },
  preview: {
    // Vite handles history API fallback automatically for SPA routing
  },
  // Added build configuration for better caching
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          utils: ['framer-motion', 'recharts', 'lucide-react']
        }
      }
    }
  }
});