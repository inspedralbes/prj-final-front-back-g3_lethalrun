import { useAppStore } from '@/stores/app';
import { defineNuxtRouteMiddleware } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to) => {
  const store = useAppStore();  // Asegúrate de acceder al store aquí

  // Si el usuario no está autenticado
  if (!store.getIsAuthenticated) {
    // Permite acceso a las rutas /auth/ y la página de inicio
    if (to.path === '/' || to.path.startsWith('/auth/')) {
      return;
    }
    // Redirige a login si intenta acceder a cualquier otra ruta
    return navigateTo('/auth/login');
  }

  // Si el usuario está autenticado
  else {
    // Redirige a la página de inicio si intenta acceder a rutas /auth/
    if (to.path.startsWith('/auth/')) {
      return navigateTo('/');
    }
  }
});
