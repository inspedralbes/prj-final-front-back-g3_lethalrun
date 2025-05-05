import express from 'express';
import multer from 'multer'; // Suponiendo que uses multer para manejar la carga de archivos
import { createPictureController } from './pictureController.js';

const router = express.Router();

// Configuración de multer para cargar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// Ruta para crear una imagen por defecto cuando se crea un nuevo usuario
router.post('/create-default-picture', async (req, res) => {
  try {
    const { userId } = req.body; // Suponemos que el ID del usuario está en el cuerpo de la solicitud
    const pictureId = await createPictureController.createDefaultPicture(userId);
    res.status(201).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para crear una nueva imagen asociada a un usuario
router.post('/create-picture', upload.single('file'), async (req, res) => {
  try {
    const userId = req.body.userId;
    const pictureId = await createPictureController.createPicture(req.file, userId);
    res.status(201).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para establecer una imagen como activa para un usuario
router.put('/set-active-picture/:pictureId/:userId', async (req, res) => {
  try {
    const { pictureId, userId } = req.params;
    await createPictureController.setActivePicture(pictureId, userId);
    res.status(200).json({ message: 'Imagen activa establecida correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener la imagen activa de un usuario
router.get('/get-active-picture/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const picture = await createPictureController.getActivePicture(userId);
    res.status(200).json(picture || { message: 'No hay imagen activa' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para eliminar una imagen asociada a un usuario
router.delete('/delete-picture/:id/:userId', async (req, res) => {
  try {
    const { id, userId } = req.params;
    await createPictureController.deletePicture(id, userId);
    res.status(200).json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener todas las imágenes de un usuario
router.get('/get-user-pictures/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const pictures = await createPictureController.getUserPictures(userId);
    res.status(200).json(pictures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para actualizar una imagen asociada a un usuario
router.put('/update-picture/:id', upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    const pictureId = await createPictureController.updatePicture(id, req.file, userId);
    res.status(200).json({ pictureId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
