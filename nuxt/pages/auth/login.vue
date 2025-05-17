<script setup>
import { ref } from 'vue';
import { useAuth } from "@/services/auth";
import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

const store = useAppStore();
const router = useRouter();
const config = useRuntimeConfig();
const { login } = useAuth();

const isLoading = ref(false);
const isLoadingGoogle = ref(false);

// Datos del formulario
const email = ref('');
const password = ref('');

// Función para iniciar sesión con email y contraseña
const handleLogin = async () => {
  isLoading.value = true;
  console.log({ email: email.value, password: password.value });

  try {
    const response = await login(email.value, password.value);
    console.log("Inicio de sesión exitoso:", response);
    store.setUser(response.user);
    store.setToken(response.token);
    store.setIsAuthenticated(true);
    console.log("Usuario autenticado:", store.user);
    router.push("/");
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
  } finally {
    isLoading.value = false;
  }
};

const handleGoogleLogin = () => {
  isLoadingGoogle.value = true;
  window.location.href = `${config.public.authUrl}/auth/google`;
}
</script>

<template >
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
      <h1 class="text-2xl font-bold text-center mb-6" style="color: #fff;">Iniciar Sesión</h1>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium" style="color: #fff;">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" required
            class="mt-1 w-full px-4 py-2 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
            style="background: rgba(255, 255, 255, 0.08); border: 1px solid #ffb300; color: #fff;" />
        </div>

        <!-- Password Input -->
        <div class="mb-0">
          <label for="password" class="block text-sm font-medium" style="color: #fff;">Contraseña</label>
          <input type="password" id="password" v-model="password" required
            class="mt-1 w-full px-4 py-2 rounded-lg shadow-sm focus:ring-yellow-400 focus:border-yellow-400"
            style="background: rgba(255, 255, 255, 0.08); border: 1px solid #ff7043; color: #fff;" />
        </div>
        <!-- Forgot Password Link -->
        <div class="text-right">
          <NuxtLink to="/auth/forgot-password" class="text-yellow-300 text-sm hover:underline">¿Olvidaste tu contraseña?</NuxtLink>
        </div>

        <!-- Submit Button -->
        <button type="submit"
          class="cursor-pointer w-full font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          :disabled="isLoading"
          style="background: linear-gradient(90deg, #ff1744 0%, #ff9100 60%, #fff176 100%); color: #fff;">
          <span v-if="!isLoading">Iniciar Sesión</span>
          <div v-else class="flex items-center justify-center">
            <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>Cargando...</span>
          </div>
        </button>
      </form>

      <!-- Divider -->
      <div class="flex items-center my-6">
        <div class="border-t flex-grow" style="border-color: #ffb300;"></div>
        <span class="mx-4 text-sm" style="color: #fff176;">O</span>
        <div class="border-t flex-grow" style="border-color: #ffb300;"></div>
      </div>

      <!-- Google Login -->
      <button @click="handleGoogleLogin"
        class="cursor-pointer flex items-center justify-center border rounded-lg shadow-md px-6 py-2 text-sm font-medium w-full"
        :disabled="isLoadingGoogle"
        style="background: linear-gradient(90deg, #fff176 0%, #ff9100 100%); border-color: #ffb300; color: #fff;">
        <svg v-if="!isLoadingGoogle" class="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48"
          version="1.1">
          <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Color-" transform="translate(-401.000000, -860.000000)">
              <g id="Google" transform="translate(401.000000, 860.000000)">
                <path
                  d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                  fill="#FBBC05"></path>
                <path
                  d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                  fill="#EB4335"></path>
                <path
                  d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                  fill="#34A853"></path>
                <path
                  d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                  fill="#4285F4"></path>
              </g>
            </g>
          </g>
        </svg>
        <span v-if="!isLoadingGoogle">Continuar con Google</span>
        <div v-else class="flex items-center">
          <svg class="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <span>Cargando...</span>
        </div>
      </button>

      <div class="mt-4 text-center">
        <p class="text-sm" style="color: #fff;">¿No tienes cuenta?
          <NuxtLink to="/auth/register" class="text-yellow-300 hover:underline">Registrate</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</div>
</template>
