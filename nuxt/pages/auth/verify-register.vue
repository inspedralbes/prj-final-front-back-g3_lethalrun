<template>
    <div class="flex flex-col items-center justify-center min-h-screen" style="background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);">
        <h1 class="text-2xl font-semibold mb-4 text-orange-400">Verificant el registre</h1>

        <div v-if="error" class="bg-red-800 border border-red-600 text-red-300 p-4 rounded-md mb-4 w-full max-w-md text-center">
            <p>{{ error }}</p>
        </div>

        <div v-if="success" class="bg-yellow-800 bg-opacity-90 border border-yellow-600 text-yellow-200 p-4 rounded-md mb-4 w-full max-w-md text-center">
            <p>Registre completat amb èxit!</p>
        </div>

        <div v-if="!error && !success" class="flex flex-col items-center justify-center space-y-3">
            <svg class="animate-spin h-8 w-8 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-lg text-yellow-400">Verificant...</span>
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
 * Hook that triggers when the component is mounted.
 * It attempts to verify the email token from the query parameters.
 * If successful, it redirects to the login page after a short delay.
 * If it fails, an error message is displayed.
 *
 * @async
 * @function onMounted
 * @returns {Promise<void>} Resolves when the verification process is complete.
 */
onMounted(async () => {
    const token = route.query.token;

    if (!token) {
        error.value = "Token not provided";
        return;
    }

    try {
        const response = await verifyEmailToken(token);
        success.value = response;

        // If verification is successful, redirect to /auth/login after a short delay.
        setTimeout(() => {
            router.push("/auth/login");
        }, 2000);
    } catch (err) {
        // Handle error and display an appropriate message.
        error.value = err.data ? err.data : "S'ha produït un error";
    }
});

</script>

<style scoped>
/* Tailwind styles are included directly in the template */
</style>
