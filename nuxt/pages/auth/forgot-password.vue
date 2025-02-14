<script setup>
import { ref } from 'vue';
import { useAuth } from "@/services/auth";

const { forgotPassword } = useAuth();

const email = ref('');
const message = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const sendResetLink = async () => {
  message.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await forgotPassword(email.value);

    if (response?.message) {
      message.value = response.message; // Mensaje del backend si existe
    } else {
      message.value = 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);

    // Intentar obtener el mensaje de error del backend
    if (error?.data?.message) {
      errorMessage.value = error.data.message;
    } else if (error?.message) {
      errorMessage.value = error.message;
    } else {
      errorMessage.value = 'Ocurrió un error inesperado. Inténtalo de nuevo.';
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="h-min" :logoSrc="'/LethalRun_logo-removebg-preview.png'" :logoLink="'/'" :menuItems="[]"
      :profileImg="'/profile-icon.jpg'" :profileOptions="[]" :logoutLink="''" :isLogged="false" />
    <div class="flex flex-1 flex-col items-center justify-center bg-gray-100">
      <div class="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-center text-gray-700">Recuperar contraseña</h2>
        <p class="mt-2 text-sm text-gray-600 text-center">Ingresa tu correo electrónico y te enviaremos un enlace para
          restablecer tu contraseña.</p>
        <form @submit.prevent="sendResetLink" class="mt-4">
          <label class="block">
            <span class="text-gray-700">Correo electrónico</span>
            <input type="email" v-model="email" required
              class="mt-1 block w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 focus:outline-none">
          </label>
          <button type="submit" class="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            :disabled="isLoading">
            <div v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-3 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
                fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>Cargando...</span>
            </div>
            <span v-else>Enviar enlace</span>
          </button>
        </form>

        <!-- Mensaje de éxito -->
        <p v-if="message" class="mt-4 text-sm text-green-600 text-center">{{ message }}</p>

        <!-- Mensaje de error -->
        <p v-if="errorMessage" class="mt-4 text-sm text-red-600 text-center">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>
