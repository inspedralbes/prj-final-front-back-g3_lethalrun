<template>
  <div class="container-loader w-screen h-screen flex flex-col items-center justify-center">
    <Loader />
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useAuth } from "@/services/auth";

const { processUserFromQuery } = useAuth();

onMounted(() => {
  processUserFromQuery();
});
</script>

<style scoped>
.container-loader {
  background: linear-gradient(to bottom, #1a0a0a 0%, #12122a 100%);
}
</style>
