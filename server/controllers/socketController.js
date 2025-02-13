import dotenv from 'dotenv';
dotenv.config();
import { Server } from 'socket.io';

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.DOMAIN_URL || '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.id}`);

        socket.on('message', (data) => {
            console.log(`Mensaje recibido: ${data}`);
            io.emit('message', data); // Reenviar a todos los clientes
        });

        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.id}`);
        });
    });

    return io;
};

export default initializeSocket;
