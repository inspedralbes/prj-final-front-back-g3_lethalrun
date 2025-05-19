import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

/**
 * Provides methods to interact with the Graffitis API.
 * @returns {Object} An object containing Graffiti-related methods.
 */
export function useGraffitis() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const config = useRuntimeConfig();

    /** 
     * Base URL for the Graffitis API.
     * @type {string} 
     */
    const BASE_URL = `${config.public.imagesUrl}/pictures`;

    /**
     * Fetches the list of graffitis associated with the current user.
     * @returns {Promise<Object>} The response containing the user's graffitis.
     * @throws Will throw an error if the fetch operation fails.
     */
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

    /**
     * Uploads a new graffiti to the server.
     * @param {FormData} formData - The form data containing the image and metadata.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the upload operation fails.
     */
    const uploadGraffiti = async (formData) => {
        try {
            return await $fetch(`${BASE_URL}/create-picture`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${store.token}`,
                },
                body: formData,
            });
        } catch (error) {
            console.error("Error al subir el graffiti:", error);
            throw error;
        }
    };

    /**
     * Sets a specific graffiti as active for the current user.
     * @param {string} graffitiId - The ID of the graffiti to activate.
     * @param {string} socketId - The Socket.IO ID for real-time updates.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the activation operation fails.
     */
    const setActiveGraffiti = async (graffitiId, socketId) => {
        try {
            return await $fetch(`${BASE_URL}/set-active-picture/${graffitiId}/${store.user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`,
                },
                body: {
                    socketId: socketId,
                },
            });
        } catch (error) {
            console.error("Error al activar el graffiti:", error);
            throw error;
        }
    };

    /**
     * Deletes a specific graffiti from the server.
     * @param {string} id - The ID of the graffiti to delete.
     * @param {string} socketId - The Socket.IO ID for real-time updates.
     * @param {string} path - The path of the graffiti image to delete.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the delete operation fails.
     */
    const deleteGraffiti = async (id, socketId, path) => {
        try {
            return await $fetch(`${BASE_URL}/delete-picture/${id}/${path}/${store.user.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`,
                },
                body: {
                    socketId: socketId,
                },
            });
        } catch (error) {
            console.error("Error al eliminar el graffiti:", error);
            throw error;
        }
    };

    // Exposición de métodos
    return {
        getGraffitis,
        uploadGraffiti,
        setActiveGraffiti,
        deleteGraffiti,
    };
}
