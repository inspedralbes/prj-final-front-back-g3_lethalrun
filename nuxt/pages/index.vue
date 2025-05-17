<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const config = useRuntimeConfig();
const route = useRoute();
const profileOptions = [{ to: '/profile/my-info', label: 'El meu perfil' }];

const user = store.user;


</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="h-min" 
      :logoSrc="'/LethalRun_logo-removebg-preview.png'" 
      :logoLink="'/'" :menuItems="[]"
      :profileImg="'/profile-icon.jpg'" 
      :profileOptions="profileOptions" 
      :logoutLink="''" 
      :isLogged="store.getIsAuthenticated" />
      
    <div class="flex-1 flex flex-col items-center justify-center bg-gray-100 p-4 boby-index">
      <div class="text-center max-w-md">
        <h1 class="text-4xl font-bold text-gray-900">Benvingut a LethalRun<span v-if="store.getIsAuthenticated">, {{ user.username }}</span> </h1>
        <p class="text-gray-600 mt-2 text-lg italic tracking-wide drop-shadow-md" style="background: linear-gradient(90deg, #ff3636, #ffb347, #cfd136); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; text-fill-color: transparent;">
          Personalitza la teva experiència
        </p>

        <div v-if="!store.getIsAuthenticated" class="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/auth/register"
            class="register-button px-6 py-3 rounded-lg text-lg font-semibold">
            Registrarse
          </NuxtLink>
          <NuxtLink to="/auth/login"
            class="login-button px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Iniciar sesión
          </NuxtLink>

        </div>
        <div v-else class="mt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <NuxtLink to="/dashboard"
            class="enter-button px-6 py-3 text-white rounded-lg text-lg font-semibold">
            Entrar >
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.boby-index {
  background-image: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);
}

h1{
  font-size: 3em;
    text-transform: uppercase;
    margin: 0;
    text-shadow: 0 0 10px var(--primary), 0 0 20px var(--primary);
    background: linear-gradient(to right, #ff3636, #ff4242, #ff3636);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: glow 2s ease-in-out infinite alternate;
}

.login-button {
  background: transparent;
  color: #ff3636;
  border: 2px solid #ff3636;
  box-shadow: 0 2px 8px rgba(255, 54, 54, 0.2);
  transition: 
    color 0.3s cubic-bezier(0.4,0,0.2,1),
    border-color 0.3s cubic-bezier(0.4,0,0.2,1),
    box-shadow 0.3s cubic-bezier(0.4,0,0.2,1),
    transform 0.2s cubic-bezier(0.4,0,0.2,1);
}

.login-button:hover {
  color: #ffb347;
  border-color: #ffb347;
  box-shadow: 0 0 20px 4px #ff3636, 0 0 40px 8px #ffb347;
  transform: translateY(-2px) scale(1.04);
  animation: login-glow 0.8s alternate infinite;
}

@keyframes login-glow {
  from {
    box-shadow: 0 0 20px 4px #ff3636, 0 0 40px 8px #ffb347;
  }
  to {
    box-shadow: 0 0 30px 10px #ff3636, 0 0 60px 16px #ffb347;
  }
}

.register-button {
  background: linear-gradient(to right, #ff3636, #ffb347);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 54, 54, 0.2);
  transition: 
    box-shadow 0.3s cubic-bezier(0.4,0,0.2,1),
    transform 0.2s cubic-bezier(0.4,0,0.2,1);
}

.register-button:hover {
  box-shadow: 0 0 20px 4px #ff3636, 0 0 40px 8px #ffb347;
  transform: translateY(-2px) scale(1.04);
  animation: register-glow 0.8s alternate infinite;
}

@keyframes register-glow {
  from {
    box-shadow: 0 0 20px 4px #ff3636, 0 0 40px 8px #ffb347;
  }
  to {
    box-shadow: 0 0 30px 10px #ff3636, 0 0 60px 16px #ffb347;
  }
}

.enter-button {
  background: linear-gradient(to right, #ffffff, #ffffff, #ffffff);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gloww 2s ease-in-out infinite alternate;
  
}

@keyframes gloww {
    from {
        text-shadow: 0 0 10px var(--text), 0 0 20px var(--text);
    }

    to {
        text-shadow: 0 0 15px var(--text), 0 0 30px var(--text), 0 0 40px var(--text);
    }
}

</style>
