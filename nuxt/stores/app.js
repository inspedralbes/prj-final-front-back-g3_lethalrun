import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    user:
      typeof window !== "undefined" && window.localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {
          id: 0,
          email: "david@gmail.com",
          name: "Dasbits",
          picture: "picture.png",
          groups: [],
          token: null,
          role_id: null,
          role_name: null,
        },
  }),
  getters: {

    getUser: (state) => state.user,

    // Getter para obtener el nombre completo (si tuvieras "firstName" y "lastName")
    userName: (state) => state.user.name,

    // Getter para verificar si el usuario está autenticado
    isAuthenticated: (state) => !!state.user.token,
  },
  actions: {
    // Setter para actualizar el usuario completo
    setUser(userData) {
      this.user = userData;

      // Opcional: Actualizar el localStorage al mismo tiempo
      if (typeof window !== "undefined") {
        window.localStorage.setItem("user", JSON.stringify(userData));
      }
    },

    // Setter para actualizar el token del usuario
    setUserToken(token) {
      this.user.token = token;

      // Opcional: Actualizar también en localStorage
      if (typeof window !== "undefined") {
        const updatedUser = { ...this.user, token };
        window.localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    },
  },
});
