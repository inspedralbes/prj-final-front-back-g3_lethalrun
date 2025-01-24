<!-- pages/hola.vue -->
<script setup>
const route = useRoute()
const config = useRuntimeConfig();

// Accediendo a las variables públicas
const socketUri = config.public.socketUri;
const googleClientId = config.public.googleClientId;
const googleRedirectUri = config.public.googleRedirectUri;

console.log('Socket URI:', socketUri);
console.log('Google Client ID:', googleClientId);
console.log('Google Redirect URI:', googleRedirectUri);
</script>

<template>
  <div>
    <h1>Página Hola</h1>
    <p>Socket URI: {{ socketUri }}</p>
    <p>Google Client ID: {{ googleClientId }}</p>
    <p>Google Redirect URI: {{ googleRedirectUri }}</p>

    <p>Current route: {{ route.path }}</p>
    <p><NuxtLink to="/">ruta /</NuxtLink></p>
  </div>
</template>
