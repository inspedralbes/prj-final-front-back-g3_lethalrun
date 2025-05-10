import express from 'express';
import upload from '../middleware/multer.js';
import dotenv from 'dotenv';
import { verifyJWTCliente } from '../middleware/verifyJWT.js';
import { createPictureController } from '../controllers/pictureController.js';

dotenv.config();

const router = express.Router();

// Función para notificar cambios en las imágenes a través de sockets
const notifyImageChange = async (userId, socketId, message) => {
  const apiUrl = process.env.SOCKET_API_URL;
  if (!socketId || !apiUrl) return;

  try {
    await fetch(`${apiUrl}/private/${socketId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  } catch (err) {
    console.error('Error notificando al socket:', err.message);
  }
};

// Crear imagen personalizada
router.post('/create-picture', verifyJWTCliente, upload.single('file'), async (req, res) => {
  try {
    const { userId, socketId } = req.body;
    await createPictureController.createPicture(req.file, userId);
    await notifyImageChange(userId, socketId, `Imagen personalizada creada`);
    res.status(201).json({ message: 'Imagen creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear imagen por defecto (NO maneja ni devuelve pictureId)
router.post('/create-default-picture/:userId', async (req, res) => {
  const { userId } = req.params;
  const { customName } = req.body;

  if (!customName) {
    return res.status(400).json({ error: 'El nombre personalizado (customName) es requerido.' });
  }

  try {
    console.log("Imagen por defecto creandose...");
    await createPictureController.createDefaultPicture(userId, customName);
    console.log("Imagen por defecto creada correctamente");
    res.status(201).json({ message: 'Imagen por defecto creada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Establecer imagen activa (proxy al SQL)
router.put('/set-active-picture/:pictureId/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { pictureId, userId } = req.params;
    await createPictureController.setActivePicture(pictureId, userId);
    res.status(200).json({ message: 'Imagen activa establecida correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar imagen (requiere pictureId)
router.delete('/delete-picture/:id/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { id, userId } = req.params;
    const { socketId } = req.body;
    await createPictureController.deletePicture(id, userId);
    await notifyImageChange(userId, socketId, `Imagen eliminada: ${id}`);
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las imágenes de un usuario
router.get('/get-user-pictures/:userId', verifyJWTCliente, async (req, res) => {
  console.log("entrando en metodo")
  try {
    const { userId } = req.params;
    const pictures = await createPictureController.getUserPictures(userId);
    res.status(200).json(pictures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener la imagen activa de un usuario
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

// Eliminar carpeta completa del usuario
router.delete('/delete-user/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { userId } = req.params;
    const { socketId } = req.body;
    await createPictureController.deleteUserFolder(userId);
    await notifyImageChange(userId, socketId, `Carpeta del usuario ${userId} eliminada correctamente.`);
    res.status(200).json({ message: `Carpeta del usuario ${userId} eliminada correctamente.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
