import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useGashapon() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiUrl;

    const test = {
        "email": "usuario@ejemplo.com",
        "slots": {
            "slot1": {
                "isActive": true,
                "number": 3,
                "isUnlocked": true
            },
            "slot2": {
                "isActive": false,
                "number": 5,
                "isUnlocked": false
            },
            "slot3": {
                "isActive": false,
                "number": 1,
                "isUnlocked": false
            }
        }
    }
    const getMySlots = async () => {
        try {
            return test;
            return await $fetch(`${BASE_URL}/my-slots`, {
                method: "GET",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al obtener los slots:", error);
            throw error;
        }
    };

    return { getMySlots };
}
