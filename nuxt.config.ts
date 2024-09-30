// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primevue/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: false,
  modules: [
    'usebootstrap',
    '@primevue/nuxt-module',
    'dayjs-nuxt',
    '@pinia/nuxt',
  ],

  primevue: {
    importPT: { from: './assets/pvpresets/primevue_preset.js' },

    options: {
      theme: {
        preset: Aura,
        options: {},
      },
    },
  },
  runtimeConfig: {
    API_SECRET: process.env.API_SECRET,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DATABASE_URL: process.env.DATABASE_URL,

    TO: process.env.TO,
    FROM: process.env.FROM,
    FROM_NAME: process.env.FROM_NAME,
    EE_API_KEY: process.env.EE_API_KEY,
    TWILIO_NUMBER: process.env.TWILIO_NUMBER,
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    SEASON_DIVIDE_DATE: process.env.SEASON_DIVIDE_DATE,

    // Keys within public, will be also be
    // exposed to the client-side
    public: {
      TITLE: process.env.TITLE,
      GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    },
  },
  components: [
    '~/components/app',
    '~/components/selectors',
    '~/components/forms',
    '~/components/displays',
    '~/components',
  ],
})