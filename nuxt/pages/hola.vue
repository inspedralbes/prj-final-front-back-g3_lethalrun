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
const fetchProtectedRoute = async () => {
  try {
    const response = await fetch(`${config.public.apiUrl}/api/protected`, {
      method: 'GET',
      credentials: 'include', // Para enviar cookies de sesión
    });

    if (!response.ok) {
      console.error('Error al acceder a la ruta protegida:', response.statusText);
      return;
    }

    const data = await response.json(); // Parsear el cuerpo de la respuesta
    console.log('Respuesta de la ruta protegida:', data);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error inesperado:', err.message);
    } else {
      console.error('Error inesperado:', err);
    }
  }
};
const fetchNONProtectedRoute = async () => {
  try {
    const response = await fetch(`${config.public.apiUrl}/api/not-protected`, {
      method: 'GET',
      credentials: 'include', // Para enviar cookies de sesión
    });

    if (!response.ok) {
      console.error('Error al acceder a la ruta protegida:', response.statusText);
      return;
    }

    const data = await response.json(); // Parsear el cuerpo de la respuesta
    console.log('Respuesta de la ruta protegida:', data);
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error inesperado:', err.message);
    } else {
      console.error('Error inesperado:', err);
    }
  }
};
</script>

<template>
  <div>
    <h1>Página Hola</h1>
    <p>ApiUrl URI: {{ apiUrl }}</p>
    <p>Google Client ID: {{ googleClientId }}</p>
    <p>Google Redirect URI: {{ googleRedirectUri }}</p>

    <p>Current route: {{ route.path }}</p>
    <p>
      <NuxtLink to="/">ruta /</NuxtLink>
    </p>
  </div>
</template>
