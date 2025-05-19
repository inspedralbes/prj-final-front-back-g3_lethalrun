/**
 * @file Punto de entrada principal del servicio de sockets
 * @description Configuración mínima para enviar mensajes a sockets específicos
 * @module app
 */

import express from 'express';
import http from 'http';
import { initSocket } from './controllers/socketController.js';
import socketRoutes from './routes/socketRoutes.js';

const app = express();
const server = http.createServer(app);

// Configuración esencial de Socket.IO
const io = initSocket(server, {
  path: '/socket.io',           // WebSocket servido en esta ruta (NGINX debe hacer proxy correctamente)
  transports: ['websocket'],    // Solo WebSocket
  cors: {
    origin: "*",                // Acepta cualquier origen. ⚠️ Cambia esto en producción
    methods: ["GET", "POST"]
  }
});

// Middleware para JSON
app.use(express.json());

// Manejo de conexiones WebSocket
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
  });
});

// Rutas HTTP para emitir eventos
app.use('/socket', socketRoutes(io));

// Puerto fijo (debe coincidir con el puerto usado en NGINX reverse proxy)
const PORT = 3002;

server.listen(PORT, () => {
  console.log('\n==================================');
  console.log('🚀 Socket Service iniciado correctamente');
  console.log(`📡 Puerto: ${PORT}`);
  console.log('🔌 Endpoints disponibles:');
  console.log('- WebSocket: /socket.io');
  console.log('- HTTP API:  /socket/private/:socketId');
  console.log('==================================\n');
});
