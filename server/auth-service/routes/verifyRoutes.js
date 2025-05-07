import express from 'express';
import { verifyJWTCliente, verifyJWTAdmin } from '../middleware/verifyJWT.js';

const router = express.Router();

/**
 * Ruta pública para que otros servicios verifiquen si el token es válido para cliente o admin.
 * Se puede usar como autorización en microservicios.
 */
router.get('/check-cliente', verifyJWTCliente, (req, res) => {
  res.status(200).json({
    message: 'Token válido para cliente o admin',
    user: req.user,
  });
});

/**
 * Ruta pública para que otros servicios verifiquen si el token pertenece exclusivamente a un admin.
 */
router.get('/check-admin', verifyJWTAdmin, (req, res) => {
  res.status(200).json({
    message: 'Token válido solo para admin',
    user: req.user,
  });
});

export default router;
