<template>
    <nav class="bg-gray-800">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div class="relative flex h-16 items-center justify-between">
                <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <button @click="navbarMobileMenuIsOpen = !navbarMobileMenuIsOpen" type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-none focus:ring-inset" aria-controls="mobile-menu" aria-expanded="false">
                        <span class="absolute -inset-0.5"></span>
                        <span class="sr-only">Open main menu</span>
                        <svg v-if="!navbarMobileMenuIsOpen" class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                        <svg v-else class="block size-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <NuxtLink :to="logoLink" class="flex shrink-0 items-center">
                        <img class="h-8 w-auto" :src="logoSrc" alt="Logo">
                    </NuxtLink>
                    <div class="hidden sm:ml-6 sm:block">
                        <div v-if="menuItems.length > 0" class="flex space-x-4">
                            <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to" class="rounded-md px-3 py-2 text-sm font-medium" :class="item.active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">{{ item.label }}</NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <div v-if="isLogged" class="relative ml-3">
                        <button @click="profileOptionsIsOpen = !profileOptionsIsOpen" type="button" class="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
                            <span class="sr-only">Open user menu</span>
                            <img class="size-8 rounded-full" :src="profileImg" alt="Profile">
                        </button>
                        <div v-if="profileOptionsIsOpen" class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5">
                            <NuxtLink v-if="profileOptions.length > 0" v-for="option in profileOptions" :key="option.to" :to="option.to" class="block px-4 py-2 text-sm text-gray-700">{{ option.label }}</NuxtLink>
                            <a :href="logoutLink" class="block px-4 py-2 text-sm text-gray-700">Sign out</a>
                        </div>
                    </div>
                    <div v-else class="hidden sm:block">
                        <NuxtLink v-if="route.path !== '/auth/login'" to="/auth/login" class="text-gray-300 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-medium">Login</NuxtLink>
                        <NuxtLink v-if="route.path !== '/auth/register'" to="/auth/register" class="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Register</NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="navbarMobileMenuIsOpen" class="sm:hidden" id="mobile-menu">
            <div class="space-y-1 px-2 pt-2 pb-3">
                <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to" class="block rounded-md px-3 py-2 text-base font-medium" :class="item.active ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'">{{ item.label }}</NuxtLink>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue';

const route = useRoute();

const props = defineProps({
    logoSrc: { type: String, required: true },
    logoLink: { type: String, default: '/' },
    menuItems: { type: Array, required: true },
    profileImg: { type: String, required: true },
    profileOptions: { type: Array, required: true },
    logoutLink: { type: String, required: true },
    isLogged: { type: Boolean, required: true }
});

const navbarMobileMenuIsOpen = ref(false);
const profileOptionsIsOpen = ref(false);
</script>
