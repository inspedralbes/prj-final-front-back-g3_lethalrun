<template>
    <div class="container mx-auto p-4">
        <h1 class="text-3xl font-bold mb-4">INFO</h1>
        <div v-if="user" class="bg-white shadow-md rounded-lg p-6 mb-4">
            <h1 class="text-2xl font-semibold mb-2">Bienvenido, {{ user.username }}</h1>
            <p class="text-gray-700 mb-4">Email: {{ user.email }}</p>
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">Cerrar sesión</button>
        </div>
        <div class="space-x-4">
            <button @click="fetchProtectedRoute" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer">Ruta Protegida</button>
            <button @click="fetchNONProtectedRoute" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer">Ruta NO Protegida</button>
        </div>
    </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const config = useRuntimeConfig();
const user = store.user;


const logout = () => {
    window.location.href = `${config.public.apiUrl}/api/auth/logout`;
};

const fetchProtectedRoute = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}/api/protected`, {
            method: 'GET',
            credentials: 'include', // Para enviar cookies de sesión
        });

        if (!response.ok) {
            console.error('Error al acceder a la ruta protegida:', response.statusText);
            return;
        }

        const data = await response.json(); // Parsear el cuerpo de la respuesta
        console.log('Respuesta de la ruta protegida:', data);
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error inesperado:', err.message);
        } else {
            console.error('Error inesperado:', err);
        }
    }
};
const fetchNONProtectedRoute = async () => {
    try {
        const response = await fetch(`${config.public.apiUrl}/api/not-protected`, {
            method: 'GET',
            credentials: 'include', // Para enviar cookies de sesión
        });

        if (!response.ok) {
            console.error('Error al acceder a la ruta protegida:', response.statusText);
            return;
        }

        const data = await response.json(); // Parsear el cuerpo de la respuesta
        console.log('Respuesta de la ruta protegida:', data);
    } catch (err) {
        if (err instanceof Error) {
            console.error('Error inesperado:', err.message);
        } else {
            console.error('Error inesperado:', err);
        }
    }
};
</script>
