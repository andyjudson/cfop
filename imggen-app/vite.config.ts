import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Local development tool only - not deployed to GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: '/',
})
