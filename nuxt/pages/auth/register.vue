<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="h-min"
      :logoSrc="'/LethalRun_logo-removebg-preview.png'"
      :logoLink="'/'"
      :menuItems="[]"
      :profileImg="'/profile-icon.jpg'"
      :profileOptions="[]"
      :logoutLink="''"
      :isLogged="false"
    />

    <div class="flex-1 flex items-center justify-center" style="background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);">
    <div class="shadow-lg rounded-lg p-8 max-w-md w-96" style="background: rgba(30, 20, 20, 0.95);">
      <h1 class="text-2xl font-bold text-center mb-6" style="color: #fff;">Registre</h1>

      <!-- Missatges d'error o èxit -->
      <div v-if="message" :class="{
        'bg-red-500 text-white': messageType === 'error',
        'bg-green-500 text-white': messageType === 'success'
      }" class="p-3 rounded-md text-center mb-4 transition-all duration-300">
        {{ message }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Nom d'usuari -->
        <div>
          <label class="block text-sm font-medium" style="color: #fff;">Nom d'usuari</label>
          <input v-model="username" type="text"
            class="mt-1 w-full px-4 py-2 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
            style="background: rgba(255, 255, 255, 0.08); border: 1px solid #ffb300; color: #fff;" />
        </div>

        <!-- Correu electrònic -->
        <div>
          <label class="block text-sm font-medium" style="color: #fff;">Correu electrònic</label>
          <input v-model="email" type="email"
            class="mt-1 w-full px-4 py-2 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
            style="background: rgba(255, 255, 255, 0.08); border: 1px solid #ffb300; color: #fff;" />
        </div>

        <!-- Contrasenya -->
        <div class="mb-0">
          <label class="block text-sm font-medium" style="color: #fff;">Contrasenya</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password"
              class="mt-1 w-full px-4 py-2 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
              style="background: rgba(255, 255, 255, 0.08); border: 1px solid #ff7043; color: #fff;"/>
            <button type="button" @click="togglePassword"
              class="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-gray-300 p-2 cursor-pointer focus:outline-none">
              <span v-if="showPassword">🔓</span>
              <span v-else>🔒</span>
            </button>
          </div>
        </div>

        <!-- Botó de registre -->
        <button type="submit"
          class="cursor-pointer w-full font-medium mt-8 py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          :disabled="isLoading"
          style="background: linear-gradient(90deg, #ff1744 0%, #ff9100 60%, #fff176 100%); color: #fff;">
          <span v-if="!isLoading">Registrar-se</span>
          <div v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>Carregant...</span>
          </div>
        </button>
      </form>

      <div class="mt-4 text-center">
        <p class="text-sm" style="color: #fff;">Ja tens un compte?
          <NuxtLink to="/auth/login" class="text-yellow-300 hover:underline">Inicia sessió</NuxtLink>
        </p>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from "@/services/auth";

const { register } = useAuth();

const isLoading = ref(false);
const message = ref(null);
const messageType = ref(null);

const username = ref('');
const email = ref('');
const password = ref('');
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleRegister = async () => {
  isLoading.value = true;
  message.value = null;
  messageType.value = null;
  
  try {
    const response = await register(username.value, email.value, password.value);
    messageType.value = "success";
    message.value = "Sol·licitud de registre enviada amb èxit. Revisa el teu correu per completar el registre.";

    // Netejar els camps
    username.value = '';
    email.value = '';
    password.value = '';

  } catch (error) {
    messageType.value = "error";
    message.value = error.response?.data?.message || "Error en el registre.";
  } finally {
    isLoading.value = false;
  }
};
</script>
