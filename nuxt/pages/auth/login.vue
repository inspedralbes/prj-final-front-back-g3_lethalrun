<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();
const route = useRoute();
const isLoading = ref(false);

const login = () => {
  isLoading.value = true;
  window.location.href = `${config.public.apiUrl}/api/auth/google`;
}
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 class="text-4xl font-bold mb-6">LOGIN</h1>
    <p class="mb-4">Current route: {{ route.path }}</p>
    <button 
      @click="login" 
      class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300 cursor-pointer"
      :disabled="isLoading"
    >
      <span v-if="!isLoading">Login</span>
      <span v-else class="flex items-center">
        <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading...
      </span>
    </button>
    <p class="mt-4">
      <NuxtLink to="/" class="text-blue-500 hover:underline">ruta /</NuxtLink>
    </p>
  </div>
</template>
