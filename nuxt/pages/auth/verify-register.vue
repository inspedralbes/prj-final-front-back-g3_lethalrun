<template>
    <div class="flex flex-col items-center justify-center min-h-screen" style="background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);">
        <h1 class="text-2xl font-semibold mb-4 text-orange-400">Verificando el registro</h1>

        <div v-if="error" class="bg-red-800 border border-red-600 text-red-300 p-4 rounded-md mb-4 w-full max-w-md text-center">
            <p>{{ error }}</p>
        </div>

        <div v-if="success" class="bg-yellow-800 bg-opacity-90 border border-yellow-600 text-yellow-200 p-4 rounded-md mb-4 w-full max-w-md text-center">
            <p>¡Registro completado con éxito!</p>
        </div>

        <div v-if="!error && !success" class="flex flex-col items-center justify-center space-y-3">
            <svg class="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-lg text-yellow-400">Verificando...</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';
import { useAuth } from "@/services/auth";

const { verifyEmailToken } = useAuth();
const route = useRoute();
const router = useRouter();

const success = ref(null);
const error = ref(null);

onMounted(async () => {
    const token = route.query.token;

    if (!token) {
        error.value = "Token not provided";
        return;
    }

    try {
        const response = await verifyEmailToken(token);
        success.value = response;

        // Si la validación es exitosa, redirigimos a /auth/login
        setTimeout(() => {
            router.push("/auth/login");
        }, 2000); // Agrega un pequeño retraso antes de redirigir
    } catch (err) {
        console.log(err);
        error.value = err.data ? err.data : "An error occurred";
    }
});
</script>

<style scoped>
/* Tailwind styles are included directly in the template */
</style>
