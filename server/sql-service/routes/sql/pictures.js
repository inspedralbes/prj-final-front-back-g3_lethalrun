import express from 'express';
import pictureController from '../../controllers/pictureController.js';

const router = express.Router();

// Recibe `db` (los modelos) como parámetro
const picturesRouter = (db) => {
  const controller = pictureController(db);

  // Ruta para crear una nueva imagen (sin archivo) con un nombre personalizado
  router.post('/create/:userId', async (req, res) => {
    const { userId } = req.params;
    const { customName } = req.body;  // El nombre personalizado puede ser enviado en el cuerpo de la solicitud
    try {
      const pictureId = await controller.createPicture(userId, customName);
      res.status(201).json({ message: 'Imagen creada', pictureId });
    } catch (error) {
      console.error('Error creando imagen:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para crear una imagen por defecto (llama al método `createDefaultPicture`)
  router.post('/create-default/:userId', async (req, res) => {
    const { userId } = req.params;
    const { customName } = req.body;  // Nombre personalizado para la imagen por defecto
    try {
      const pictureId = await controller.createDefaultPicture(userId, customName);
      res.status(201).json({ message: 'Imagen por defecto creada', pictureId });
    } catch (error) {
      console.error('Error creando imagen por defecto:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para establecer una imagen activa para un usuario
  router.put('/set-active/:pictureId/:userId', async (req, res) => {
    const { pictureId, userId } = req.params;
    try {
      await controller.setActivePicture(pictureId, userId);
      res.status(200).json({ message: 'Imagen activa establecida correctamente' });
    } catch (error) {
      console.error('Error estableciendo la imagen activa:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para obtener la imagen activa de un usuario
  router.get('/active/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const picture = await controller.getActivePicture(userId);
      if (picture) {
        res.status(200).json(picture);
      } else {
        res.status(404).json({ message: 'No se encontró una imagen activa' });
      }
    } catch (error) {
      console.error('Error obteniendo la imagen activa:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para eliminar una imagen
  router.delete('/delete/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
      await controller.deletePicture(id, userId);
      res.status(200).json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
      console.error('Error eliminando imagen:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para obtener todas las imágenes de un usuario
  router.get('/all/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const pictures = await controller.getUserPictures(userId);
      res.status(200).json(pictures);
    } catch (error) {
      console.error('Error obteniendo imágenes del usuario:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Ruta para actualizar el path de una imagen
  router.put('/update/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    const { newPath } = req.body;
    try {
      const updatedPictureId = await controller.updatePicturePath(id, userId, newPath);
      res.status(200).json({ message: 'Imagen actualizada correctamente', pictureId: updatedPictureId });
    } catch (error) {
      console.error('Error actualizando imagen:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default picturesRouter;
