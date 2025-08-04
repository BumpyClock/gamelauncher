import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },
  // Override the default entry point for Lit version
  esbuild: {
    target: 'es2020'
  }
})