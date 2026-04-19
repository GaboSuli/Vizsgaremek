import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath, URL } from 'node:url'
/// <reference types="vitest" />

export default defineConfig({
  plugins: [
    react({
      babel: {
        // babel-plugin-react-compiler causes unbounded memory growth in the
        // Vitest transform worker — disable it entirely during test runs.
        plugins: process.env.VITEST ? [] : [['babel-plugin-react-compiler']],
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
    chunkSizeWarningLimit: 700,  // suppress warnings for chart.js & bootstrap chunks
    rollupOptions: {
      // Prevent server-only packages from accidentally entering the bundle
      external: (id) => ['express', 'cors', 'nodemailer'].includes(id),
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
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
    include: ['src/**/*.test.{js,jsx}'],
    pool: 'forks',
    forks: {
      // Vitest 4: execArgv passes Node flags to each worker fork.
      // Node 22 default heap limit (~4 GB) is not enough when jsdom +
      // react-router-dom v7 modules are fully loaded.  8 GB is sufficient.
      execArgv: ['--max-old-space-size=8192'],
    },
  },
})