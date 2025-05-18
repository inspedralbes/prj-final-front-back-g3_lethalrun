import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useGashapon() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.mongoUrl + '/skins';

    const getMySlots = async () => {
        try {
            console.log(`${BASE_URL}/user`);
            console.log(store.token);
            return await $fetch(`${BASE_URL}/user/${store.user.email}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${store.token}`
                } 
            });

        } catch (error) {
            console.error("Error al obtener los slots:", error);
            throw error;
        }
    };

    const setSlotNumber = async (slotName, newNumber) => {
        try {
            return await $fetch(`${BASE_URL}/set-slot-number`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`
                },
                body: {
                    email: store.user.email,
                    slotName: slotName,
                    newNumber: newNumber
                }
            });
        } catch (error) {
            console.error("Error al obtener los slots:", error);
            throw error;
        }
    };

    const setActiveSkinSlot = async (slotName) => {
        try {
            return await $fetch(`${BASE_URL}/activate`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`
                },
                body: {
                    email: store.user.email,
                    slotName: slotName
                }
            });
        }
        catch (error) {
            console.error("Error al activar los slot:", error);
            throw error;
        }
    }

    const unlockSlot = async (slotName) => {
        try {
            return await $fetch(`${BASE_URL}/unlock`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`
                },
                body: {
                    email: store.user.email,
                    slotName: slotName
                }
            });
        }
        catch (error) {
            console.error("Error al desbloquear los slots:", error);
            throw error;
        }
    }


    return { getMySlots, setSlotNumber, setActiveSkinSlot, unlockSlot };
}
