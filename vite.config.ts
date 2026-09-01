import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// base './' + singlefile => the production build is ONE self-contained index.html
// that runs offline by double-click and makes zero external network requests.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { target: 'es2019', cssCodeSplit: false, assetsInlineLimit: 100000000 },
})
