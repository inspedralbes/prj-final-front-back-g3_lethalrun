<template>
    <nav class="bg-[url('/images/navbar/background-navbar.png')] bg-repeat-x bg-bottom bg-[length:100px]">
        <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 bg-[url('/images/navbar/background-navbar.png')] bg-repeat-x bg-bottom bg-[length:100px]">
            <div class="relative flex h-16 items-center justify-between">
                <div v-if="store.isAuthenticated" class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <button @click="navbarMobileMenuIsOpen = !navbarMobileMenuIsOpen" type="button" 
                        class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-white/10 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" 
                        aria-controls="mobile-menu" :aria-expanded="navbarMobileMenuIsOpen.toString()">
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
                        <div v-if="menuItems.length > 0 && store.isAuthenticated" class="flex space-x-4">
                            <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to" 
                                class="rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ease-in-out" 
                                :class="!item.active 
                                    ? 'text-gray-300 hover:bg-white/10 hover:text-yellow-400'
                                    : 'text-white'"
                                :style="item.active 
                                    ? { background: 'linear-gradient(90deg, #ff1744 0%, #ff9100 60%, #fff176 100%)' }
                                    : {}">
                                {{ item.label }}
                            </NuxtLink>
                        </div>
                    </div>
                </div>
                <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <div v-if="isLogged" class="relative ml-3">
                        <button @click="profileOptionsIsOpen = !profileOptionsIsOpen" type="button" 
                            class="relative flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#1a0a0a]">
                            <span class="sr-only">Open user menu</span>
                            <img class="size-8 rounded-full cursor-pointer hover:opacity-90 transition-opacity duration-150" :src="profileImg" alt="Profile">
                        </button>

                        <div v-if="profileOptionsIsOpen" 
                            class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md py-1 shadow-xl ring-1 ring-white/10 focus:outline-none"
                            style="background: rgba(35, 25, 25, 0.98);">
                            <NuxtLink v-if="profileOptions.length > 0" v-for="option in profileOptions" :key="option.to" :to="option.to" 
                                @click="profileOptionsIsOpen = false"
                                class="block px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-white/10 hover:text-yellow-400 transition-colors duration-150">
                                {{ option.label }}
                            </NuxtLink>
                            <a :href="logoutLink" @click="profileOptionsIsOpen = false"
                                class="block px-4 py-2 text-sm text-gray-300 rounded-md hover:bg-white/10 hover:text-yellow-400 transition-colors duration-150">
                                Tancar sessió
                            </a>
                        </div>
                    </div>

                    <div v-else class="flex items-center space-x-3">
                        <NuxtLink v-if="route.path !== '/auth/login'" to="/auth/login"
                            class="px-3 py-2 rounded-md text-sm font-medium text-white shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#1a0a0a] hover:shadow-lg hover:brightness-110 transition-all duration-150 ease-in-out"
                            style="background: linear-gradient(90deg, #ff1744 0%, #ff9100 60%, #fff176 100%);">
                            Login
                        </NuxtLink>
                        <NuxtLink v-if="route.path !== '/auth/register'" to="/auth/register"
                            class="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-white/5 transition-colors duration-150 ease-in-out">
                            Register
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="navbarMobileMenuIsOpen" class="sm:hidden navbarrr" id="mobile-menu" style="background: rgba(30, 20, 20, 0.95);">
            <div class="space-y-1 px-2 pt-2 pb-3">
                <NuxtLink v-for="item in menuItems" :key="item.to" :to="item.to" 
                    class="block rounded-md px-3 py-2 text-base font-medium transition-colors duration-150 ease-in-out" 
                    :class="!item.active 
                        ? 'text-gray-300 hover:bg-white/10 hover:text-yellow-400'  
                        : 'text-white'"                                          
                    :style="item.active 
                        ? { background: 'linear-gradient(90deg, #ff1744 0%, #ff9100 60%, #fff176 100%)' }
                        : {}">
                    {{ item.label }}
                </NuxtLink>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useAppStore } from '@/stores/app';

const route = useRoute();
const store = useAppStore();

const menuItems = [
    { to: '/dashboard', label: 'Inici' },
    { to: '/graffiti/settings', label: 'Graffiti' },
    { to: '/gachapon', label: 'Gachapon' },
].map(item => ({
    ...item,
    active: route.path.startsWith(item.to)
}));

const props = defineProps({
    logoSrc: { type: String, required: true },
    logoLink: { type: String, default: '/' },
    profileImg: { type: String, required: true },
    profileOptions: { type: Array, required: true },
    logoutLink: { type: String, required: true },
    isLogged: { type: Boolean, required: true }
});

const navbarMobileMenuIsOpen = ref(false);
const profileOptionsIsOpen = ref(false);
</script>

<style scoped>
.navbarrr {
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
</style>
