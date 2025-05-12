<template>
  <div class="gashapon-container flex flex-col items-center justify-center p-6">
    <div
      class="gashapon-machine bg-red-500 rounded-xl shadow-2xl p-8 w-full max-w-xs transform transition-all duration-500 hover:scale-105">
      <div
        class="prize-display bg-white/30 backdrop-blur-sm rounded-lg h-48 mb-6 flex items-center justify-center text-center p-4 overflow-hidden">
        <div v-if="!isOperating && !prizeToDisplay" class="text-white/80 text-lg font-semibold">
          {{ currentAttempts > 0 ? '¡Gira la manivela!' : 'Sin intentos' }}
        </div>
        <div v-if="status === 'spinning'" class="animate-spin text-4xl">🔄</div>
        <div v-if="status === 'revealed' && prizeToDisplay" class="prize-reveal animate-pop-in">
          <p class="text-sm text-white/90 mb-1">Has obtenido:</p>
          <div class="bg-gradient-to-t from-black via-red-900 to-gray-900 rounded-lg shadow-lg p-4">
            <img v-if="prizeToDisplay.imageUrl" :src="prizeToDisplay.imageUrl" :alt="prizeToDisplay.name"
              class="h-16 mx-auto mb-2 object-contain">
            <p class="text-2xl font-bold text-indigo-600">{{ prizeToDisplay.name }}</p>
            <p v-if="prizeToDisplay.emoji && !prizeToDisplay.imageUrl" class="text-yellow-500 text-3xl mt-2">{{
              prizeToDisplay.emoji }}</p>
          </div>
        </div>
        <div v-if="status === 'error'" class="text-red-100 font-semibold">
          {{ prizeToDisplay?.message || 'Error en el gashapon' }}
        </div>
      </div>

      <div class="capsule-exit-area bg-gray-700 rounded-b-lg p-3 h-16 mb-6 flex items-center justify-center relative">
        <div v-if="status === 'dispensing'"
          class="capsule bg-blue-400 rounded-full w-10 h-10 flex items-center justify-center text-white shadow-md animate-dispense-capsule">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
        </div>
        <div class="slot-outline absolute bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-sm">
        </div>
      </div>

      <div class="crank-area flex justify-center">
        <button @click="handleSpinRequest" :disabled="isOperating || currentAttempts <= 0"
          class="crank-handle bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-gray-800 font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 group">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-6 h-6 group-hover:rotate-90 transition-transform duration-300">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          <span>{{ buttonText }}</span>
        </button>
      </div>
      <div v-if="showAttemptsCounter" class="mt-6 text-center">
        <p class="text-white/70 text-sm">Intentos: {{ currentAttempts }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  rolledPrize: { // El premio que la página padre ha determinado para esta tirada
    type: Object,
    default: null
  },
  currentAttempts: { // Los intentos actuales, gestionados por el padre
    type: Number,
    default: 0
  },
  showAttemptsCounter: { // Mostrar o no el contador de intentos en la máquina
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['request-roll', 'animation-finished']);

// Estados internos de la máquina: 'idle', 'spinning', 'dispensing', 'revealed', 'error'
const status = ref('idle');
const prizeToDisplay = ref(null); // El premio que se está mostrando actualmente

const isOperating = computed(() => status.value === 'spinning' || status.value === 'dispensing');

const buttonText = computed(() => {
  if (props.currentAttempts <= 0 && status.value === 'idle') return 'Sin intentos';
  if (status.value === 'spinning') return 'Girando...';
  if (status.value === 'dispensing') return 'Sale...';
  return 'Girar!';
});

const handleSpinRequest = () => {
  if (isOperating.value || props.currentAttempts <= 0) {
    return;
  }
  status.value = 'spinning';
  prizeToDisplay.value = null; // Limpiar premio anterior del visor
  emit('request-roll');
};

watch(() => props.rolledPrize, (newPrize, oldPrize) => {
  if (!newPrize) { // Si el padre anula el premio (ej. al resetear para la siguiente tirada)
    if (status.value === 'revealed' || status.value === 'error') { // Solo resetear si ya mostró algo o error
      status.value = 'idle';
      prizeToDisplay.value = null;
    }
    return;
  }

  // Solo procesar si es un nuevo objeto de premio y la máquina estaba 'spinning'
  if (newPrize && newPrize !== oldPrize && status.value === 'spinning') {
    if (newPrize.error) { // Si el padre indica un error (ej. no hay intentos)
      prizeToDisplay.value = { message: newPrize.message || "Error" };
      status.value = 'error';
      // No emitir animation-finished aquí, o emitir con error
      setTimeout(() => { // Dar tiempo a ver el mensaje de error
        if (status.value === 'error') status.value = 'idle'; // Volver a idle
      }, 2000);
      return;
    }

    // Simular tiempo de giro antes de la "dispensa"
    setTimeout(() => {
      if (status.value !== 'spinning') return; // Si el estado cambió (ej. por un reset), no continuar
      status.value = 'dispensing';

      // Simular salida de cápsula y revelación del premio
      setTimeout(() => {
        if (status.value !== 'dispensing') return;
        prizeToDisplay.value = { ...newPrize };
        status.value = 'revealed';
        emit('animation-finished', { ...newPrize }); // Notificar al padre que la animación terminó y con qué premio
      }, 1200); // Duración de la animación de la cápsula saliendo (B)
    }, 1000); // Duración del giro (A) - Total A+B para animación completa
  }
});


const getRarityClass = (rarity) => {
  const baseClasses = 'text-xs font-semibold px-2 py-0.5';
  switch (rarity) {
    case 'Común': return `${baseClasses} bg-gray-200 text-gray-700`;
    case 'Raro': return `${baseClasses} bg-blue-200 text-blue-700`;
    case 'Épico': return `${baseClasses} bg-purple-200 text-purple-700`;
    case 'Legendario': return `${baseClasses} bg-yellow-200 text-yellow-700`;
    default: return `${baseClasses} bg-gray-100 text-gray-600`;
  }
};
</script>

<style scoped>
/* Estilos y animaciones (sin cambios respecto a la versión anterior) */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.prize-reveal.animate-pop-in {
  animation: popIn 0.5s ease-out forwards;
}

@keyframes popIn {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }

  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-dispense-capsule {
  animation: dispense 1.2s ease-out forwards;
}

@keyframes dispense {
  0% {
    transform: translateY(-80px) scale(0.8);
    opacity: 0;
  }

  30% {
    transform: translateY(0px) scale(1);
    opacity: 1;
  }

  70% {
    transform: translateY(0px) scale(1);
    opacity: 1;
  }

  100% {
    transform: translateY(60px) scale(0.7);
    opacity: 0;
  }
}

.gashapon-machine {
  border-bottom: 10px solid #c0392b;
}

.prize-display {
  box-shadow: inset 0 0 15px rgba(255, 255, 255, 0.3), 0 4px 6px rgba(0, 0, 0, 0.1);
}

.crank-handle {
  transform: perspective(100px) rotateX(5deg);
}

.crank-handle:active {
  transform: perspective(100px) rotateX(2deg) translateY(2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.capsule {
  background-image: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 70%);
}

.slot-outline {
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
}

.gashapon-container {
  width: 100%;
}
</style>