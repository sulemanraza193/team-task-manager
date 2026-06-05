import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: false, // ← change to false
        secure: false,
      },
      '/teams': {
        target: 'http://localhost:5000',
        changeOrigin: false, // ← change to false
        secure: false,
      },
      '/tasks': {
        target: 'http://localhost:5000',
        changeOrigin: false, // ← change to false
        secure: false,
      },
    },
  },
})