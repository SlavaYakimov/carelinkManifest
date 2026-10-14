import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'
import { defineConfig } from 'vite'

const VITE_BUNDLE_JS = /^index-[\w-]+\.js$/
const webRoot = import.meta.dirname

function stripLegacyPublicJs(outDir: string): Plugin {
  return {
    name: 'strip-legacy-public-js',
    closeBundle() {
      for (const subdir of ['assets', 'static']) {
        const dir = path.join(outDir, subdir)
        if (!fs.existsSync(dir)) continue
        for (const name of fs.readdirSync(dir)) {
          if (!name.endsWith('.js') || VITE_BUNDLE_JS.test(name)) continue
          fs.unlinkSync(path.join(dir, name))
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), stripLegacyPublicJs(path.resolve(webRoot, '../dist'))],
  base: '/',
  root: path.resolve(webRoot),
  publicDir: 'public',
  build: {
    outDir: path.resolve(webRoot, '../dist'),
    emptyOutDir: true,
  },
  server: {
    fs: {
      allow: [path.resolve(webRoot, '..')],
    },
  },
})
