import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 8080,
    host: true, // Listens on all IP addresses (0.0.0.0) so it's accessible from EC2 public IP
  },
  preview: {
    port: 8080,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'react-icons'],
          'vendor-utils': ['axios', 'react-toastify', 'dompurify'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
