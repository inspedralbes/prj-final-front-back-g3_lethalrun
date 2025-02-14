<template>
  <div class="min-h-screen w-full flex flex-col">
    <Navbar class="h-min" :logoSrc="'/LethalRun_logo-removebg-preview.png'" :logoLink="'/'" :menuItems="menuItems"
      :profileImg="'/profile-icon.jpg'" :profileOptions="profileOptions" :logoutLink="logoutLink"
      :isLogged="isLogged" />
    <div class="bg-gray-100 py-8 h-full flex-grow">


      <div id="contt" class="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex flex-col">

        <div v-if="graffitis.length > 0" class="pt-8 h-full w-full ">
          <div
            class="flex flex-col xs:flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row justify-between items-center">
            <h2 class="text-2xl font-semibold text-gray-800 truncate">Els teus Graffitis</h2>

            <!-- Paginación -->
            <div class="flex justify-center items-center">
              <button @click="currentPage > 1 && (currentPage -= 1)" 
                :class="currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 cursor-pointer'"
                :disabled="currentPage === 1"
                class="px-4 text-center py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors duration-200">
                <
              </button>

              <span class="mx-4 text-gray-700">Pàgina {{ currentPage }} de {{ totalPages }}</span>

              <button @click="currentPage < totalPages && (currentPage += 1)"
                :class="currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700 cursor-pointer'"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors duration-200">
                >
              </button>
            </div>

            <!-- Botón para abrir el modal -->
            <button @click="openModal" class="cursor-pointer bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 truncate">
              Afegir Graffiti
            </button>
          </div>


          <!-- Graffitis container -->
          <div class="h-full flex flex-col mt-6 justify-between items-center">
            <!-- Grid de graffitis -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4 w-full">
              <div v-for="graffiti in paginatedGraffitis" :key="graffiti.id"
                class="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
                <img :src="getPath(graffiti.path)" alt="Graffiti Image"
                  class="w-full h-auto rounded-xl mb-4 border-4 border-transparent hover:border-gray-300 transition-all duration-300 ease-in-out" />

                <div class="w-full container-buttons flex justify-between items-center">
                  <!-- Botón "Set Active" -->
                  <button v-if="!graffiti.is_active" @click="setActiveGraffitiHandler(graffiti.id)"
                    class="cursor-pointer truncate bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                    Activar imatge
                  </button>

                  <!-- Estado Activo -->
                  <p v-else
                    class="cursor-default truncate bg-green-600 text-white p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                    Activa
                  </p>

                  <!-- Botón "Delete" -->
                  <button @click="deleteGraffitiHandler(graffiti.id)" :disabled="graffiti.is_active" :class="graffiti.is_active
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 cursor-pointer'"
                    :title="graffiti.is_active ? 'No se puede eliminar porque está activo' : ''"
                    class="truncate text-white p-2 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200">
                    Borrar
                  </button>
                </div>
              </div>
            </div>

          </div>


        </div>

      </div>
    </div>
  </div>
  <!-- Modal con vue-cropper -->
  <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div class="bg-white rounded-xl shadow-2xl p-6 w-4xl max-w-full relative">

        <!-- Header -->
        <div class="flex justify-between items-center border-b pb-4">
            <h2 class="text-2xl font-semibold text-gray-900">Pujar Nou Graffiti</h2>
          <button @click="closeModal"
            class="cursor-pointer text-gray-500 text-red-600 transition hover:bg-red-200 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Body con grid -->
        <div class="mt-4 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 w-full gap-1 justify-center">

          <!-- Sección de subida y recorte -->
          <div class="flex flex-col justify-between items-center w-full">
            <!-- Botón para abrir selector de archivos -->
            <button @click.prevent="showFileChooser"
              class="cursor-pointer w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition">
              Selecciona una imatge
            </button>
            <input ref="fileInput" type="file" class="hidden" @change="onFileChange" accept="image/jpeg, image/png" />

            <!-- Cropper -->
            <div v-if="imageSrc" class="mt-3 w-full">
              <vue-cropper ref="cropper" class="w-full h-auto max-w-full max-h-full" :src="imageSrc" :aspect-ratio="1"
                :fixed-aspect-ratio="true">
              </vue-cropper>
            </div>



            <!-- Botón para recortar -->
            <button v-if="imageSrc" @click="cropImage"
              class="cursor-pointer mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Retalla la imatge
            </button>
          </div>

          <!-- Previsualización de la imagen -->
          <div class="flex flex-col justify-between items-center w-full">
            <h3 class="text-1xl py-2 font-semibold text-gray-900">Previsualizació</h3>
            <div class="sm:w-70 md:w-70 max-w-70 aspect-w-1 aspect-h-1">
              <img v-if="croppedImage" :src="croppedImage" alt="Cropped Image"
                class="sm:w-70 md:w-70 w-full h-full object-cover rounded-lg shadow-md">
            </div>
            <button v-if="croppedImage" @click="uploadImage"
              class="cursor-pointer mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
              Pujar Graffiti
            </button>
          </div>

        </div>


        <!-- Footer -->
        <div class="mt-6 flex justify-end gap-2">
          <button @click="closeModal"
            class="cursor-pointer bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition">
            Cancelar
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { useNuxtApp } from '#app';
import { ref, onMounted, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/app';
import { useGraffitis } from '@/services/graffitis';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

const { $socket } = useNuxtApp();
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
  { to: '/profile/my-info', label: 'El meu perfil' }
];

