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
        },
    isAuthenticated: false,
  }),
  getters: {
    getUser() {
      return this.user;
    },

    getIsAuthenticated() {
      return this.isAuthenticated;
    },
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

    setIsAuthenticated(value) {
      this.isAuthenticated = value;
    },

  },
});
