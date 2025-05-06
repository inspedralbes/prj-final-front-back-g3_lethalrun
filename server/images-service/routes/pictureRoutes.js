import express from 'express';
import upload from '../middlewares/multer.js';
import createPictureController from '../controllers/createPictureController.js';
import dotenv from 'dotenv';

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

// Crear imagen
router.post('/create-picture', upload.single('file'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const pictureId = await createPictureController.createPicture(req.file, userId);

    await notifyImageChange(userId, `Imagen creada: ${pictureId}`);

    res.status(201).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Establecer imagen activa
router.put('/set-active-picture/:pictureId/:userId', async (req, res) => {
  try {
    const { pictureId, userId } = req.params;
    await createPictureController.setActivePicture(pictureId, userId);

    await notifyImageChange(userId, `Imagen activa: ${pictureId}`);

    res.status(200).json({ message: 'Imagen activa establecida correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener imagen activa
router.get('/get-active-picture/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const picture = await createPictureController.getActivePicture(userId);
    res.status(200).json(picture || { message: 'No hay imagen activa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar imagen
router.delete('/delete-picture/:id/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    await createPictureController.deletePicture(id, userId);

    await notifyImageChange(userId, `Imagen eliminada: ${id}`);

    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las imágenes de un usuario
router.get('/get-user-pictures/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pictures = await createPictureController.getUserPictures(userId);
    res.status(200).json(pictures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar imagen
router.put('/update-picture/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    const pictureId = await createPictureController.updatePicture(id, req.file, userId);

    await notifyImageChange(userId, `Imagen actualizada: ${pictureId}`);

    res.status(200).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
