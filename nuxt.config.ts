import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  css: [
    '~/assets/css/main.css'
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  googleFonts: {
    families: {
      'Lato': [300, 400, 700],
    },
    display: 'swap',
    preconnect: true,
    preload: true,
  },

  modules: [
    'nuxt-keen-slider',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt'
  ],

  piniaPluginPersistedstate: {
    storage: 'cookies'
  },
})
