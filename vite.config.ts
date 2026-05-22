import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  envPrefix: ['VITE_', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY'],
  plugins: [react()],
})
