import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  root: path.resolve(__dirname),
  publicDir: 'public',
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },
})
