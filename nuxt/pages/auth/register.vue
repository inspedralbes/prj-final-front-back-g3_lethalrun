<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-center text-gray-700 dark:text-white mb-6">Registro</h2>
      <form @submit.prevent="register" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</label>
          <input v-model="username" type="text"
            class="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
          <input v-model="email" type="email"
            class="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password"
              class="mt-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
            <button type="button" @click="togglePassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 p-2 cursor-pointer">
              <span v-if="showPassword">🔓</span>
              <span v-else>🔒</span>
            </button>
          </div>
        </div>
        <button type="submit"
          class="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Registrarse</button>
      </form>
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600 dark:text-gray-300">¿Ya tienes una cuenta?
          <NuxtLink to="/auth/login" class="text-blue-500 hover:underline">Inicia sesión</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const config = useRuntimeConfig();
const route = useRoute();

const isLoading = ref(false);

// Datos del formulario
const username = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const register = async () => {
  console.log({ email: email.value, password: password.value })
  try {
    console.log('enviando solicitud de registro...')
    const response = await $fetch(`${config.public.apiUrl}/send-verification-email`, {
      method: 'POST',
      body: { username: username.value, email: email.value, password: password.value },
      credentials: 'include',
    });
    console.log('Solicitud de registro enviada exitosamente', response);
  } catch (error) {
    console.error('Error en el registro', error);
  }
};
</script>