<template>
    <div
      class="w-24 h-24 rounded-md shadow-md cursor-pointer flex items-center justify-center bg-gray-200"
      @click="$emit('click')"
    >
      <img v-if="skin" :src="skin" alt="Slot Skin" class="max-w-full max-h-full object-contain" />
      <div v-else class="text-gray-400">Vacío</div>
    </div>
  </template>
  
  <script setup>
  defineProps({
    skin: {
      type: String,
      default: null,
    },
  });
  defineEmits(['click']);
  </script>