import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Days',
        short_name: 'Days',
        display: 'standalone',
        background_color: '#FAD691',
        theme_color: '#FAD691',
        icons: [
          {
            src: '/icon_ios.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon_ios.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/DayCounting/',
})
