import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    lib: false,
    target: 'esnext',
    modulePreload: {
      polyfill: false
    }
  },
  esbuild: {
    target: 'esnext'
  },
  optimizeDeps: {
    include: ['lit', '@lit/reactive-element', 'lit-element', 'lit-html']
  }
})
