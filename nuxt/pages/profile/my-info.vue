<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar class="h-min" :logoSrc="'/LethalRun_logo-removebg-preview.png'" :logoLink="'/'"
      :profileImg="'/profile-icon.jpg'" :profileOptions="profileOptions" :logoutLink="logoutlink"
      :isLogged="isLogged" />

    <div class="flex-1 flex justify-center items-center p-6 container-profile">
      <div class="shadow-lg rounded-lg p-8 w-full max-w-lg" style="background: rgba(30, 20, 20, 0.95);">
        <h1 class="text-2xl font-bold text-white mb-6">El Meu Perfil</h1>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1" style="color: #fff;">Email</label>
            <p class="w-full px-4 py-2 rounded-lg shadow-sm truncate"
              style="background: rgba(255, 255, 255, 0.08); border: 1px solid #ffb300; color: #ccc;">{{ user.email }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const config = useRuntimeConfig();

/**
 * Reactive property representing the current user.
 * @type {Object}
 */
const user = store.user;

/**
 * Navigation options for the user profile.
 * @type {Array<Object>}
 */
const profileOptions = [{ to: '/profile/my-info', label: 'El meu perfil' }];

/**
 * URL for logging out the user.
 * @type {string}
 */
const logoutlink = `${config.public.authUrl}/auth/logout`;

/**
 * Reactive property to determine if the user is authenticated.
 * @type {boolean}
 */
const isLogged = store.getIsAuthenticated;


</script>


<style scoped>
.container-profile {
  background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);
}
</style>
