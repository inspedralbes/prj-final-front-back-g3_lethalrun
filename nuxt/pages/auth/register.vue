<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="absolute top-10 left-10">
      <NuxtLink to="/"
        class="text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 dark:hover:bg-gray-600">
        Volver a inicio
      </NuxtLink>
    </div>
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold text-center text-gray-700 dark:text-white mb-6">Registro</h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
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
          class="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :disabled="isLoading">
          <span v-if="!isLoading">Registrarse</span>
          <div v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>Cargando...</span>
          </div>
        </button>
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
import { useAuth } from "@/services/auth";

const { register } = useAuth();

const isLoading = ref(false);

// Datos del formulario
const username = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleRegister = async () => {
  isLoading.value = true;
  console.log({ username: username.value, email: email.value, password: password.value });

  try {
    const response = await register(username.value, email.value, password.value);
    console.log("Solicitud de registro enviada exitosamente", response);
  } catch (error) {
    console.error("Error en el registro", error);
  } finally {
    isLoading.value = false;
  }
};
</script>