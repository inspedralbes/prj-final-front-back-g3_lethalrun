<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar class="h-min" :logoSrc="'/LethalRun_logo-removebg-preview.png'" :logoLink="'/'"
      :profileImg="'/profile-icon.jpg'" :profileOptions="profileOptions" :logoutLink="logoutlink"
      :isLogged="isLogged" />
    
    <div class="flex-1 flex justify-center items-center p-6">
      <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <h1 class="text-2xl font-semibold text-gray-800 mb-4">El Meu Perfil</h1>
        
        <div class="space-y-4">
          <div>
            <label class="block text-gray-600 text-sm font-medium">Email</label>
            <p class="text-gray-800 bg-gray-200 p-2 rounded-md truncate">{{ user.email }}</p>
          </div>
          
          <div>
            <label class="block text-gray-600 text-sm font-medium">Nom d'usuari</label>
            <div class="flex gap-2">
              <div class="relative w-full">
                <input v-model="newUsername" type="text"
                  class="w-full border rounded-md p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <button v-if="!(newUsername.trim() === '' || newUsername === user.username)" 
                  @click="resetUsername" 
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                  </svg>
                </button>
              </div>
              <button @click="handleChangeUsername" 
                class="bg-blue-500 text-white px-4 py-2 rounded-md"
                :class="{
                  'bg-gray-400 cursor-not-allowed': newUsername.trim() === '' || newUsername === user.username,
                  'bg-blue-500 cursor-pointer hover:bg-blue-600 transition': newUsername.trim() !== '' && newUsername !== user.username
                }"
                :disabled="newUsername.trim() === '' || newUsername === user.username">
                <span class="whitespace-nowrap" v-if="!isLoadingNewUsername">Guardar canvis</span>
                <div v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <span>Carregant...</span>
                </div>
              </button>
            </div>
            <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-green-500 text-sm mt-2">{{ successMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue';
import { useAppStore } from '@/stores/app';
import { useUser } from '@/services/user';

const { updateUsername } = useUser();
const store = useAppStore();
const config = useRuntimeConfig();
const user = store.user;
const newUsername = ref(user.username);
const isLoadingNewUsername = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const resetUsername = () => {
  newUsername.value = user.username;
};

const handleChangeUsername = async () => {
  if (newUsername.value.trim() === '' || newUsername.value === user.username) return;

  errorMessage.value = ''; // Limpiar errores anteriores
  successMessage.value = ''; // Limpiar mensajes anteriores
  try {
    isLoadingNewUsername.value = true;
    const response = await updateUsername(newUsername.value);
    store.setNewUsername(newUsername.value);
    successMessage.value = response?.data?.message || 'Nombre de usuario actualizado exitosamente';
  } catch (err) {
    console.error(err);
    errorMessage.value = err.response?.data?.message || 'Error al actualizar el nombre de usuario';
  } finally {
    isLoadingNewUsername.value = false;
  }
};

const profileOptions = [{ to: '/profile/my-info', label: 'El meu perfil' }];
const logoutlink = `${config.public.apiUrl}/api/auth/logout`;
const isLogged = store.getIsAuthenticated;

watchEffect(() => {
  newUsername.value = user.username;
});
</script>
