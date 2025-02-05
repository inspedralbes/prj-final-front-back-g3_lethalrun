<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-2xl font-semibold mb-4">Cambio de contraseña</h1>

        <!-- Error message -->
        <div v-if="error" class="text-red-500 bg-red-100 border border-red-400 p-4 rounded-md mb-4">
            <p>{{ error }}</p>
        </div>

        <!-- Success message -->
        <div v-if="success" class="text-green-500 bg-green-100 border border-green-400 p-4 rounded-md mb-4">
            <p class="text-center">Cambio de contraseña completado con éxito!</p>
            <p class="text-center">Puedes cerrar esta pestaña</p>
        </div>

        <!-- Password reset form -->
        <form v-if="!success" @submit.prevent="handleResetPassword" class="w-80 bg-white p-6 rounded-md shadow-md">
            <input v-model="newPassword" type="password" placeholder="Escribe tu nueva contraseña"
                class="w-full px-4 py-2 border rounded-md mb-4" required />
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
                Restablecer Contraseña
            </button>
        </form>

        <!-- Loading spinner while waiting -->
        <div v-if="loading" class="flex items-center justify-center space-x-2 mt-4">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-lg text-blue-500">Verificando...</span>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'nuxt/app';
import { useAuth } from "@/services/auth";

const route = useRoute();
const { resetPassword } = useAuth();

const newPassword = ref('');
const success = ref(null);
const error = ref(null);
const loading = ref(false);

const handleResetPassword = async () => {
    const token = route.query.token;
    if (!token) {
        error.value = "Token no proporcionado";
        return;
    }

    loading.value = true;
    error.value = null;
    success.value = null;

    try {
        await resetPassword(token, newPassword.value);
        success.value = "Contraseña restablecida con éxito";
        newPassword.value = "";
    } catch (err) {
        error.value = err.message || "Error al restablecer la contraseña.";
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped></style>