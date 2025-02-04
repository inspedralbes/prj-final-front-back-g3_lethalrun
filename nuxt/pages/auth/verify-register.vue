<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 class="text-2xl font-semibold mb-4">Verificando el registro</h1>

        <!-- Error message -->
        <div v-if="error" class="text-red-500 bg-red-100 border border-red-400 p-4 rounded-md mb-4">
            <p>{{ error }}</p>
        </div>

        <!-- Success message -->
        <div v-if="success" class="text-green-500 bg-green-100 border border-green-400 p-4 rounded-md mb-4">
            <p>Registro completado con exito!</p>
        </div>

        <!-- Loading spinner while waiting -->
        <div v-if="!error && !success" class="flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-lg text-blue-500">Verificando...</span>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'nuxt/app';

const config = useRuntimeConfig();

const route = useRoute();
const router = useRouter();

const success = ref(null);
const error = ref(null);

onMounted(async () => {
    const token = route.query.token;

    if (!token) {
        error.value = 'Token not provided';
        return;
    }
    console.log('verifying token...', token)
    try {
        console.log('fetching....')
        const response = await $fetch(`${config.public.apiUrl}/verify/${token}`, {
            method: 'POST',
        });

        success.value = response;
        console.log('success value', success)

        // Si la validación es exitosa, redirigimos a /auth/login
        setTimeout(() => {
            router.push('/auth/login');
        }, 2000); // Agrega un pequeño retraso antes de redirigir

    } catch (err) {
        console.log(err)
        error.value = err.data ? err.data : 'An error occurred';
    }
});
</script>

<style scoped>
/* Tailwind styles are included directly in the template */
</style>
