// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@nuxt/icon'
  ],
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
  }
})
