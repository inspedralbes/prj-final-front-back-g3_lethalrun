<!-- pages/hola.vue -->
<script setup>
const route = useRoute()
const config = useRuntimeConfig();

// Accediendo a las variables públicas
const apiUrl = config.public.apiUrl;
const googleClientId = config.public.googleClientId;
const googleRedirectUri = config.public.googleRedirectUri;

console.log('Socket URI:', apiUrl);
console.log('Google Client ID:', googleClientId);
console.log('Google Redirect URI:', googleRedirectUri);
</script>

<template>
  <div>
    <h1>Página Hola</h1>
    <p>ApiUrl URI: {{ apiUrl }}</p>
    <p>Google Client ID: {{ googleClientId }}</p>
    <p>Google Redirect URI: {{ googleRedirectUri }}</p>

    <p>Current route: {{ route.path }}</p>
    <p><NuxtLink to="/">ruta /</NuxtLink></p>
  </div>
</template>
