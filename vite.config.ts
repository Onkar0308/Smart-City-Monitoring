import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  // Ensure proper handling of environment variables
  envPrefix: 'VITE_',
  // Optimize deps to ensure proper bundling of Firebase
  optimizeDeps: {
    include: [
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/analytics'
    ]
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
        }
      }
    }
  }
})
