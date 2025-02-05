import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

export function useAuth() {

    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();

    const config = useRuntimeConfig();
    const BASE_URL = config.public.apiUrl;

    const login = async (email, password) => {
        try {
            return await $fetch(`${BASE_URL}/api/auth/login`, {
                method: "POST",
                body: { email, password },
                credentials: "include",
            });
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw error;
        }
    };

    const processUserFromQuery = () => {
        const userData = route.query.user;

        if (!userData) {
            router.push("/auth/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            store.setUser(parsedUser);
            store.setIsAuthenticated(true);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error al analizar los datos del usuario:", error);
            router.push("/auth/login");
        }
    };

    const register = async (username, email, password) => {
        try {
            console.log("Enviando solicitud de registro...");
            return await $fetch(`${BASE_URL}/send-verification-email`, {
                method: "POST",
                body: { username, email, password },
                credentials: "include",
            });
        } catch (error) {
            console.error("Error en el registro:", error);
            throw error;
        }
    };

    const verifyEmailToken = async (token) => {
        if (!token) throw new Error("Token not provided");

        try {
            const response = await $fetch(`${BASE_URL}/verify-email/${token}`, {
                method: "POST",
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (token, newPassword) => {
        if (!token) throw new Error("Token no proporcionado");
        if (newPassword.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

        try {
            console.log("Enviando solicitud de restablecimiento de contraseña...");
            return await $fetch(`${BASE_URL}/reset-password/${token}`, {
                method: "POST",
                body: { newPassword },
            });
        } catch (error) {
            console.error("Error en el restablecimiento de contraseña:", error);
            throw error;
        }
    };

    return { login, processUserFromQuery, register, verifyEmailToken, resetPassword };
}
