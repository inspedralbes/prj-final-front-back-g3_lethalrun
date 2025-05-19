import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

/**
 * Provides methods to interact with the Gashapon system.
 * @returns {Object} An object containing Gashapon-related methods.
 */
export function useGashapon() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const config = useRuntimeConfig();

    /** 
     * Base URL for the Gashapon API.
     * @type {string} 
     */
    const BASE_URL = `${config.public.mongoUrl}/skins`;

    /**
     * Retrieves the user's current slots from the server.
     * @returns {Promise<Object>} The response containing the user's slots.
     * @throws Will throw an error if the fetch operation fails.
     */
    const getMySlots = async () => {
        try {
            return await $fetch(`${BASE_URL}/user/${store.user.email}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${store.token}`,
                },
            });
        } catch (error) {
            console.error("Error al obtener los slots:", error);
            throw error;
        }
    };

    /**
     * Updates the slot number for a specific slot name.
     * @param {string} slotName - The name of the slot to update.
     * @param {number} newNumber - The new number to set for the slot.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the update operation fails.
     */
    const setSlotNumber = async (slotName, newNumber) => {
        try {
            return await $fetch(`${BASE_URL}/set-slot-number`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`,
                },
                body: {
                    email: store.user.email,
                    slotName: slotName,
                    newNumber: newNumber,
                },
            });
        } catch (error) {
            console.error("Error al actualizar el número del slot:", error);
            throw error;
        }
    };

    /**
     * Activates a specific skin slot.
     * @param {string} slotName - The name of the slot to activate.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the activation operation fails.
     */
    const setActiveSkinSlot = async (slotName) => {
        try {
            return await $fetch(`${BASE_URL}/activate`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`,
                },
                body: {
                    email: store.user.email,
                    slotName: slotName,
                },
            });
        } catch (error) {
            console.error("Error al activar el slot:", error);
            throw error;
        }
    };

    /**
     * Unlocks a specific skin slot.
     * @param {string} slotName - The name of the slot to unlock.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the unlock operation fails.
     */
    const unlockSlot = async (slotName) => {
        try {
            return await $fetch(`${BASE_URL}/unlock`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`,
                },
                body: {
                    email: store.user.email,
                    slotName: slotName,
                },
            });
        } catch (error) {
            console.error("Error al desbloquear el slot:", error);
            throw error;
        }
    };

    // Exposición de métodos
    return {
        getMySlots,
        setSlotNumber,
        setActiveSkinSlot,
        unlockSlot
    };
}
