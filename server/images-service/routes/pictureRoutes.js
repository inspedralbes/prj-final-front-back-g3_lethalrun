import express from 'express';
import upload from '../middleware/multer.js';
import { createPictureController } from '../controllers/pictureController.js';
import dotenv from 'dotenv';
import { verifyJWTCliente } from '../middleware/verifyJWT.js';

dotenv.config();

const router = express.Router();

const notifyImageChange = async (userId, message) => {
  const socketId = await getSocketIdByUserId(userId);
  const apiUrl = process.env.SOCKET_API_URL;

  if (!socketId || !apiUrl) return;

  try {
    await fetch(`${apiUrl}/private/${socketId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
  } catch (err) {
    console.error('Error notificando al socket:', err.message);
  }
};

// ⬇️ AÑADE verifyJWTCliente a cada ruta protegida

// Ruta para crear una nueva imagen
router.post('/create-picture', verifyJWTCliente, upload.single('file'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const customName = req.body.customName; // Nombre personalizado recibido
    const pictureId = await createPictureController.createPicture(req.file, userId, customName); // Pasamos el customName

    await notifyImageChange(userId, `Imagen creada: ${pictureId}`);
    res.status(201).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear una imagen por defecto
router.post('/create-default-picture/:userId', verifyJWTCliente, async (req, res) => {
  const { userId } = req.params;
  const { customName } = req.body;  // El nombre personalizado puede ser enviado en el cuerpo de la solicitud
  try {
    const pictureId = await createPictureController.createDefaultPicture(userId, customName); // Pasamos el customName

    await notifyImageChange(userId, `Imagen por defecto creada: ${pictureId}`);
    res.status(201).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para establecer una imagen activa
router.put('/set-active-picture/:pictureId/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { pictureId, userId } = req.params;
    await createPictureController.setActivePicture(pictureId, userId);

    await notifyImageChange(userId, `Imagen activa: ${pictureId}`);
    res.status(200).json({ message: 'Imagen activa establecida correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener la imagen activa
router.get('/get-active-picture/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { userId } = req.params;
    const picture = await createPictureController.getActivePicture(userId);
    res.status(200).json(picture || { message: 'No hay imagen activa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar una imagen
router.delete('/delete-picture/:id/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { id, userId } = req.params;
    await createPictureController.deletePicture(id, userId);

    await notifyImageChange(userId, `Imagen eliminada: ${id}`);
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener todas las imágenes de un usuario
router.get('/get-user-pictures/:userId', verifyJWTCliente, async (req, res) => {
  try {
    const { userId } = req.params;
    const pictures = await createPictureController.getUserPictures(userId);
    res.status(200).json(pictures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar una imagen
router.put('/update-picture/:id', verifyJWTCliente, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    const customName = req.body.customName; // Nombre personalizado recibido
    const pictureId = await createPictureController.updatePicture(id, req.file, userId, customName); // Pasamos el customName

    await notifyImageChange(userId, `Imagen actualizada: ${pictureId}`);
    res.status(200).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
