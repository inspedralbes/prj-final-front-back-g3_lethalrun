<script setup>


const route = useRoute()
</script>

<template>
  <div>
    <h1>LOGIN</h1>
    <p>Current route: {{ route.path }}</p>
    <p><NuxtLink to="/">ruta /</NuxtLink></p>
  </div>
</template>
