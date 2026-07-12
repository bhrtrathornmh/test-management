import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // The staging API's CORS allowlist only permits http://localhost:3000
    // (not Vite's default 5173) — pin the dev port so API calls aren't blocked.
    port: 3000,
    strictPort: true,
  },
})
