import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useAuth() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiUrl;

    const getGashaponOptions = async () => {
        try {
            return await $fetch(`${BASE_URL}/get-gashapon-options`, {
                method: "GET",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al obtener las opciones de gashapon:", error);
            throw error;
        }
    };

    const getMySlots = async () => {
        try {
            return await $fetch(`${BASE_URL}/my-slots`, {
                method: "GET",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al obtener los slots:", error);
            throw error;
        }
    };

    const requestRoll = async (slot) => {
        try{
            return await $fetch(`${BASE_URL}/request-roll`, {
                method: "GET",
                credentials: "include",
                body: slot
            });
        } catch (error) {
            console.error("Error al hacer request roll:", error);
            throw error;
        }
    }

    return { getGashaponOptions, getMySlots, requestRoll };
}
