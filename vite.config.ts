import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/statistical-webapp/',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
})
