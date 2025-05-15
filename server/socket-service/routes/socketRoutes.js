import { verifyJWTCliente } from '../middleware/verifyJWT.js';
import express from 'express';

const router = express.Router();
let io; // Variable para almacenar la instancia de Socket.IO

/**
 * @function
 * @name socketRoutes
 * @description
 * Configura y devuelve un router de Express para manejar eventos de Socket.IO.
 * Permite emitir eventos globales, privados y a todos menos al emisor.
 *
 * @param {import('socket.io').Server} _io - Instancia de Socket.IO
 * @returns {import('express').Router} Router de Express con las rutas configuradas
 */
export default (_io) => {
  io = _io;

  /**
   * @route POST /broadcast
   * @group Sockets - Emisión de eventos globales
   * @description
   * Envía un mensaje a todos los clientes conectados mediante el evento `receive-global-message`.
   * 
   * @param {string} message.body.required - Mensaje a emitir globalmente
   * @returns {Object} 200 - Mensaje enviado a todos los sockets
   */
  router.post('/broadcast', (req, res) => {
    const { message } = req.body;
    io.emit('receive-global-message', { message });
    res.status(200).json({ status: 'Mensaje enviado a todos' });
  });

  /**
   * @route POST /private/:socketId
   * @group Sockets - Emisión de eventos privados
   * @security JWT
   * @description
   * Envía un mensaje privado al socket especificado mediante el evento `update-pictures`.
   * 
   * @param {string} socketId.path.required - ID del socket destino
   * @param {string} message.body.required - Mensaje a enviar al socket
   * @returns {Object} 200 - Mensaje enviado al socket especificado
   * @returns {Object} 401/403 - Acceso no autorizado
   */
  router.post('/private/:socketId', verifyJWTCliente, (req, res) => {
    const { socketId } = req.params;
    const { message } = req.body;
    io.to(socketId).emit('update-pictures', { message });
    res.status(200).json({ status: `Mensaje enviado a ${socketId}` });
  });

  /**
   * @route POST /broadcast-others
   * @group Sockets - Emisión de eventos a todos menos el emisor
   * @description
   * Envía un mensaje a todos los clientes conectados excepto al emisor, usando el evento `receive-from-others`.
   * 
   * @param {string} message.body.required - Mensaje a emitir
   * @param {string} senderSocketId.body.required - ID del socket emisor (será excluido)
   * @returns {Object} 200 - Mensaje emitido a todos menos al emisor
   * @returns {Object} 400 - Faltan parámetros
   * @returns {Object} 404 - Socket no encontrado
   */
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

  return router;
};
