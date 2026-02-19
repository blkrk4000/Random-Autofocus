
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5204,
    strictPort: true, // Fail if port is busy, don't switch
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      // CRITICAL: Enable PWA generation in development mode
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Random Autofocus',
        short_name: 'Autofocus',
        description: 'A digital implementation of Mark Forster\'s Autofocus System.',
        theme_color: '#f3f4f6',
        background_color: '#f3f4f6',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192', // Explicit size helps Chrome heuristic
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  base: './', 
})