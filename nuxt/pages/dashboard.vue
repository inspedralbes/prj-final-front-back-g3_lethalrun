<template>
    <h1>INFO</h1>
    <div v-if="user">
        <h1>Bienvenido, {{ user.name }}</h1>
        <p>Email: {{ user.email }}</p>
        <button @click="logout">Cerrar sesión</button>
    </div>
    <button @click="fetchProtectedRoute">Ruta Protegida</button>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();
const user = ref(null);
const protectedData = ref(null);

onMounted(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const userData = queryParams.get('user');
    if (userData) {
        user.value = JSON.parse(userData);
    }
    console.log('User:', user.value);
});

const logout = () => {
    window.location.href = `${config.public.apiUrl}/api/auth/logout`;
};

const fetchProtectedRoute = async () => {
    try {
        const { data, error } = await useFetch('/api/protected', {
            baseURL: config.public.apiUrl,
            credentials: 'include', // Para enviar cookies de sesión
        });

        if (error.value) {
            console.error('Error al acceder a la ruta protegida:', error.value);
        } else {
            console.log('Respuesta de la ruta protegida:', data.value);
            protectedData.value = data.value;
        }
    } catch (err) {
        console.error('Error inesperado:', err.message);
    }
};
</script>
