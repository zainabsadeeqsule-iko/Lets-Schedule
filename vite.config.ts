import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**'),
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'LetsSchedule',
        short_name: 'LetsSchedule',
        description: 'LetsSchedule PWA',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/dist/icons8-schedule-48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/dist/icons8-schedule-96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/dist/icons8-schedule-96.png',
            sizes: '96x96',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
