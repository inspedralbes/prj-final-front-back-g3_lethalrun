import { io } from "socket.io-client";

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    
    // Configuración optimizada para tu infraestructura
    const socket = io('https://lethalrun.cat', {
        path: "/socket.io",  // Coincide con la configuración de Nginx
        transports: ["websocket"], // Fuerza conexión WebSocket
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        auth: {
            token: null // Puedes agregar autenticación JWT aquí si es necesario
        }
    });

    // Manejadores de eventos para depuración
    socket.on("connect", () => {
    });

    socket.on("disconnect", (reason) => { 
    });

    socket.on("connect_error", (err) => {
    });

    return {
        provide: {
            socket: socket
        },
    };
});