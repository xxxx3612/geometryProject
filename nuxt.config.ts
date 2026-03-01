// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/index.css'
  ],
  modules: ['@unocss/nuxt', '@nuxt/icon'],
  app: {
    head: {
      title: 'Geometry Project',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Geometry Project built with Nuxt 4' },
        { name: 'keywords', content: 'geometry, three.js, nuxt, vue' }
      ]
    }
  },
  ssr: true,
  devServer: {
    port: 3000,
  },
  runtimeConfig: {
    apiKey: process.env.API_KEY,
    baseUrl: process.env.BASE_URL,
  }
})