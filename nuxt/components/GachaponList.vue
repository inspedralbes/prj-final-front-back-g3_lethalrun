<template>
    <div class="bg-white rounded-md shadow-md p-4">
      <h2 class="text-xl font-semibold mb-2">Skins Disponibles</h2>
      <ul class="space-y-2">
        <li v-for="skin in availableSkins" :key="skin.name" class="flex items-center gap-2">
          <div class="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center">
            <img :src="skin.imageUrl" :alt="skin.name" class="max-w-full max-h-full object-contain" />
          </div>
          <span>{{ skin.name }}</span>
        </li>
      </ul>
      <button
        class="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        @click="$emit('rollGacha')"
      >
        Gacha!
      </button>
    </div>
  </template>
  
  <script setup>
  defineProps({
    availableSkins: {
      type: Array,
      required: true,
    },
  });
  defineEmits(['rollGacha']);
  </script>