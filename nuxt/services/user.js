import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useUser() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiUrl;

    const updateUsername = async (newUsername) => {
        try {
            return await $fetch(`${BASE_URL}/users/${store.user.id}/username`, {
                method: "PUT",
                credentials: "include",
                body: { newUsername },
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