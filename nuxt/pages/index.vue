<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const config = useRuntimeConfig();
const route = useRoute();
const profileOptions = [{ to: '/profile/my-info', label: 'El meu perfil' }];

const user = store.user;


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
  <div class="min-h-screen flex flex-col">


    <Navbar class="h-min" 
      :logoSrc="'/LethalRun_logo-removebg-preview.png'" 
      :logoLink="'/'" :menuItems="[]"
      :profileImg="'/profile-icon.jpg'" 
      :profileOptions="profileOptions" 
      :logoutLink="''" 
      :isLogged="store.getIsAuthenticated" />
      
    <div class="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4">
      <div class="text-center max-w-md">
        <h1 class="text-4xl font-bold text-gray-900">Benvingut a LethalRun<span v-if="store.getIsAuthenticated">, {{ user.username }}</span> </h1>
        <p class="text-gray-600 mt-2">Personalitza la teva experiència</p>

        <div v-if="!store.getIsAuthenticated" class="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/auth/login"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Iniciar sesión
          </NuxtLink>

          <NuxtLink to="/auth/register"
            class="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            Registrarse
          </NuxtLink>
        </div>
        <div v-else class="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/dashboard"
            class="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Entrar >
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
