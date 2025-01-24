<script setup>

const config = useRuntimeConfig();
const route = useRoute()

const login = () => {
  console.log('Login')
}

const loginGoogle = () => {
  const clientId = config.public.GOOGLE_CLIENT_ID;
  const redirectUri = config.public.GOOGLE_REDIRECT_URI;
  const state = this.generateRandomString(16);
  const scopes = ['openid', 'profile', 'email', 'https://www.googleapis.com/auth/userinfo.profile',]; 
  const scope = encodeURIComponent(scopes.join(' '));
  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
  window.location.href = url;
}


</script>

<template>
  <div>
    <h1>LOGIN</h1>
    <p>Current route: {{ route.path }}</p>
    <button @click="login">Login</button>
    <p>
      <NuxtLink to="/">ruta /</NuxtLink>
    </p>
  </div>
</template>
