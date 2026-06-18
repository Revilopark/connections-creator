import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/connections-creator/',
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist'
  }
})
