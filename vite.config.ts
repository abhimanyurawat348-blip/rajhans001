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
        enabled: false // Disable PWA in development for GitHub.dev compatibility
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
    }),
    // Custom CORS middleware for GitHub.dev
    {
      name: 'cors-middleware',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Set CORS headers for all requests
          const origin = req.headers.origin || req.headers.referer || '*';
          res.setHeader('Access-Control-Allow-Origin', origin);
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
          res.setHeader('Access-Control-Allow-Headers', 
            'X-Requested-With, content-type, Authorization, Cache-Control, X-Forwarded-Host, X-Forwarded-Proto, X-GitHub-Dev-Tunnel, Accept, Accept-Encoding, Accept-Language, Connection, Host, Referer, Sec-Fetch-Dest, Sec-Fetch-Mode, Sec-Fetch-Site, User-Agent'
          );
          res.setHeader('Access-Control-Allow-Credentials', 'true');
          res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
          
          // Handle preflight requests
          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }
          
          next();
        });
        
        // Handle manifest requests specifically
        server.middlewares.use('/manifest.webmanifest', (req, res, next) => {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/manifest+json');
            res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
            // Let Vite handle the file serving
          }
          next();
        });
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    // CORS is handled by custom middleware above
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