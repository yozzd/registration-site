export default defineNuxtConfig({
  app: {
    head: {
      title: 'Registration',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  devtools: { enabled: true },

  css: [
    '@/assets/css/tailwind.css',
    '@fontsource/inter/400.css',
  ],

  modules: ['@nuxt/ui', '@pinia/nuxt', '@sidebase/nuxt-auth'],

  colorMode: {
    preference: 'light',
  },

  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },

  auth: {
    origin: process.env.ORIGIN_URL,
    baseURL: process.env.API_URL,
    provider: {
      type: 'local',
      sessionDataType: {
        id: 'string',
        fullName: 'string',
        email: 'string',
        role: 'string',
      },
      token: {
        maxAgeInSeconds: 8 * 60 * 60,
      },
    },
    globalAppMiddleware: true,
  },
});
