import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    }
  },
  server: {
    port: 5173,
    open: true,
    host: '0.0.0.0', // Consenti l'accesso da qualsiasi indirizzo IP
    proxy: {
      '/api/fatsecret': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      },
      '/api/health-check': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => '/health-check'
      },
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  // Configurazione esplicita per le risorse pubbliche
  publicDir: resolve(__dirname, 'public'),
  build: {
    outDir: 'dist',
    sourcemap: true,
  }
});