const logoutLink = `${config.public.apiUrl}/api/auth/logout`;

let graffitis = ref([]);
let isModalOpen = ref(false); // Estado para el modal

const fetchGraffitis = async () => {
  try {
    const data = await getGraffitis();
    graffitis.value = data;
    console.log('Graffitis:', data);

  } catch (error) {
    console.error('Error fetching graffitis:', error);
  }
};

const getPath = (path) => {
  return `${config.public.apiUrl}/images/${path}`;
};


// Funciones para controlar la visibilidad del modal
const openModal = () => {
  isModalOpen.value = true;
};

// CROPPER
const fileInput = ref(null);
const imageSrc = ref(null);
const croppedImage = ref(null);
const cropper = ref(null);

// Abrir el selector de archivos
const showFileChooser = () => {
  fileInput.value?.click();
};

// Manejar el cambio de archivo
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();

    // Forzar actualización de imageSrc
    imageSrc.value = null;

    reader.onload = () => {
      imageSrc.value = reader.result;
    };

    reader.readAsDataURL(file);

    // Resetear el input para permitir subir la misma imagen otra vez
    event.target.value = "";
  }
};

// Recortar la imagen
const cropImage = () => {
  croppedImage.value = cropper.value.getCroppedCanvas().toDataURL();
};

// Cerrar el modal
const closeModal = () => {
  isModalOpen.value = false;
  imageSrc.value = null;
  croppedImage.value = null;
};

const uploadImage = async () => {
  if (!croppedImage.value) return;


  const canvas = cropper.value.getCroppedCanvas();
  const imageBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg'));

  // Crear el formulario con el archivo de imagen
  const formData = new FormData();
  formData.append("image", imageBlob, 'image.jpg');

  try {
    await uploadGraffiti(formData);
    closeModal();
    croppedImage.value = null; // Limpiar el input después de subir
  } catch (error) {
    console.error("Error uploading graffiti:", error);
    return; // Si hay error, no seguimos
  }
};

const deleteGraffitiHandler = async (id) => {
  try {
    await deleteGraffiti(id);
  } catch (error) {
    console.error('Error deleting graffiti:', error);
  }
};

const setActiveGraffitiHandler = async (id) => {
  try {
    await setActiveGraffiti(id);
  } catch (error) {
    console.error('Error setting graffiti as active:', error);
  }
};

// Transiciones del modal
const beforeEnter = (el) => {
  el.style.opacity = 0;
};

const enter = (el, done) => {
  el.offsetHeight; // Forzar reflow
  el.style.transition = 'opacity 0.5s ease';
  el.style.opacity = 1;
  done();
};

const leave = (el, done) => {
  el.style.transition = 'opacity 0.5s ease';
  el.style.opacity = 0;
  done();
};

// Variables para paginación
const currentPage = ref(1);
const pageSize = 6; // Número de items por página

// Paginación de los graffitis
const paginatedGraffitis = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = currentPage.value * pageSize;
  return graffitis.value.slice(start, end);
});

// Total de páginas
const totalPages = computed(() => Math.ceil(graffitis.value.length / pageSize));

onMounted(() => {
  $socket.on('update-pictures', (data) => {
    console.log(data);
    graffitis.value = data;
  });
});

onUnmounted(() => {
  $socket.off('update-pictures');
});

fetchGraffitis();
</script>

<style>
/* Transición del modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

#vue-cropper-style>*:not(img) {
  aspect-ratio: 1 / 1;
  width: 100%;
  height: 100%;
}
</style>
