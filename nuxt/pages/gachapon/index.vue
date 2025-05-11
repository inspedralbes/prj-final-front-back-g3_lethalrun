<template>
  <div class="min-h-screen w-full flex flex-col bg-gray-900">
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
    <div class="bg-gray-900 py-8 h-full flex-grow flex justify-center">
      <div class="container mx-auto">
        <div class="flex flex-col items-center gap-8">

          <div class="flex flex-col items-center justify-center">
            <GashaponMachine
              @request-roll="handleGachaRollRequest"
              @animation-finished="handleGachaAnimationFinished"
              :rolled-prize="prizeForMachineAnimation"
              :current-attempts="gachaAttempts"
              :show-attempts-counter="true" />
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div :class="{ 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900 rounded-md': selectedSlotIndex === 0 }">
              <GachaponSlot :skin="slot1Skin" @click="selectSlot(0)" :is-selected="selectedSlotIndex === 0" />
            </div>
            <div :class="{ 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900 rounded-md': selectedSlotIndex === 1 }">
              <GachaponSlot :skin="slot2Skin" @click="selectSlot(1)" :is-selected="selectedSlotIndex === 1" />
            </div>
            <div :class="{ 'ring-2 ring-red-500 ring-offset-2 ring-offset-gray-900 rounded-md': selectedSlotIndex === 2 }">
              <GachaponSlot :skin="slot3Skin" @click="selectSlot(2)" :is-selected="selectedSlotIndex === 2" />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import GachaponSlot from '../components/GachaponSlot.vue';
// import GachaponDisplay from '../components/GachaponDisplay.vue'; // Eliminado
import GashaponMachine from '../components/GashaponMachine.vue';
import { ref, computed, nextTick } from 'vue';

// --- Datos de ejemplo ---
const menuItems = ref([]);
const profileOptions = ref([]);
const logoutLink = ref('/logout');
const isLogged = ref(true);

const availableSkins = ref([
  { id: 's1', name: 'Skin Jett', imageUrl: '/skins/skin-a.png', rarity: 'Raro' },
  { id: 's2', name: 'Skin Sage', imageUrl: '/skins/skin-b.png', rarity: 'Épico' },
  { id: 's3', name: 'Skin Omen', imageUrl: '/skins/skin-c.png', rarity: 'Común' },
]);

const slotSkins = ref([
  { ...availableSkins.value[0] },
  { ...availableSkins.value[1] },
  { ...availableSkins.value[2] },
]);

const selectedSlotIndex = ref(0); // El slot 0 estará seleccionado por defecto

// Ya no se necesita selectedSkinInfo, selectedSkin, selectedSkinName para GachaponDisplay
// Pero pueden ser útiles para otra lógica si es necesario. Las mantendré comentadas por si acaso.
// const selectedSkinInfo = computed(() => slotSkins.value[selectedSlotIndex.value] || availableSkins.value[0]);
// const selectedSkin = computed(() => selectedSkinInfo.value?.imageUrl);
// const selectedSkinName = computed(() => selectedSkinInfo.value?.name);

const slot1Skin = computed(() => slotSkins.value[0]?.imageUrl || '/placeholder.png');
const slot2Skin = computed(() => slotSkins.value[1]?.imageUrl || '/placeholder.png');
const slot3Skin = computed(() => slotSkins.value[2]?.imageUrl || '/placeholder.png');

const selectSlot = (index) => {
  selectedSlotIndex.value = index;
};

// --- Lógica del Gashapon con retraso de actualización ---
const prizeForMachineAnimation = ref(null);
const pendingPrizeToApply = ref(null);
const pendingSlotIndex = ref(null);
const gachaAttempts = ref(15);

const handleGachaRollRequest = async () => {
  prizeForMachineAnimation.value = null;
  await nextTick();

  if (gachaAttempts.value <= 0) {
    console.log("Sin intentos restantes.");
    prizeForMachineAnimation.value = { error: true, message: "¡Sin intentos!" };
    return;
  }
  if (availableSkins.value.length === 0) {
    console.log("No hay skins disponibles.");
    prizeForMachineAnimation.value = { error: true, message: "No hay skins" };
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableSkins.value.length);
  const determinedPrize = { ...availableSkins.value[randomIndex] };

  pendingPrizeToApply.value = determinedPrize;
  pendingSlotIndex.value = selectedSlotIndex.value; // El premio se aplicará al slot que esté seleccionado

  prizeForMachineAnimation.value = determinedPrize;
};

const handleGachaAnimationFinished = async (animatedPrize) => {
  if (pendingPrizeToApply.value && pendingSlotIndex.value !== null) {
    slotSkins.value[pendingSlotIndex.value] = { ...pendingPrizeToApply.value };
    gachaAttempts.value--;
    console.log(`Premio ${pendingPrizeToApply.value.name} aplicado al slot ${pendingSlotIndex.value}. Intentos restantes: ${gachaAttempts.value}`);
  } else {
    console.warn("Se recibió animation-finished pero no había un premio pendiente o slot.", animatedPrize);
  }

  pendingPrizeToApply.value = null;
  pendingSlotIndex.value = null;
};

</script>

<style scoped>
h1 { display: none; }
@media (min-width: 768px) {
  .md\:sticky { position: sticky; }
  .md\:top-8 { top: 2rem; }
}
</style>