import express from 'express';
import fetch from 'node-fetch';
import upload from '../middleware/multer.js';
import dotenv from 'dotenv';
import { verifyJWTCliente } from '../middleware/verifyJWT.js';
import { createPictureController } from '../controllers/pictureController.js';

dotenv.config();

const router = express.Router();

/**
 * Notifica a un socket sobre cambios en las imágenes de un usuario.
 * Envía la lista actualizada de imágenes al servicio de sockets.
 *
 * @param {string} userId - ID del usuario.
 * @param {string} socketId - ID del socket a notificar.
 * @param {string} token - Token de autenticación Bearer.
 * @returns {Promise<void>}
 */
const notifyImageChange = async (userId, socketId, token) => {
  const apiUrl = process.env.SOCKET_API_URL;
  if (!socketId || !apiUrl) return;

  const message = await createPictureController.getUserPictures(userId);
  try {
    await fetch(`${apiUrl}/private/${socketId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ message }),
    });
  } catch {
    // Error silencioso para no interrumpir el flujo principal
  }
};

/**
 * @route POST /create-picture
 * @group Imágenes - Gestión de imágenes de usuario
 * @security JWT
 * @description
 * Sube una imagen personalizada para un usuario autenticado y notifica el cambio por socket.
 * 
 * @returns {Object} 201 - Imagen creada correctamente
 * @returns {Object} 500 - Error interno del servidor
 */
router.post('/create-picture', verifyJWTCliente, upload.single('file'), async (req, res) => {
  try {
    const { userId, socketId } = req.body;
    await createPictureController.createPicture(req.file, userId);
    const token = req.headers.authorization.split(' ')[1];
    await notifyImageChange(userId, socketId, token);
    res.status(201).json({ message: 'Imagen creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /create-default-picture/:userId
 * @group Imágenes - Gestión de imágenes de usuario
 * @description
 * Copia la imagen por defecto para un usuario. No requiere autenticación.
 * 
 * @param {string} customName.body.required - Nombre personalizado para la imagen por defecto
 * @returns {Object} 201 - Imagen por defecto creada correctamente
 * @returns {Object} 400 - Falta el nombre personalizado
 * @returns {Object} 500 - Error interno del servidor
 */
router.post('/create-default-picture/:userId', async (req, res) => {
  const { userId } = req.params;
  const { customName } = req.body;

  if (!customName) {
    return res.status(400).json({ error: 'El nombre personalizado (customName) es requerido.' });
  }

  try {
    await createPictureController.createDefaultPicture(userId, customName);
    res.status(201).json({ message: 'Imagen por defecto creada correctamente' });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route PUT /set-active-picture/:pictureId/:userId
 * @group Imágenes - Gestión de imágenes de usuario
 * @security JWT
 * @description
 * Establece una imagen como activa para el usuario y notifica el cambio por socket.
 * 
 * @returns {Object} 200 - Imagen activa establecida correctamente
 * @returns {Object} 500 - Error interno del servidor
 */
router.put('/set-active-picture/:pictureId/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { pictureId, userId } = req.params;
    const { socketId } = req.body;
    await createPictureController.setActivePicture(pictureId, userId);
    await notifyImageChange(userId, socketId, token);
    res.status(200).json({ message: 'Imagen activa establecida correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route DELETE /delete-picture/:id/:fileName/:userId
 * @group Imágenes - Gestión de imágenes de usuario
 * @security JWT
 * @description
 * Elimina una imagen de usuario y notifica el cambio por socket.
 * 
 * @returns {Object} 200 - Imagen eliminada correctamente
 * @returns {Object} 500 - Error interno del servidor
 */
router.delete('/delete-picture/:id/:fileName/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { id, fileName, userId } = req.params;
    const { socketId } = req.body;
    await createPictureController.deletePicture(id, userId, token, fileName);
    await notifyImageChange(userId, socketId, token);

    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /get-user-pictures/:userId
 * @group Imágenes - Gestión de imágenes de usuario
 * @security JWT
 * @description
 * Obtiene todas las imágenes de un usuario autenticado.
 * 
 * @returns {Array<Object>} 200 - Lista de imágenes del usuario
 * @returns {Object} 500 - Error interno del servidor
 */
router.get('/get-user-pictures/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { userId } = req.params;
    const pictures = await createPictureController.getUserPictures(userId);
    res.status(200).json(pictures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /get-active-picture/:userId
 * @group Imágenes - Gestión de imágenes de usuario
 * @security JWT
 * @description
 * Obtiene la imagen activa de un usuario autenticado.
 * 
 * @returns {Object} 200 - Imagen activa del usuario
 * @returns {Object} 404 - No se encontró una imagen activa
 * @returns {Object} 500 - Error interno del servidor
 */
router.get('/get-active-picture/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { userId } = req.params;
    const picture = await createPictureController.getActivePicture(userId);
    if (picture) {
      res.status(200).json(picture);
    } else {
      res.status(404).json({ message: 'No se encontró una imagen activa' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route DELETE /delete-user/:userId
 * @group Imágenes - Gestión de imágenes de usuario
 * @security JWT
 * @description
 * Elimina la carpeta completa de imágenes de un usuario y notifica el cambio por socket.
 * 
 * @returns {Object} 200 - Carpeta del usuario eliminada correctamente
 * @returns {Object} 500 - Error interno del servidor
 */
router.delete('/delete-user/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const { userId } = req.params;
    const { socketId } = req.body;
    await createPictureController.deleteUserFolder(userId);
    await notifyImageChange(userId, socketId, token);
    res.status(200).json({ message: `Carpeta del usuario ${userId} eliminada correctamente.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
