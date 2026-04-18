import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(fileURLToPath(new URL('./src', import.meta.url))),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    sourcemap: false,            // no sourcemap in production — smaller output
    reportCompressedSize: false, // skip gzip-size reporting to speed up build
    rollupOptions: {
      output: {
        compact: true,
        // Fine-grained chunk splitting: only shared vendor code gets split
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/react-router')) {
            return 'vendor-react';
          }
          if (id.includes('/chart.js/') || id.includes('/react-chartjs-2/')) {
            return 'vendor-charts';
          }
          if (id.includes('/axios/')) {
            return 'vendor-http';
          }
          if (id.includes('/bootstrap/') || id.includes('/react-bootstrap/')) {
            return 'vendor-ui';
          }
          // Group remaining node_modules into a single misc vendor chunk
          return 'vendor-misc';
        },
      },
    },
  },
  server: {
    watch: { usePolling: true },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})