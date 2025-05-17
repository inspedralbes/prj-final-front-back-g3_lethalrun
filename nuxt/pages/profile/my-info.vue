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

          <div>
            <label class="block text-sm font-medium mb-1" style="color: #fff;">Nom d'usuari</label>
            <div class="flex gap-3">
              <div class="relative w-full">
                <input v-model="newUsername" type="text"
                  class="w-full px-4 py-2 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400 pr-10"
                  style="background: rgba(255, 255, 255, 0.08); border: 1px solid #ffb300; color: #fff;"
                  placeholder="Nou nom d'usuari" />
                <button v-if="!(newUsername.trim() === '' || newUsername === user.username)" @click="resetUsername"
                  class="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
                    fill="currentColor">
                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                  </svg>
                </button>
              </div>
              <button @click="handleChangeUsername"
                class="font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 whitespace-nowrap"
                :style="[
                  (newUsername.trim() === '' || newUsername === user.username)
                    ? { background: '#555', color: '#aaa', cursor: 'not-allowed' }
                    : { background: 'linear-gradient(90deg, #ff1744 0%, #ff9100 60%, #fff176 100%)', color: '#fff', cursor: 'pointer' }
                ]" :disabled="newUsername.trim() === '' || newUsername === user.username">
                <span v-if="!isLoadingNewUsername">Guardar canvis</span>
                <div v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  <span>Carregant...</span>
                </div>
              </button>
            </div>
            <p v-if="errorMessage" class="text-sm mt-2" style="color: #f87171;">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-sm mt-2" style="color: #4ade80;">{{ successMessage }}</p>
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
const logoutlink = `${config.public.authUrl}/auth/logout`;
const isLogged = store.getIsAuthenticated;

watchEffect(() => {
  newUsername.value = user.username;
});
</script>


<style scoped>
.container-profile {
  background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);
}
</style>
