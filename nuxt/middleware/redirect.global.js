// middleware/auth.global.js
export default defineNuxtRouteMiddleware((to) => {
  // const { isAuthenticated } = useAuth() // Asume que tienes un composable useAuth
  
  // Si el usuario no está autenticado
  // if (false) {
  //   // Permite acceso a la página de inicio y rutas que comienzan con /auth/
  //   if (to.path === '/' || to.path.startsWith('/auth/')) {
  //     return
  //   }
  //   // Redirige a login si intenta acceder a cualquier otra ruta
  //   return navigateTo('/auth/login')
  // }
  
  // // Si el usuario está autenticado
  // else {
  //   // Redirige a la página de inicio si intenta acceder a rutas /auth/
  //   if (to.path.startsWith('/auth/')) {
  //     return navigateTo('/')
  //   }
  // }
})
