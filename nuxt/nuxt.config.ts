// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      socketUri: process.env.BACK_URI || '',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    },
  },
});
