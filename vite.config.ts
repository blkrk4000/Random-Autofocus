
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
      devOptions: {
        enabled: true, // ENABLE PWA in dev mode
        type: 'module', // IMPORTANT: Allows SW to work with Vite dev server
        navigateFallback: 'index.html',
        suppressWarnings: true,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        navigateFallback: 'index.html', // Ensure SPA routing works offline
        cleanupOutdatedCaches: true
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
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: 'favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  base: './', 
})