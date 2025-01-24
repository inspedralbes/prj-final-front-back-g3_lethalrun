<template>
    <h1>INFO</h1>
    <div v-if="user">
        <h1>Bienvenido, {{ user.name }}</h1>
        <p>Email: {{ user.email }}</p>
        <button @click="logout">Cerrar sesión</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const config = useRuntimeConfig();
const user = ref(null);

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
</script>