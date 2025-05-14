import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useGraffitis() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.imagesUrl+'/pictures';


    const getGraffitis = async () => {
        try {
            return await $fetch(`${BASE_URL}/get-user-pictures/${store.user.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`,
                },
            });
        } catch (error) {
            console.error("Error al obtener los graffitis:", error);
            throw error;
        }
    };

    const uploadGraffiti = async (formData) => {
        try {
            // const response = await $fetch(`${BASE_URL}/pictures`, {
            const response = await $fetch(`${BASE_URL}/create-picture`, {

                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`,
                },
                body: formData, // Asegúrate de que `formData` es un FormData
            });
            return response;
        } catch (error) {
            console.error("Error al subir el graffiti:", error);
            throw error;
        }
    }    

    const setActiveGraffiti = async (graffitiId, socketId) => {
        try {
            return await $fetch(`${BASE_URL}/set-active-picture/${graffitiId}/${store.user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`,
                },
                body: {
                    socketId: socketId
                }
            });
        } catch (error) {
            console.error("Error al eliminar el graffiti:", error);
            throw error;
        }
    }

    const deleteGraffiti = async (id, socketId, path) => {
        console.log("ID a eliminar:", id);
        console.log("Socket ID:", socketId);
        console.log("Path:", path);
        try {
            return await $fetch(`${BASE_URL}/delete-picture/${id}/${path}/${store.user.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`,
                },
                body: {
                    socketId: socketId
                }
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