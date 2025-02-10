<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="h-min" :logoSrc="'/LethalRun_logo-removebg-preview.png'" :logoLink="'/'" :menuItems="menuItems"
      :profileImg="'/profile-icon.jpg'" :profileOptions="profileOptions" :logoutLink="logoutLink"
      :isLogged="isLogged" />
    <div class="flex-1 bg-gray-100 py-8">

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <form @submit.prevent="uploadGraffitiHandler" class="mt-8">
          <h2 class="text-2xl font-semibold text-gray-800">Upload New Graffiti</h2>
          <input type="file" @change="handleFileChange"
            class="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <button type="submit" :disabled="!selectedFile"
            class="mt-4 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            Upload
          </button>
        </form>

        <div v-if="graffitis.length > 0" class="mt-8">
          <h2 class="text-2xl font-semibold text-gray-800">Tus Graffitis</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            <div v-for="graffiti in graffitis" :key="graffiti.id"
              class="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <img :src="graffiti.path" alt="Graffiti Image"
                class="w-full h-auto rounded-xl mb-4 border-4 border-transparent hover:border-gray-300 transition-all duration-300 ease-in-out" />

              <div class="w-full container-buttons flex justify-between items-center">

                <!-- Botón "Set Active" -->
                <button v-if="!graffiti.is_active" @click="setActiveGraffiti(graffiti.id)"
                  class="cursor-pointer bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                  Set Active
                </button>

                <!-- Estado Activo -->
                <p v-else
                  class="cursor-default bg-green-600 text-white p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                  Active
                </p>

                <!-- Botón "Delete" -->
                <button @click="deleteGraffiti(graffiti.id)"
                  class="cursor-pointer bg-red-600 text-white p-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200">
                  Delete
                </button>

              </div>

            </div>

          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app';
import { useGraffitis } from '@/services/graffitis';

const store = useAppStore();
const { getGraffitis, uploadGraffiti, deleteGraffiti, setActiveGraffiti } = useGraffitis();
const config = useRuntimeConfig();

const user = store.user;
const isLogged = store.getIsAuthenticated;
const menuItems = [
  { to: '/dashboard', label: 'Dashboard', active: true },
  { to: '/graffiti/settings', label: 'Graffiti', active: false }
];

const profileOptions = [
  { to: '/profile/my-info', label: 'Your Profile' }
];

const logoutLink = `${config.public.apiUrl}/api/auth/logout`;

let selectedFile = ref(null);
let graffitis = ref([]);

const fetchGraffitis = async () => {
  try {
    // graffitis = await getGraffitis();
    graffitis = [
      // Ejemplo 1: Graffiti activo con ruta personalizada
      {
        id: 1,
        is_active: true,
        path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s',
        user_id: 1
      },

      // Ejemplo 2: Graffiti inactivo con ruta por defecto
      {
        id: 2,
        is_active: false,
        path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s',
        user_id: 2
      },

      // Ejemplo 3: Graffiti activo con ruta personalizada
      {
        id: 3,
        is_active: false,
        path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s',
        user_id: 3
      },

      // Ejemplo 4: Graffiti inactivo con ruta por defecto
      {
        id: 4,
        is_active: false,
        path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s',
        user_id: 4
      },

      // Ejemplo 5: Graffiti activo con ruta personalizada
      {
        id: 5,
        is_active: false,
        path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s',
        user_id: 5
      },

      // Ejemplo 6: Graffiti inactivo con ruta por defecto
      {
        id: 6,
        is_active: false,
        path: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm2-IiCQnnEHH1dk5HN2K60xrv8Wyu8VRW7Q&s',
        user_id: 6
      }
    ];

  } catch (error) {
    console.error('Error fetching graffitis:', error);
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0]; // Obtenemos el primer archivo
  if (file) {
    selectedFile.value = file; // Establecemos el archivo seleccionado
  } else {
    selectedFile.value = null; // Si no hay archivo, lo dejamos en null
  }
};

const uploadGraffitiHandler = async () => {
  if (selectedFile.value) {
    const formData = new FormData();
    formData.append('file', selectedFile.value); // Agrega el archivo al FormData
    try {
      const response = await uploadGraffiti(formData);
      selectedFile.value = null; // Limpiar después de subir
      await fetchGraffitis(); // Refrescar la lista de graffitis
    } catch (error) {
      console.error('Error uploading graffiti:', error);
    }
  }
};

// Función para subir la imagen al servidor
const uploadPicture = async () => {
  if (!file.value) {
    alert('Por favor, selecciona un archivo primero');
    return;
  }

  try {
    // Crear el FormData
    const formData = new FormData();
    formData.append('file', file.value);

    // Suponiendo que tienes un `userId` disponible
    const userId = 123;  // Reemplaza esto con el `userId` real

    // Enviar el archivo al backend usando `$fetch`
    const response = await $fetch('/pictures', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,  // Si usas autenticación
      },
      query: { userId }, // Enviar `userId` como parámetro
    });

    console.log('Imagen subida exitosamente:', response);
    alert('Imagen subida exitosamente');
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    alert('Error al subir la imagen');
  }
};


const deleteGraffitiHandler = async (id) => {
  try {
    await deleteGraffiti(id);
    await fetchGraffitis();
  } catch (error) {
    console.error('Error deleting graffiti:', error);
  }
};

const setActiveGraffitiHandler = async (id) => {
  try {
    await setActiveGraffiti(id);
    await fetchGraffitis();
  } catch (error) {
    console.error('Error setting graffiti as active:', error);
  }
};

fetchGraffitis();
</script>

<style scoped>
/* Optional styles */
</style>
