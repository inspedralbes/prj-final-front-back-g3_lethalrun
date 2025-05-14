import express from 'express';
import { verifyJWTCliente, verifyJWTAdmin } from '../middleware/verifyJWT.js';

const router = express.Router();

/**
 * @route GET /check-cliente
 * @group Autorización - Verificación de tokens para cliente o admin
 * @security JWT
 * @description
 * Endpoint público para que otros servicios verifiquen si el token JWT recibido es válido
 * para un usuario con rol de cliente o admin. Útil para autorización en arquitecturas de microservicios.
 * Si el token es válido, responde con los datos del usuario decodificados.
 * 
 * @returns {Object} 200 - Token válido, incluye datos del usuario
 * @returns {Object} 401/403 - Token ausente o inválido
 */
router.get('/check-cliente', verifyJWTCliente, (req, res) => {
  // Si el middleware pasa, el token es válido para cliente o admin
  res.status(200).json({
    message: 'Token válido para cliente o admin',
    user: req.user, // Usuario decodificado disponible en req.user
  });
});

/**
 * @route GET /check-admin
 * @group Autorización - Verificación de tokens para admin
 * @security JWTAdmin
 * @description
 * Endpoint público para que otros servicios verifiquen si el token JWT recibido pertenece
 * exclusivamente a un usuario con rol de administrador. Si el token es válido, responde
 * con los datos del usuario decodificados.
 * 
 * @returns {Object} 200 - Token válido solo para admin, incluye datos del usuario
 * @returns {Object} 401/403 - Token ausente, inválido o sin permisos de admin
 */
router.get('/check-admin', verifyJWTAdmin, (req, res) => {
  // Si el middleware pasa, el token es válido solo para admin
  res.status(200).json({
    message: 'Token válido solo para admin',
    user: req.user, // Usuario decodificado disponible en req.user
  });
});

export default router;
