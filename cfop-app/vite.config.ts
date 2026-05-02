import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  base: '/cfop/',
  worker: {
    format: 'es',
  },
  resolve: {
    alias: {
      cubify: resolve(__dirname, '../../cubify/src/index.ts'),
    },
    dedupe: ['cubing'],
  },
})
