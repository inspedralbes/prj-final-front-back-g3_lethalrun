import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useGraffitis() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiUrl;


    const getGraffitis = async () => {
        try {
            return await $fetch(`${BASE_URL}/users/${store.user.id}/pictures`, {
                method: "GET",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al obtener los graffitis:", error);
            throw error;
        }
    };

    const uploadGraffiti = async (formData) => {
        try {
            const response = await $fetch(`${BASE_URL}/pictures`, {
                method: "POST",
                credentials: "include",
                body: formData, // Asegúrate de que `formData` es un FormData
                // headers: {
                //     'Content-Type': 'multipart/form-data', // No es necesario establecer esto explícitamente en algunos casos
                // }
            });
            return response;
        } catch (error) {
            console.error("Error al subir el graffiti:", error);
            throw error;
        }
    }    

    const setActiveGraffiti = async (graffitiId) => {
        try {
            return await $fetch(`${BASE_URL}/pictures/${graffitiId}/setActive`, {
                method: "PUT",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al eliminar el graffiti:", error);
            throw error;
        }
    }

    const deleteGraffiti = async (id) => {
        try {
            return await $fetch(`${BASE_URL}/pictures/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
        } catch (error) {
            console.error("Error al eliminar el graffiti:", error);
            throw error;
        }
    }

    return {
        getGraffitis,
        uploadGraffiti,
        setActiveGraffiti,
        deleteGraffiti
    }
}