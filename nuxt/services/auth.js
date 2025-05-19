import { useAppStore } from '@/stores/app';
import { useRoute, useRouter } from 'nuxt/app';

/**
 * Provides authentication-related methods.
 * @returns {Object} An object containing authentication methods.
 */
export function useAuth() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const config = useRuntimeConfig();
    
    /** 
     * Base URL for authentication API.
     * @type {string} 
     */
    const BASE_URL = config.public.authUrl;

    /**
     * Logs in the user with the provided email and password.
     * @param {string} email - User's email address.
     * @param {string} password - User's password.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the login process fails.
     */
    const login = async (email, password) => {
        try {
            return await $fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                body: { email, password },
                credentials: "include",
            });
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            throw error;
        }
    };

    /**
     * Sends a password reset request for the given email.
     * @param {string} email - User's email address.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the password reset process fails.
     */
    const forgotPassword = async (email) => {
        try {
            return await $fetch(`${BASE_URL}/auth/send-password-reset-email`, {
                method: "POST",
                body: { email },
            });
        } catch (error) {
            console.error("Error en el restablecimiento de contraseña:", error);
            throw error;
        }
    };

    /**
     * Processes user data from the query string, sets user information in the store,
     * and redirects to the main page if successful.
     */
    const processUserFromQuery = () => {
        const userData = route.query.user;
        const token = route.query.token;

        if (!userData) {
            router.push("/auth/login");
            return;
        }

        try {
            const parsedUser = JSON.parse(userData);
            store.setUser(parsedUser);
            store.setToken(token);
            store.setIsAuthenticated(true);
            router.push("/");
        } catch (error) {
            console.error("Error al analizar los datos del usuario:", error);
            router.push("/auth/login");
        }
    };

    /**
     * Registers a new user with the given username, email, and password.
     * @param {string} username - The username of the new user.
     * @param {string} email - The email address of the new user.
     * @param {string} password - The password for the new user.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the registration process fails.
     */
    const register = async (username, email, password) => {
        try {
            return await $fetch(`${BASE_URL}/auth/send-verification-email`, {
                method: "POST",
                body: { username, email, password },
                credentials: "include",
            });
        } catch (error) {
            console.error("Error en el registro:", error);
            throw error;
        }
    };

    /**
     * Verifies the email token sent during registration.
     * @param {string} token - The verification token.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the verification fails.
     */
    const verifyEmailToken = async (token) => {
        if (!token) throw new Error("Token not provided");

        try {
            return await $fetch(`${BASE_URL}/auth/verify-email/${token}`, {
                method: "POST",
            });
        } catch (error) {
            throw error;
        }
    };

    /**
     * Resets the user's password using the provided token and new password.
     * @param {string} token - The reset password token.
     * @param {string} newPassword - The new password to set.
     * @returns {Promise<Object>} The response from the server.
     * @throws Will throw an error if the password is too short or the request fails.
     */
    const resetPassword = async (token, newPassword) => {
        if (!token) throw new Error("Token no proporcionado");
        if (newPassword.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

        try {
            return await $fetch(`${BASE_URL}/auth/reset-password/${token}`, {
                method: "POST",
                body: { newPassword },
            });
        } catch (error) {
            console.error("Error en el restablecimiento de contraseña:", error);
            throw error;
        }
    };

    // Exposición de métodos
    return {
        login,
        forgotPassword,
        processUserFromQuery,
        register,
        verifyEmailToken,
        resetPassword
    };
}
