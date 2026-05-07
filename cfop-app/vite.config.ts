import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const CUBIFY_LOCAL = env.CUBIFY_LOCAL === '1'

  return {
    plugins: [react()],
    base: '/cfop/',
    worker: {
      format: 'es',
    },
    resolve: {
      alias: CUBIFY_LOCAL ? {
        '@andyjudson/cubify':
          resolve(__dirname, '../../cubify/packages/cubify/src/index.ts'),
        '@andyjudson/cubify-react':
          resolve(__dirname, '../../cubify/packages/cubify-react/src/index.ts'),
      } : undefined,
      dedupe: ['cubing'],
    },
  }
})
