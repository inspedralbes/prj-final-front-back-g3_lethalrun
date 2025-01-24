// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@pinia/nuxt'],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || '',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    },
  },
});
