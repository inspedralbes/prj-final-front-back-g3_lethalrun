// server/controllers/socketController.js

import { Server } from 'socket.io';

/**
 * Inicializa el servidor de Socket.IO
 * @param {http.Server} server - El servidor HTTP al que se le adjuntará Socket.IO
 * @returns {Server} - Instancia de Socket.IO
 */
export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.id}`);
    });
  });

  return io;
};
