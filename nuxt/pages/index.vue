<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div>
    <h1>Nuxt Routing set up successfully!</h1>
    <p>Current route: {{ route.path }}</p>
    <p><NuxtLink to="/hola">ruta /hola</NuxtLink></p>
    <p><NuxtLink to="/login">ruta /auth/login</NuxtLink></p>
    <p><NuxtLink to="/auth/register">ruta /auth/register</NuxtLink></p>
  </div>
</template>
