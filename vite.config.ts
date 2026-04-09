import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  // GitHub Pages project sites are served from /<repo-name>/ in production.
  base: command === 'build' ? '/girl/' : '/',
}))
