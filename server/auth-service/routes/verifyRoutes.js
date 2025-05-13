import express from 'express';
import { verifyJWTCliente, verifyJWTAdmin } from '../middleware/verifyJWT.js';

const router = express.Router();

/**
 * Ruta pública para que otros servicios verifiquen si el token es válido para cliente o admin.
 * Se puede usar como autorización en microservicios.
 */
router.get('/check-cliente', verifyJWTCliente, (req, res) => {
  console.log("La llamada llega a la ruta del auth")
  // Aquí ya sabemos que el token es válido para cliente o admin
  res.status(200).json({
    message: 'Token válido para cliente o admin',
    user: req.user, // El usuario está decodificado y disponible en req.user
  });
});

/**
 * Ruta pública para que otros servicios verifiquen si el token pertenece exclusivamente a un admin.
 */
router.get('/check-admin', verifyJWTAdmin, (req, res) => {
  // Aquí garantizamos que el token solo es válido para admin
  res.status(200).json({
    message: 'Token válido solo para admin',
    user: req.user, // El usuario está decodificado y disponible en req.user
  });
});

export default router;
