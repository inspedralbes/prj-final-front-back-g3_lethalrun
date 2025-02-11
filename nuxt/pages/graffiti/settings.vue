<template>
  <div class="min-h-screen flex flex-col">
    <Navbar class="h-min" :logoSrc="'/LethalRun_logo-removebg-preview.png'" :logoLink="'/'" :menuItems="menuItems"
      :profileImg="'/profile-icon.jpg'" :profileOptions="profileOptions" :logoutLink="logoutLink"
      :isLogged="isLogged" />
    <div class="flex-1 bg-gray-100 py-8">

      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Botón para abrir el modal -->
        <button @click="openModal" class="mt-8 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
          Open Modal
        </button>

        <!-- Modal con vue-cropper -->
    <transition name="fade" @before-enter="beforeEnter" @enter="enter" @leave="leave">
      <div v-if="isModalOpen" style="background-color: rgb(0,0,0,0.8);" class="fixed inset-0 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded-lg shadow-lg w-96">
          <div class="mt-8">
            <h2 class="text-2xl font-semibold text-gray-800">Upload New Graffiti</h2>
            
            <!-- Input de imagen -->
            <input type="file" @change="onFileChange" class="mt-2 block w-full" accept="image/jpeg, image/png" />

            <!-- Agregar el componente VueCropper dentro del modal -->
              <vue-cropper
                v-if="imageSrc"
                ref="cropper"
                :src="imageSrc"
                :aspect-ratio="1"
                :fixed-aspect-ratio="true"
                :view-mode="2"
                @crop="onCrop"
              ></vue-cropper>

            <!-- Botón para recortar la imagen -->
            <button v-if="imageSrc" @click="cropImage"
              class="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >Recortar Imagen</button>

            <!-- Mostrar la imagen recortada -->
            <img v-if="croppedImage" :src="croppedImage" alt="Imagen Recortada" />

            <button @click="uploadImage" v-if="croppedImage" class="mt-4 bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Upload
            </button>
          </div>

          <div class="mt-6 flex justify-end">
            <button @click="closeModal" class="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700">
              Close
            </button>
          </div>
        </div>
      </div>
    </transition>

        <div v-if="graffitis.length > 0" class="mt-8">
          <h2 class="text-2xl font-semibold text-gray-800">Tus Graffitis</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
            <div v-for="graffiti in graffitis" :key="graffiti.id"
              class="relative bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out">
              <img :src="getPath(graffiti.path)" alt="Graffiti Image"
                class="w-full h-auto rounded-xl mb-4 border-4 border-transparent hover:border-gray-300 transition-all duration-300 ease-in-out" />

              <div class="w-full container-buttons flex justify-between items-center">

                <!-- Botón "Set Active" -->
                <button v-if="!graffiti.is_active" @click="setActiveGraffitiHandler(graffiti.id)"
                  class="cursor-pointer bg-blue-600 text-white p-2 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                  Set Active
                </button>

                <!-- Estado Activo -->
                <p v-else
                  class="cursor-default bg-green-600 text-white p-2 rounded-lg shadow-md transition-all duration-300 ease-in-out">
                  Active
                </p>

                <!-- Botón "Delete" -->
                <button @click="deleteGraffitiHandler(graffiti.id)"
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
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

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


//CROPPER
const cropper = ref(null);
// La imagen que se va a cargar y mostrar en el cropper
const imageSrc = ref('');
// La imagen recortada (se actualizará después del recorte)
const croppedImage = ref('');

// Función para manejar el cambio de archivo
const onFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      // Establecer la imagen cargada como la fuente para el cropper
      imageSrc.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
// Función para manejar el recorte de la imagen
const cropImage = () => {
    const cropperInstance = cropper.value;
    if (cropperInstance) {
      // Obtener la imagen recortada
      croppedImage.value = cropperInstance.getCroppedCanvas().toDataURL();
    }
  };
// Función que se ejecuta cuando la imagen es recortada
const onCrop = (event) => {
  console.log('Imagen recortada', event);
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
    croppedImage.value = null; // Limpiar el input después de subir
  } catch (error) {
    console.error("Error uploading graffiti:", error);
    return; // Si hay error, no seguimos
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

// Funciones para controlar la visibilidad del modal
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
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

fetchGraffitis();
</script>

<style scoped>
/* Transición del modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
