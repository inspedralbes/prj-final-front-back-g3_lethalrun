<template>
    <div class="min-h-screen w-full flex flex-col">
      <Navbar
        class="h-min"
        :logoSrc="'/LethalRun_logo-removebg-preview.png'"
        :logoLink="'/'"
        :menuItems="menuItems"
        :profileImg="'/profile-icon.jpg'"
        :profileOptions="profileOptions"
        :logoutLink="logoutLink"
        :isLogged="isLogged"
      />
      <div class="bg-gray-100 py-8 h-full flex-grow flex justify-center">
        <div class="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col gap-4">
            <GachaponSlot :skin="slot1Skin" @click="selectSlot(0)" />
            <GachaponSlot :skin="slot2Skin" @click="selectSlot(1)" />
            <GachaponSlot :skin="slot3Skin" @click="selectSlot(2)" />
          </div>
  
          <div class="flex flex-col items-center">
            <GachaponDisplay
              :selectedSkin="selectedSkin"
              :selectedSkinName="selectedSkinName"
            />
          </div>
  
          <div>
            <GachaponList :availableSkins="availableSkins" @rollGacha="rollGacha" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import Navbar from '../components/Navbar.vue';
  import GachaponSlot from '../components/GachaponSlot.vue';
  import GachaponDisplay from '../components/GachaponDisplay.vue';
  import GachaponList from '../components/GachaponList.vue';
  import { ref } from 'vue';
  
  // Datos de ejemplo (reemplazar con tu lógica real)
  const menuItems = ref([]);
  const profileOptions = ref([]);
  const logoutLink = ref('/logout');
  const isLogged = ref(true);
  const availableSkins = ref([
    { name: 'Skin A', imageUrl: '/skins/skin-a.png' },
    { name: 'Skin B', imageUrl: '/skins/skin-b.png' },
    { name: 'Skin C', imageUrl: '/skins/skin-c.png' },
    // ... más skins
  ]);
  const slotSkins = ref([
    availableSkins.value[0],
    availableSkins.value[1],
    availableSkins.value[2],
  ]);
  const selectedSlotIndex = ref(0);
  const selectedSkin = ref(slotSkins.value[0].imageUrl);
  const selectedSkinName = ref(slotSkins.value[0].name);
  
  const slot1Skin = ref(slotSkins.value[0].imageUrl);
  const slot2Skin = ref(slotSkins.value[1].imageUrl);
  const slot3Skin = ref(slotSkins.value[2].imageUrl);
  
  const selectSlot = (index) => {
    selectedSlotIndex.value = index;
    selectedSkin.value = slotSkins.value[index].imageUrl;
    selectedSkinName.value = slotSkins.value[index].name;
  };
  
  const rollGacha = () => {
    const randomIndex = Math.floor(Math.random() * availableSkins.value.length);
    const newSkin = availableSkins.value[randomIndex];
    slotSkins.value[selectedSlotIndex.value] = newSkin;
    if (selectedSlotIndex.value === 0) slot1Skin.value = newSkin.imageUrl;
    if (selectedSlotIndex.value === 1) slot2Skin.value = newSkin.imageUrl;
    if (selectedSlotIndex.value === 2) slot3Skin.value = newSkin.imageUrl;
    selectedSkin.value = newSkin.imageUrl;
    selectedSkinName.value = newSkin.name;
  };
  </script>
  
  <style scoped>
  h1 {
    display: none;
  }
  </style>