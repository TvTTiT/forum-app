// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint'],
  css: ['./app/assets/css/main.css'],
  runtimeConfig: {
    public: {
      forumApiUrl: process.env.NUXT_PUBLIC_FORUM_API_URL || 'http://api.forum.test'
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
