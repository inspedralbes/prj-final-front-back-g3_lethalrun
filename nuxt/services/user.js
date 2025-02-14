import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useGraffitis() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiUrl;

    const updateUsername = async (newUsername) => {
        try {
            return await $fetch(`${BASE_URL}/users/${store.user.id}/${newUsername}`, {
                method: "PUT",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al actualizar el nombre de usuario:", error);
            throw error;
        }
    }

    return {
        updateUsername,
    }
}