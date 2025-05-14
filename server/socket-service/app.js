// server/app.js

import express from 'express';
import http from 'http';
import { initSocket } from './controllers/socketController.js';  // Asegúrate de que este controlador esté correcto
import socketRoutes from './routes/socketRoutes.js';  // Rutas para eventos de Socket.IO
import dotenv from 'dotenv';

dotenv.config();  // Cargar variables de entorno desde .env

const app = express();
const server = http.createServer(app);

// Inicializamos la instancia de Socket.IO y la pasamos al controlador
const io = initSocket(server);

// Usamos las rutas de socket para manejar los eventos
app.use(express.json());  // Middleware para analizar las solicitudes JSON
app.use('/socket', socketRoutes(io));  // Pasamos `io` correctamente a las rutas

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
