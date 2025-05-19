import { io } from "socket.io-client";

const config = useRuntimeConfig();

const BASE_URL = config.public.socketUrl;

export default defineNuxtPlugin(() => {
    console.log("Conectando al servidor de sockets...");

    const socket = io(BASE_URL);

    return {
        provide: {
            socket,
        },
    };
});
