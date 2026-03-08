import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/cubing.spec/',
  optimizeDeps: {
    exclude: ['cubing/scramble'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    modulePreload: {
      polyfill: false,
    },
  },
})
