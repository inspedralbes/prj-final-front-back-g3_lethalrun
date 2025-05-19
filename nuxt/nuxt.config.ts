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
    authUrl: process.env.NUXT_AUTH_URL || '',
    socketUrl: process.env.NUXT_SOCKET_URL || '',
    mongoUrl: process.env.NUXT_MONGO_URL || '',
    imagesUrl: process.env.NUXT_IMAGES_URL || '',
  }
},
  pinia: {
    // Opcional: Puedes configurar el almacenamiento y otros aspectos de Pinia aquí
  },
  plugins: [
    '~/plugins/vue-cropper.js', // Asegúrate de incluir tu plugin
  ],
});
