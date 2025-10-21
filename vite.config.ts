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
        // Fixed: Removed invalid 'icon' property and referenced actual icon files
        icons: [
          {
            src: 'public/app-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'public/app-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
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