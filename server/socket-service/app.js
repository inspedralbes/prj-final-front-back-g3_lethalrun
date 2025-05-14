/**
 * @file Punto de entrada principal del servicio de sockets
 * @description Configura servidor Express y Socket.IO, inicializa rutas y controladores para eventos en tiempo real.
 * @module app
 */

import express from 'express';
import http from 'http';
import { initSocket } from './controllers/socketController.js'; // Inicializador de Socket.IO
import socketRoutes from './routes/socketRoutes.js'; // Rutas para eventos de Socket.IO
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno desde .env

/**
 * Instancia de la aplicación Express
 * @type {express.Application}
 */
const app = express();

/**
 * Servidor HTTP para integrar con Socket.IO
 * @type {http.Server}
 */
const server = http.createServer(app);

/**
 * Instancia de Socket.IO inicializada
 * @type {import('socket.io').Server}
 */
const io = initSocket(server);

/**
 * @middleware Procesamiento de solicitudes JSON
 */
app.use(express.json());

/**
 * @namespace Rutas de eventos de Socket.IO
 * @description Endpoints para manejar eventos y lógica en tiempo real
 */
app.use('/socket', socketRoutes(io));

/**
 * Puerto del servidor (configurable por entorno)
 * @type {number|string}
 */
const PORT = process.env.PORT || 4000;

/**
 * Inicia el servidor de sockets
 * @listens PORT
 */
server.listen(PORT, () => {
  console.log('\n\n');
  console.log('[SOCKET SERVICE]');
  console.log(`🚀 Servidor de sockets activo en http://localhost:${PORT}`);
  console.log('\n');
});
