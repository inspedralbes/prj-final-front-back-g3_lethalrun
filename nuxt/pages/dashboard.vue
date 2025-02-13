<template>
  <div class="min-h-screen flex flex-col bg-white">
    <Navbar class="h-min"
      :logoSrc="'/LethalRun_logo-removebg-preview.png'"
      :logoLink="'/'"
      :menuItems="menuItems"
      :profileImg="'/profile-icon.jpg'"
      :profileOptions="profileOptions"
      :logoutLink="logoutlink"
      :isLogged="isLogged"
    />

    <div class="flex-1 container mx-auto px-4 py-12">
      <section class="mb-24">
        <h1 class="text-6xl font-black text-center mb-8">LethalRun</h1>
        <p class="text-2xl text-center max-w-3xl mx-auto mb-12">Un juego de plataformas y trampas inspirado en las Deathruns de Garry's Mod, donde la rapidez y la precisión son clave para la supervivencia.</p>
        <div class="flex justify-center">
          <a href="#" class="bg-black text-white font-bold text-xl py-4 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300">¡Juega ahora!</a>
        </div>
      </section>

      <section class="mb-24 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 pr-8">
          <h2 class="text-4xl font-bold mb-6">¿Qué es LethalRun?</h2>
          <p class="text-xl mb-4">LethalRun es un desafío constante donde cada nivel pone a prueba tus reflejos y tu ingenio. Esquiva trampas, supera obstáculos y compite contra otros jugadores en recorridos llenos de peligros mortales.</p>
          <p class="text-xl">Ya sea jugando solo o con amigos, cada partida es una experiencia única llena de momentos emocionantes e impredecibles.</p>
        </div>
        <div class="md:w-1/2 mt-8 md:mt-0">
          <img src="" alt="Gameplay de LethalRun" class="w-full h-auto rounded-lg shadow-2xl" />
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold text-center mb-12">¿Quiénes somos?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student1.jpg" alt="Estudiante 1" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">Alex</h3>
            <p class="text-gray-600">Diseñador de niveles</p>
          </div>
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student2.jpg" alt="Estudiante 2" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">Sam</h3>
            <p class="text-gray-600">Programador principal</p>
          </div>
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student3.jpg" alt="Estudiante 3" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">Jordan</h3>
            <p class="text-gray-600">Artista 3D</p>
          </div>
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student4.jpg" alt="Estudiante 4" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">Taylor</h3>
            <p class="text-gray-600">Diseñador de sonido</p>
          </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold mb-8">Personaliza tu experiencia</h2>
        <div class="flex flex-col md:flex-row items-center bg-gray-100 rounded-lg overflow-hidden">
          <div class="md:w-1/2 p-8">
            <h3 class="text-2xl font-semibold mb-4">Sistema de graffitis</h3>
            <p class="text-xl mb-4">Deja tu marca en el juego con nuestro sistema de graffitis personalizados. Sube tus propias imágenes y úsalas para decorar los niveles mientras juegas.</p>
            <ul class="list-disc list-inside text-lg">
              <li>Sube tus diseños</li>
              <li>Personaliza el tamaño y la rotación</li>
              <li>Comparte con otros jugadores</li>
            </ul>
          </div>
          <div class="md:w-1/2">
           </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold text-center mb-12">Características destacadas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <i class="fas fa-map-marked-alt text-5xl mb-4"></i>
            <h3 class="text-2xl font-semibold mb-2">Niveles dinámicos</h3>
            <p class="text-lg">Mapas que cambian en tiempo real, ofreciendo nuevos desafíos en cada partida.</p>
          </div>
          <div class="text-center">
            <i class="fas fa-users text-5xl mb-4"></i>
            <h3 class="text-2xl font-semibold mb-2">Multijugador</h3>
            <p class="text-lg">Compite contra amigos o únete a partidas globales con jugadores de todo el mundo.</p>
          </div>
          <div class="text-center">
            <i class="fas fa-trophy text-5xl mb-4"></i>
            <h3 class="text-2xl font-semibold mb-2">Sistema de ranking</h3>
            <p class="text-lg">Demuestra tu habilidad y sube en la clasificación global de jugadores.</p>
          </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold mb-8">Próximamente</h2>
        <div class="bg-gray-900 text-white p-8 rounded-lg">
          <h3 class="text-2xl font-semibold mb-4">Nuevos cosméticos en camino</h3>
          <p class="text-xl mb-6">Estamos trabajando en expandir las opciones de personalización para tu experiencia en LethalRun. Pronto podrás disfrutar de:</p>
          <ul class="list-disc list-inside text-lg mb-6">
            <li>Skins para personajes</li>
            <li>Efectos visuales personalizados</li>
            <li>Emotes y animaciones únicas</li>
          </ul>
          <a href="#" class="inline-block bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors duration-300">Más información</a>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold text-center mb-12">Únete a nuestra comunidad</h2>
        <div class="flex flex-wrap justify-center gap-8">
          <a href="#" class="flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors duration-300">
            <i class="fab fa-discord text-3xl"></i>
          </a>
          <a href="#" class="flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors duration-300">
            <i class="fab fa-twitter text-3xl"></i>
          </a>
          <a href="#" class="flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors duration-300">
            <i class="fab fa-youtube text-3xl"></i>
          </a>
          <a href="#" class="flex items-center justify-center w-16 h-16 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors duration-300">
            <i class="fab fa-instagram text-3xl"></i>
          </a>
        </div>
      </section>
    </div>

    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2025 LethalRun. Todos los derechos reservados.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app';

const store = useAppStore();
const config = useRuntimeConfig();

const user = store.user;

const menuItems = [
  { to: '/dashboard', label: 'Inicio', active: true },
  { to: '/graffiti/settings', label: 'Graffiti', active: false },
];

const profileOptions = [
  { to: '/profile/my-info', label: 'Your Profile' }
];

const logoutlink = `${config.public.apiUrl}/api/auth/logout`;

const isLogged = store.getIsAuthenticated;

const logout = () => {
    window.location.href = `${config.public.apiUrl}/api/auth/logout`;
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}

/* Animación suave para los enlaces */
a {
  transition: all 0.3s ease;
}

/* Efecto hover para las imágenes */
img {
  transition: transform 0.3s ease;
}

img:hover {
  transform: scale(1.05);
}

/* Estilo para los iconos */
.fas, .fab {
  transition: transform 0.3s ease;
}

.fas:hover, .fab:hover {
  transform: translateY(-5px);
}
</style>
