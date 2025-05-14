import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
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

    setToken(token) {
      this.token = token;

      // Opcional: Actualizar el localStorage al mismo tiempo
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token", token);
      }
    },

    setNewUsername(newUsername) {
      this.user.username = newUsername;
    },

    setIsAuthenticated(value) {
      this.isAuthenticated = value;
    },

  },
});
