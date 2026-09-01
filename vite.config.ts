import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // Los iconos ya están generados en /public (npm run generate-pwa-assets).
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        name: 'Cardify',
        short_name: 'Cardify',
        description:
          'Gift cards digitales para gamers, techies y amantes del futuro digital.',
        lang: 'es',
        id: '/',
        start_url: '/?source=pwa',
        scope: '/',
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'portrait',
        background_color: '#0a0a0e',
        theme_color: '#0a0a0e',
        categories: ['shopping', 'entertainment', 'games'],
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // Handlers de Web Push (push / notificationclick) inyectados al SW generado.
        importScripts: ['/sw-push.js'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/apis\//, /^\/api\//, /^\/admin/],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        // El bundle completo entra al precache (subimos el límite por las dudas).
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Catálogo público (giftcards + categorías). Guarda bastantes páginas
            // y combinaciones de filtros para poder navegarlas sin conexión.
            urlPattern: /^https?:\/\/[^/]+\/apis\/(?:gift-?cards|categories)\b/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cardify-catalogo',
              networkTimeoutSeconds: 4,
              expiration: { maxEntries: 250, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
              matchOptions: { ignoreVary: true },
            },
          },
          {
            // Resto de la API del mismo backend (carrito, "mis compras", usuario…).
            // Solo GET. Online siempre pide a la red; sin conexión sirve lo último
            // que se haya visto de esa misma URL.
            urlPattern: /^https?:\/\/[^/]+\/apis\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'cardify-api',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
              matchOptions: { ignoreVary: true },
            },
          },
          {
            // Imágenes servidas por Cloudinary.
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'cardify-cloudinary',
              expiration: { maxEntries: 250, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Otras imágenes (backend estático, etc.).
            urlPattern: /^https?:\/\/[^/]+\/.*\.(?:png|jpe?g|gif|svg|webp|avif)(?:\?.*)?$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'cardify-imagenes',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        navigateFallback: 'index.html',
        type: 'module',
      },
    }),
  ],
})
