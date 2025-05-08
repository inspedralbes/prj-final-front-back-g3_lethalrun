<template>
    <div class="flex flex-col items-center">
      <div class="w-48 h-48 rounded-md shadow-lg bg-white flex items-center justify-center">
        <img v-if="selectedSkin" :src="selectedSkin" alt="Selected Skin" class="max-w-full max-h-full object-contain" />
        <div v-else class="text-gray-400">Selecciona un slot</div>
      </div>
      <p class="mt-2 text-lg font-semibold">{{ selectedSkinName || '...' }}</p>
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