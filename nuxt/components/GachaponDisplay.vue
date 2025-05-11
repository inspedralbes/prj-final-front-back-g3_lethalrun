<template>
  <div class="flex flex-col items-center">
    <div
      class="w-48 h-48 rounded-md shadow-lg flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-700 to-gray-900 border-2 border-white"
    >
      <img v-if="selectedSkin" :src="selectedSkin" alt="Selected Skin" class="max-w-full max-h-full object-contain" />
      <div v-else class="text-black">Selecciona un slot</div>
    </div>
    <p class="mt-2 text-lg font-semibold text-gray-200">{{ selectedSkinName || '...' }}</p>
  </div>
</template>

<script setup>
defineProps({
  selectedSkin: {
    type: String,
    default: null,
  },
  selectedSkinName: {
    type: String,
    default: null,
  },
});
</script>

<style scoped>
/* Puedes añadir estilos adicionales aquí si es necesario */
</style>