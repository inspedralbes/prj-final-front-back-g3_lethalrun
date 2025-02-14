import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';

/**
 * Inicializa el servidor de Socket.IO.
 * @param {Object} server - El servidor HTTP o HTTPS al que se debe adjuntar el servidor de WebSocket.
 * @returns {Object} - La instancia del servidor de Socket.IO.
 */
const initializeSocket = (server) => {
    // Configuración de Socket.IO con CORS permitiendo el origen del dominio configurado
    const io = new Server(server, {
        cors: {
            origin: process.env.DOMAIN_URL|| '*', // Permitir cualquier origen si no está configurado
            methods: ['GET', 'POST'] // Métodos HTTP permitidos
        }
    });

    // Manejo de la conexión de un nuevo cliente
    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.id}`); // Imprimir ID del socket de usuario

        // Manejo de un mensaje recibido desde un cliente
        socket.on('message', (data) => {
            console.log(`Mensaje recibido: ${data}`); // Mostrar el mensaje en el servidor
            io.emit('message', data); // Reenviar el mensaje a todos los clientes conectados
        });

        // Manejo de la desconexión de un cliente
        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.id}`); // Imprimir ID del socket cuando se desconecta
        });
    });

    return io; // Retorna la instancia de Socket.IO
};

export default initializeSocket;
