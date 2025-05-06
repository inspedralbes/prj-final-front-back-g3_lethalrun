// server/app.js

import express from 'express';
import http from 'http';
import { initSocket } from './controllers/socketController.js';
import socketRoutes from './routes/socketRoutes.js';

const app = express();
const server = http.createServer(app);

// Inicializamos la instancia de Socket.IO y la pasamos al controlador
const io = initSocket(server);

// Usamos las rutas de socket para manejar los eventos
app.use('/socket', socketRoutes(io));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
