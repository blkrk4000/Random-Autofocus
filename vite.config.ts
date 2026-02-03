import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This ensures assets are loaded relatively, making the app work 
  // on Netlify or subfolders without complex server config.
  base: './', 
})