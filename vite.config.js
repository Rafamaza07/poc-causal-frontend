import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-dom') || id.includes('react-router-dom') || /\/react\//.test(id)) return 'vendor-react'
          if (id.includes('recharts'))    return 'vendor-charts'
          if (id.includes('lucide-react')) return 'vendor-icons'
        },
      },
    },
  },
})
