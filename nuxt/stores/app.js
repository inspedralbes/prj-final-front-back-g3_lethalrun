import { defineStore } from "pinia";

/**
 * @typedef {object} User
 * @property {number} id - El ID del usuario.
 * @property {string} email - El correo electrónico del usuario.
 * @property {string} username - El nombre de usuario.
 * @property {number} xp - Los puntos de experiencia del usuario.
 * @property {number} play_time - El tiempo de juego del usuario.
 * @property {string} rol - El rol del usuario.
 * @property {string} createdAt - La fecha de creación del usuario en formato ISO.
 * @property {string} updatedAt - La fecha de última actualización del usuario en formato ISO.
 */

/**
 * @typedef {object} AppState
 * @property {User} user - El objeto de usuario. Se inicializa desde localStorage si está disponible, de lo contrario, usa valores predeterminados.
 * @property {string | null} token - El token de autenticación. Se inicializa desde localStorage si está disponible, de lo contrario, es una cadena vacía.
 * @property {boolean} isAuthenticated - Indica si el usuario está autenticado.
 */

/**
 * @typedef {object} AppGetters
 * @property {(state: AppState) => User} getUser - Devuelve el objeto de usuario.
 * @property {(state: AppState) => boolean} getIsAuthenticated - Devuelve el estado de autenticación del usuario.
 */

/**
 * @typedef {object} AppActions
 * @property {(userData: User) => void} setUser - Establece el objeto de usuario completo y actualiza el localStorage.
 * @property {(token: string) => void} setToken - Establece el token de autenticación y actualiza el localStorage.
 * @property {(newUsername: string) => void} setNewUsername - Establece un nuevo nombre de usuario para el usuario actual.
 * @property {(value: boolean) => void} setIsAuthenticated - Establece el estado de autenticación del usuario.
 */

/**
 * Tienda Pinia para gestionar el estado de la aplicación, incluyendo la información del usuario y la autenticación.
 * @name useAppStore
 * @type {import('pinia').StoreDefinition<'app', AppState, AppGetters, AppActions>}
 */
export const useAppStore = defineStore("app", {
  /**
   * El estado inicial de la tienda de la aplicación.
   * @returns {AppState}
   */
  state: () => ({
    user:
      typeof window !== "undefined" && window.localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {
            id: 0,
            email: "example@example.com",
            username: "example",
            xp: 0,
            play_time: 0,
            rol: "example",
            createdAt: "2025-05-13T10:00:32.000Z",
            updatedAt: "2025-05-13T10:00:32.000Z"
          },
    token:
      typeof window !== "undefined" && window.localStorage.getItem("token")
        ? localStorage.getItem("token")
        : "",
    isAuthenticated: false,
  }),
  /**
   * Getters para acceder al estado de la tienda.
   */
  getters: {
    /**
     * Devuelve el objeto de usuario actual.
     * @returns {User} El objeto de usuario.
     */
    getUser() {
      return this.user;
    },

    /**
     * Devuelve el estado de autenticación actual.
     * @returns {boolean} `true` si el usuario está autenticado, `false` en caso contrario.
     */
    getIsAuthenticated() {
      return this.isAuthenticated;
    },
  },
  /**
   * Acciones para modificar el estado de la tienda.
   */
  actions: {
    /**
     * Establece el objeto de usuario completo en el estado y en el localStorage.
     * @param {User} userData - El objeto de usuario para establecer.
     */
    setUser(userData) {
      this.user = userData;

      // Opcional: Actualizar el localStorage al mismo tiempo
      if (typeof window !== "undefined") {
        window.localStorage.setItem("user", JSON.stringify(userData));
      }
    },

    /**
     * Establece el token de autenticación en el estado y en el localStorage.
     * @param {string} token - El token de autenticación para establecer.
     */
    setToken(token) {
      this.token = token;

      // Opcional: Actualizar el localStorage al mismo tiempo
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", token);
      }
    },

    /**
     * Actualiza el nombre de usuario del usuario actual en el estado.
     * Nota: Esto no actualiza el localStorage para el objeto de usuario completo automáticamente,
     * considera llamar a `setUser` si necesitas persistir el objeto de usuario completo.
     * @param {string} newUsername - El nuevo nombre de usuario.
     */
    setNewUsername(newUsername) {
      this.user.username = newUsername;
    },

    /**
     * Establece el estado de autenticación del usuario.
     * @param {boolean} value - `true` si el usuario está autenticado, `false` en caso contrario.
     */
    setIsAuthenticated(value) {
      this.isAuthenticated = value;
    },
  },
});