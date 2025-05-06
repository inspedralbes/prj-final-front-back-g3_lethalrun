// server/routes/socketRoutes.js

import express from 'express';

/**
 * Rutas para emitir eventos de socket
 * @param {Server} io - Instancia de Socket.IO
 */
const router = express.Router();

router.post('/broadcast', (req, res) => {
  const { message } = req.body;
  io.emit('receive-global-message', { message });
  res.status(200).json({ status: 'Mensaje enviado a todos' });
});

router.post('/private/:socketId', (req, res) => {
  const { socketId } = req.params;
  const { message } = req.body;

  io.to(socketId).emit('receive-private-message', { message });
  res.status(200).json({ status: `Mensaje enviado a ${socketId}` });
});

router.post('/broadcast-others', (req, res) => {
  const { message, senderSocketId } = req.body;

  // Validamos que exista
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

export default router;
