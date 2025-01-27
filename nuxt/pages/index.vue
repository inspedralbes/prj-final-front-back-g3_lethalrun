<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const config = useRuntimeConfig();
const route = useRoute();

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
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-4">Nuxt Routing set up successfully!</h1>
    <p class="mb-2">Current route: {{ route.path }}</p>
    <div class="mb-4">
      <NuxtLink to="/hola" class="text-blue-500 hover:underline">ruta /hola</NuxtLink>
    </div>
    <div class="mb-4">
      <NuxtLink to="/auth/login" class="text-blue-500 hover:underline">ruta /auth/login</NuxtLink>
    </div>
    <div class="mb-4">
      <NuxtLink to="/auth/register" class="text-blue-500 hover:underline">ruta /auth/register</NuxtLink>
    </div>
    <div class="space-x-4">
      <button @click="fetchNONProtectedRoute" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">Ruta NO Protegida</button>
      <button @click="fetchProtectedRoute" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">Ruta Protegida</button>
    </div>
  </div>
</template>
