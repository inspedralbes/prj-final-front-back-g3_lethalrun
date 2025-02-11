<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="h-min"
      :logoSrc="'/LethalRun_logo-removebg-preview.png'"
      :logoLink="'/'"
      :menuItems="menuItems"
      :profileImg="'/profile-icon.jpg'"
      :profileOptions="profileOptions"
      :logoutLink="logoutlink"
      :isLogged="isLogged"
    />

    <div class="flex-1 container mx-auto p-4">
      <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold mb-4">INFO</h1>
        <div v-if="user" class="bg-white shadow-md rounded-lg p-6 mb-4">
            <h1 class="text-2xl font-semibold mb-2">Bienvenido, {{ user.username }}</h1>
            <p class="text-gray-700 mb-4">Email: {{ user.email }}</p>
            <button @click="logout" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">Cerrar sesión</button>
        </div>
        <div class="space-x-4">
            
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const config = useRuntimeConfig();

const user = store.user;

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', active: true },
  { to: '/graffiti/settings', label: 'Graffiti', active: false },
  { to: '/test', label: 'Test', active: false }
];

const profileOptions = [
  { to: '/profile/my-info', label: 'Your Profile' }
];

const logoutlink = `${config.public.apiUrl}/api/auth/logout`;

const isLogged = store.getIsAuthenticated;


const logout = () => {
    window.location.href = `${config.public.apiUrl}/api/auth/logout`;
};
</script>
