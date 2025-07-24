import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    },
    // Reduce bundle size and avoid eval
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  },
  esbuild: {
    // Fix CSP eval issues
    target: 'es2020',
    keepNames: true,
    legalComments: 'none'
  },
  define: {
    // This helps avoid eval usage
    __DEV__: false,
    'process.env.NODE_ENV': '"production"'
  },
  server: {
    headers: {
      // More permissive CSP for development
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss:;"
    }
  }
});