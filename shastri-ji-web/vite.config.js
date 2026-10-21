import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      // The backend does not send CORS headers for localhost, so in dev the
      // browser calls /api on the Vite server and Vite forwards it upstream.
      proxy: env.API_PROXY_TARGET
        ? {
            '/api': {
              target: env.API_PROXY_TARGET,
              changeOrigin: true,
              secure: true,
            },
          }
        : undefined,
    },
  }
})
