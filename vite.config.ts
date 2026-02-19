
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5204,
    strictPort: true, // Fail if port is busy, don't switch
  },
  plugins: [
    react()
  ],
  base: './', 
})