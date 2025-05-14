// server/routes/socketRoutes.js

import { verifyJWTCliente } from '../middleware/verifyJWT.js';  // Middleware de verificación de JWT
import express from 'express';

const router = express.Router();

/**
 * Rutas para emitir eventos de socket
 * @param {Server} io - Instancia de Socket.IO
 */

export default (io) => {  // Asegúrate de que se esté exportando una función que acepte `io`
  router.post('/broadcast', (req, res) => {
    const { message } = req.body;
    io.emit('receive-global-message', { message });
    res.status(200).json({ status: 'Mensaje enviado a todos' });
  });

  router.post('/private/:socketId', verifyJWTCliente, (req, res) => {
    const { socketId } = req.params;
    const { message } = req.body;
    console.log('Mensaje privado:', message);
    console.log('Enviando mensaje privado a:', socketId);
    io.to(socketId).emit('update-pictures', { message });
    res.status(200).json({ status: `Mensaje enviado a ${socketId}` });
  });

  router.post('/broadcast-others', (req, res) => {
    const { message, senderSocketId } = req.body;

    if (!senderSocketId) {
      return res.status(400).json({ error: 'senderSocketId es requerido' });
    }

    const socket = io.sockets.sockets.get(senderSocketId);
    if (socket) {
      socket.broadcast.emit('receive-from-others', { message });
      res.status(200).json({ status: 'Mensaje emitido a todos menos al emisor' });
    } else {
      res.status(404).json({ error: 'Socket no encontrado' });
    }
  });

  return router;  // Devuelves el router que ya contiene las rutas configuradas
};
