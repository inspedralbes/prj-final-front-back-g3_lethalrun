import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [
      tailwindcss(), // Plugin de TailwindCSS
    ],
  },
  modules: [
    '@pinia/nuxt', // Asegúrate de que @pinia/nuxt esté incluido
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL || '',
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    },
  },
  pinia: {
    // Opcional: Puedes configurar el almacenamiento y otros aspectos de Pinia aquí
  },
  plugins: [
    '~/plugins/vue-cropper.js', // Asegúrate de incluir tu plugin
  ],
});
