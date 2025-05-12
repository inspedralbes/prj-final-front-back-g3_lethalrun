<template>
  <div
    class="w-24 h-24 rounded-md shadow-md cursor-pointer flex items-center justify-center bg-gradient-to-br from-gray-900 via-red-700 to-gray-900 border-2 border-white"
    @click="$emit('click')"
  >
    <img v-if="skin" :src="skin" alt="Slot Skin" class="max-w-full max-h-full object-contain" draggable="false" />
    <div v-else class="text-black">Vacío</div>
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

<style scoped>
</style>