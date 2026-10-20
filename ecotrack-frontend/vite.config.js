import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    rollupOptions: {
      output: {
        // keep the charting library in its own cached chunk
        manualChunks: { react: ['react', 'react-dom', 'react-router-dom'], charts: ['recharts'] },
      },
    },
  },
})
