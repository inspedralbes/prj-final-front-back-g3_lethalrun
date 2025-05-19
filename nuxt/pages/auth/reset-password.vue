<template>
    <div class="flex flex-col items-center justify-center min-h-screen px-4 py-8" style="background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);">
        <h1 class="text-3xl font-bold mb-6 text-orange-400 text-center">Canvi de contrasenya</h1>

        <div v-if="error" class="bg-red-800 border border-red-600 text-red-300 p-4 rounded-md mb-6 w-full max-w-md text-center shadow-lg">
            <p>{{ error }}</p>
        </div>

        <div v-if="success" class="bg-yellow-800 bg-opacity-90 border border-yellow-600 text-yellow-200 p-6 rounded-md mb-6 w-full max-w-md shadow-lg">
            <p class="text-center text-lg font-semibold">Canvi de contrasenya completat amb èxit!</p>
            <p class="text-center mt-2">Pots tancar aquesta pestanya.</p>
        </div>

        <form v-if="!success && !initialLoading" @submit.prevent="handleResetPassword" class="w-full max-w-sm bg-red-900 p-6 sm:p-8 rounded-lg shadow-xl">
            <div class="mb-6">
                <label for="newPassword" class="block text-sm font-medium text-orange-200 mb-1">Nova contrasenya</label>
                <input id="newPassword" v-model="newPassword" type="password" placeholder="Escriu la teva nova contrasenya"
                       class="w-full px-4 py-2.5 border border-orange-600 bg-gray-700 text-white rounded-md focus:ring-yellow-500 focus:border-yellow-500 placeholder-gray-400" required />
            </div>
            <button type="submit" :disabled="loading"
                    class="w-full bg-red-600 text-white font-medium py-2.5 px-4 rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-red-900 disabled:opacity-50 disabled:cursor-not-allowed">
                <span v-if="!loading">Restablir contrasenya</span>
                <span v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    Processant...
                </span>
            </button>
        </form>

        <div v-if="initialLoading && !error" class="flex flex-col items-center justify-center space-y-3 mt-6">
            <svg class="animate-spin h-10 w-10 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-xl text-yellow-400">Verificant l'enllaç...</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'nuxt/app';
import { useAuth } from "@/services/auth";

const route = useRoute();
const { resetPassword } = useAuth();

/**
 * Reactive property to hold the new password input.
 * @type {import('vue').Ref<string>}
 */
const newPassword = ref('');

/**
 * Reactive property to indicate success message.
 * @type {import('vue').Ref<string | null>}
 */
const success = ref(null);

/**
 * Reactive property to indicate error message.
 * @type {import('vue').Ref<string | null>}
 */
const error = ref(null);

/**
 * Reactive property to indicate loading state.
 * @type {import('vue').Ref<boolean>}
 */
const loading = ref(false);

/**
 * Handles the password reset process.  
 * Retrieves the token from the query params, sends the request to reset the password, and manages loading and error states.
 * 
 * @async
 * @function handleResetPassword
 * @returns {Promise<void>} Resolves when the password is successfully reset or an error occurs.
 */
const handleResetPassword = async () => {
    const token = route.query.token;
    if (!token) {
        error.value = "Token no proporcionat";
        return;
    }

    loading.value = true;
    error.value = null;
    success.value = null;

    try {
        await resetPassword(token, newPassword.value);
        success.value = "Contrasenya restablerta amb èxit";
        newPassword.value = "";
    } catch (err) {
        error.value = err.message || "Error en restablir la contrasenya.";
    } finally {
        loading.value = false;
    }
};

</script>

<style scoped></style>
