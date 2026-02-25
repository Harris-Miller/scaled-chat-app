import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      LOCAL_API?: 'true';
    }
  }
}

const targetHost = process.env.LOCAL_API ? 'localhost:3000' : 'localhost:80';
const rewrite = process.env.LOCAL_API ? (path: string) => path.replace(/^\/api/, '') : undefined;

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
        target: `ws://${targetHost}/`,
        ws: true,
        rewrite,
      },
      '/api': {
        changeOrigin: true,
        target: `http://${targetHost}/`,
        rewrite,
      },
    },
  },
  /* eslint-enable sort-keys-fix/sort-keys-fix */
});
