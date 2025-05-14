import { io } from "socket.io-client";
export default defineNuxtPlugin(() => {
    console.log("Conectando al servidor de sockets...");

    const socket = io("http://localhost:3002"); // Cambia la URL según tu backend

    return {
        provide: {
            socket,
        },
    };
});
