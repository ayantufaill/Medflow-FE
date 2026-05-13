import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
})
