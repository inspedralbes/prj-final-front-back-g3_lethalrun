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
      <div class="flex-1">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <h1>My Profile</h1>
            <NuxtLink to="/dashboard">/dashboard</NuxtLink>
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
    { to: '/graffiti/settings', label: 'Graffiti', active: false }
  ];
  
  const profileOptions = [
    { to: '/profile/my-info', label: 'Your Profile' }
  ];
  
  const logoutlink = `${config.public.apiUrl}/api/auth/logout`;
  
  const isLogged = store.getIsAuthenticated;
  
  </script>