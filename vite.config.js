import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Feature flags are inlined as a plain global rather than read through
  // import.meta.env in app code: import.meta is ESM-only syntax that Babel
  // cannot transform for the Jest test run, which would make every component
  // behind a flag untestable. See src/config/featureFlags.js.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'globalThis.__FEATURE_FLAGS__': JSON.stringify({
        autoEligibility: env.VITE_FEATURE_AUTO_ELIGIBILITY === 'true',
      }),
    },
    plugins: [react()],
    server: {
      host: true,
      port: 5173,
      // usePolling is required when source files are bind-mounted inside Docker
      // because inotify events don't cross the container boundary on Linux.
      // Set DOCKER=1 in docker-compose to enable; has no effect on native dev.
      watch: process.env.DOCKER ? { usePolling: true, interval: 1000 } : undefined,
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  }
})
