<script setup>


const route = useRoute()

const register = () => {
  console.log('Register')
}



</script>

<template>
  <div>
    <h1>REGISTER</h1>
    <p>Current route: {{ route.path }}</p>
    <button @click="register">Register</button>
    <p><NuxtLink to="/">ruta /</NuxtLink></p>
  </div>
</template>
