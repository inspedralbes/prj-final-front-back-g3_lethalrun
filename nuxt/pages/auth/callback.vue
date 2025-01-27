<template>
    <div class="w-screen h-screen flex flex-col items-center justify-center">
      <Loader />
    </div>
  </template>
  
  <script setup lang="ts">
  import { useAppStore } from '@/stores/app';
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'nuxt/app'; // Importamos useRoute y useRouter
  
  // Definimos las variables necesarias con sus tipos
  const route = useRoute();
  const router = useRouter(); // Instanciamos el router
  
  onMounted(() => {
    const store = useAppStore();
    
    // Obtenemos los parámetros de la URL utilizando el objeto `route`
    const userData = route.query.user as string | undefined; // Aseguramos que es un string o undefined
    
    if (userData) {
      try {
        // Intentamos parsear el JSON de los datos del usuario
        const parsedUser = JSON.parse(userData);
        
        // Guardamos los datos del usuario en el store
        store.setUser(parsedUser);
        store.setIsAuthenticated(true);
  
        // Redirigimos al dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error("Error al analizar los datos del usuario:", error);
        // Redirigimos al login si hay un error al analizar los datos
        router.push('/auth/login');
      }
    } else {
      // Si no hay datos del usuario, redirigimos al login
      router.push('/auth/login');
    }
  
    console.log('User:', store.user);
  });
  </script>
  