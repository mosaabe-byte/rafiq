import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon.png', 'rafiq-icon.svg'],
      workbox: {
        // نماذج التضمين (wasm) كبيرة؛ نرفع حدّ التخزين المسبق ليسعها
        maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30 ميغابايت
      },
      manifest: {
        name: 'رفيق',
        short_name: 'رفيق',
        description: 'رفيقك في رحلة تعلّم البرمجة من الفكرة إلى تطبيق منشور',
        lang: 'ar',
        dir: 'rtl',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#5B47D6',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
});