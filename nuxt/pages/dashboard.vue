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
        <p class="text-2xl text-center max-w-3xl mx-auto mb-12">Un joc de plataformes i trampes inspirat en les Deathruns de Garry's Mod, on la rapidesa i la precisió són clau per a la supervivència.</p>
        <div class="flex justify-center">
          <a href="#" class="bg-black text-white font-bold text-xl py-4 px-8 rounded-full hover:bg-gray-800 transition-colors duration-300">Juga ara!</a>
        </div>
      </section>

      <section class="mb-24 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 pr-8">
          <h2 class="text-4xl font-bold mb-6">Què és LethalRun?</h2>
          <p class="text-xl mb-4">LethalRun és un desafiament constant on cada nivell posa a prova els teus reflexos i el teu enginy. Esquiva trampes, supera obstacles i competeix contra altres jugadors en recorreguts plens de perills mortals.</p>
          <p class="text-xl">Ja sigui jugant sol o amb amics, cada partida és una experiència única plena de moments emocionants i imprevisibles.</p>
        </div>
        <div class="md:w-1/2 mt-8 md:mt-0">
          <img src="/images/dashboard1.png" alt="Gameplay de LethalRun" class="w-full h-auto rounded-lg shadow-2xl" />
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold text-center mb-12">Qui som?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student1.jpg" alt="Estudiant 1" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">Brian</h3>
            <p class="text-gray-600">Programador/Dissenyador de nivells</p>
          </div>
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student2.jpg" alt="Estudiant 2" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">David</h3>
            <p class="text-gray-600">Programador/Dissenyador Web</p>
          </div>
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student3.jpg" alt="Estudiant 3" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">Izan</h3>
            <p class="text-gray-600">Programador/Dissenyador Web</p>
          </div>
          <div class="bg-gray-100 p-6 rounded-lg text-center hover:shadow-xl transition-shadow duration-300">
            <!-- <img src="/images/student4.jpg" alt="Estudiant 4" class="w-32 h-32 rounded-full mx-auto mb-4 object-cover" /> -->
            <h3 class="text-xl font-semibold mb-2">Marc</h3>
            <p class="text-gray-600">Programador/Dissenyador de nivells</p>
          </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold mb-8">Personalitza la teva experiència</h2>
        <div class="flex flex-col md:flex-row items-center bg-gray-100 rounded-lg overflow-hidden">
          <div class="md:w-1/2 p-8">
            <h3 class="text-2xl font-semibold mb-4">Sistema de graffitis</h3>
            <p class="text-xl mb-4">Deixa la teva marca en el joc amb el nostre sistema de graffitis personalitzats. Puja les teves pròpies imatges i utilitza-les per decorar els nivells mentre jugues.</p>
            <ul class="list-disc list-inside text-lg">
              <li>Puja els teus dissenys</li>
              <li>Personalitza la mida i la rotació</li>
              <li>Comparteix amb altres jugadors</li>
            </ul>
          </div>
          <div class="md:w-1/2">
            <img src="/images/dashboard3.png" alt="Gameplay de LethalRun" class="w-full h-auto rounded-lg shadow-2xl" />
           </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold text-center mb-12">Característiques destacades</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <i class="fas fa-map-marked-alt text-5xl mb-4"></i>
            <h3 class="text-2xl font-semibold mb-2">Nivells dinàmics</h3>
            <p class="text-lg">Mapes que canvien en temps real, oferint nous desafiaments en cada partida.</p>
          </div>
          <div class="text-center">
            <i class="fas fa-users text-5xl mb-4"></i>
            <h3 class="text-2xl font-semibold mb-2">Multijugador</h3>
            <p class="text-lg">Competeix contra amics o uneix-te a partides globals amb jugadors de tot el món.</p>
          </div>
          <div class="text-center">
            <i class="fas fa-trophy text-5xl mb-4"></i>
            <h3 class="text-2xl font-semibold mb-2">Sistema de cosmètics</h3>
            <p class="text-lg">Personalitza el teu entorn al teu gust quan i com vulguis.</p>
          </div>
        </div>
      </section>

      <section class="mb-24">
        <h2 class="text-4xl font-bold mb-8">Pròximament</h2>
        <div class="bg-gray-900 text-white p-8 rounded-lg">
          <h3 class="text-2xl font-semibold mb-4">Nous cosmètics en camí</h3>
          <p class="text-xl mb-6">Estem treballant en expandir les opcions de personalització per a la teva experiència en LethalRun. Aviat podràs gaudir de:</p>
          <ul class="list-disc list-inside text-lg mb-6">
            <li>Skins per a personatges</li>
            <li>Efectes visuals personalitzats</li>
            <li>Emotes i animacions úniques</li>
          </ul>
          <!-- <a href="#" class="inline-block bg-white text-black font-bold py-2 px-6 rounded-full hover:bg-gray-200 transition-colors duration-300">Més informació</a> -->
        </div>
      </section>

      <!-- <section class="mb-24">
        <h2 class="text-4xl font-bold text-center mb-12">Uneix-te a la nostra comunitat</h2>
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
      </section> -->
    </div>

    <footer class="bg-gray-900 text-white py-8">
      <div class="container mx-auto px-4 text-center">
        <p>&copy; 2025 LethalRun. Tots els drets reservats.</p>
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
