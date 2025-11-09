import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true, target: 'react' }),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
  ],
  server: {
    /* eslint-disable sort-keys-fix/sort-keys-fix */
    proxy: {
      '/api/ws': {
        // rewriteWsOrigin: true,
        target: 'ws://localhost:3000/',
        ws: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
      '/api': {
        changeOrigin: true,
        target: 'http://localhost:3000/',
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
    /* eslint-enable sort-keys-fix/sort-keys-fix */
  },
});
