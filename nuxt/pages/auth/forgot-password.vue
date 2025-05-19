<script setup>
import { ref } from 'vue';
import { useAuth } from "@/services/auth";

const { forgotPassword } = useAuth();

/**
 * User email input for password reset.
 * @type {import('vue').Ref<string>}
 */
const email = ref('');

/**
 * Success message to display after sending reset link.
 * @type {import('vue').Ref<string>}
 */
const message = ref('');

/**
 * Error message to display if sending reset link fails.
 * @type {import('vue').Ref<string>}
 */
const errorMessage = ref('');

/**
 * Loading state for the reset link request.
 * @type {import('vue').Ref<boolean>}
 */
const isLoading = ref(false);

/**
 * Sends a password reset link to the user's email.
 * Handles loading, success, and error states.
 * @returns {Promise<void>}
 */
const sendResetLink = async () => {
  message.value = '';
  errorMessage.value = '';
  isLoading.value = true;

  try {
    const response = await forgotPassword(email.value);

    if (response?.message) {
      message.value = response.message;
    } else {
      message.value = 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.';
    }
  } catch (error) {
    // Attempt to get error message from backend
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
  <div class="min-h-screen flex flex-col" style="background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);">
    <Navbar class="h-min" :logoSrc="'/LethalRun_logo-removebg-preview.png'" :logoLink="'/'" :menuItems="[]"
      :profileImg="'/profile-icon.jpg'" :profileOptions="[]" :logoutLink="''" :isLogged="false" />
    <div class="flex flex-1 flex-col items-center justify-center px-4 py-8">
      <div class="w-full max-w-md p-6 sm:p-8 bg-red-900 rounded-lg shadow-xl">
        <h2 class="text-2xl sm:text-3xl font-bold text-center text-orange-400">Recuperar contrasenya</h2>
        <p class="mt-3 text-sm text-orange-200 text-center">Introdueix el teu correu electrònic i t'enviarem un enllaç per restablir la teva contrasenya.</p>
        <form @submit.prevent="sendResetLink" class="mt-8">
          <div>
            <label for="email-forgot" class="block text-sm font-medium text-orange-200 mb-1">Correu electrònic</label>
            <input id="email-forgot" type="email" v-model="email" required
                   class="mt-1 block w-full px-4 py-2.5 border border-orange-600 bg-gray-700 text-white rounded-md focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400 focus:outline-none">
          </div>
          <button type="submit" class="mt-8 w-full bg-red-600 text-white font-medium py-2.5 px-4 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isLoading">
            <div v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
                   fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>Enviant...</span>
            </div>
            <span v-else>Enviar enllaç</span>
          </button>
        </form>

        <div v-if="message" class="mt-6 bg-yellow-800 bg-opacity-90 border border-yellow-600 text-yellow-200 p-4 rounded-md w-full text-center shadow-lg">
            <p>{{ message }}</p>
        </div>

        <div v-if="errorMessage" class="mt-6 bg-red-800 border border-red-600 text-red-300 p-4 rounded-md w-full text-center shadow-lg">
            <p>{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
