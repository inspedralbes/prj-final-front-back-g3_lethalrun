import express from 'express';
import pictureController from '../../controllers/pictureController.js';

const router = express.Router();

<<<<<<< HEAD
// Recibe `db` (los modelos) como parámetro
const picturesRouter = (db) => {
  const controller = pictureController(db);

  // Ruta para crear una nueva imagen (sin archivo)
  router.post('/create/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const pictureId = await controller.createPicture(userId);
      res.status(201).json({ message: 'Imagen creada', pictureId });
    } catch (error) {
      console.error('Error creando imagen:', error);
=======
/**
 * @function picturesRouter
 * @group Imágenes - Gestión de imágenes de usuario
 * @description
 * Router modular para gestionar imágenes de usuario. Permite crear, activar, obtener y eliminar imágenes mediante controladores.
 * 
 * @param {Object} db - Objeto con los modelos de base de datos necesarios para el controlador
 * @returns {import('express').Router} Router de Express con las rutas configuradas
 */
const picturesRouter = (db) => {
  const controller = pictureController(db);

  /**
   * @route POST /create/:userId
   * @group Imágenes - Gestión de imágenes de usuario
   * @description
   * Crea un registro de imagen personalizada para un usuario (sin archivo físico).
   * 
   * @param {string} userId.path.required - ID del usuario
   * @param {string} customName.body.required - Nombre personalizado de la imagen
   * @returns {Object} 201 - Imagen creada correctamente, retorna el ID de la imagen
   * @returns {Object} 500 - Error interno al crear la imagen
   */
  router.post('/create/:userId', async (req, res) => {
    const { userId } = req.params;
    const { customName } = req.body;
    try {
      const pictureId = await controller.createPicture(userId, customName);
      res.status(201).json({ message: 'Imagen creada', pictureId });
    } catch (error) {
>>>>>>> origin/dev
      res.status(500).json({ error: error.message });
    }
  });

<<<<<<< HEAD
  // Ruta para establecer una imagen activa para un usuario
=======
  /**
   * @route PUT /set-active/:pictureId/:userId
   * @group Imágenes - Gestión de imágenes de usuario
   * @description
   * Establece una imagen como activa para el usuario.
   * 
   * @param {string} pictureId.path.required - ID de la imagen a activar
   * @param {string} userId.path.required - ID del usuario
   * @returns {Object} 200 - Imagen activa establecida correctamente
   * @returns {Object} 500 - Error interno al establecer la imagen activa
   */
>>>>>>> origin/dev
  router.put('/set-active/:pictureId/:userId', async (req, res) => {
    const { pictureId, userId } = req.params;
    try {
      await controller.setActivePicture(pictureId, userId);
      res.status(200).json({ message: 'Imagen activa establecida correctamente' });
    } catch (error) {
<<<<<<< HEAD
      console.error('Error estableciendo la imagen activa:', error);
=======
>>>>>>> origin/dev
      res.status(500).json({ error: error.message });
    }
  });

<<<<<<< HEAD
  // Ruta para obtener la imagen activa de un usuario
=======
  /**
   * @route GET /active/:userId
   * @group Imágenes - Gestión de imágenes de usuario
   * @description
   * Obtiene la imagen activa de un usuario.
   * 
   * @param {string} userId.path.required - ID del usuario
   * @returns {Object} 200 - Imagen activa encontrada
   * @returns {Object} 404 - No se encontró una imagen activa
   * @returns {Object} 500 - Error interno al obtener la imagen activa
   */
>>>>>>> origin/dev
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
<<<<<<< HEAD
      console.error('Error obteniendo la imagen activa:', error);
=======
>>>>>>> origin/dev
      res.status(500).json({ error: error.message });
    }
  });

<<<<<<< HEAD
  // Ruta para eliminar una imagen
=======
  /**
   * @route DELETE /delete/:id/:userId
   * @group Imágenes - Gestión de imágenes de usuario
   * @description
   * Elimina una imagen de usuario.
   * 
   * @param {string} id.path.required - ID de la imagen a eliminar
   * @param {string} userId.path.required - ID del usuario
   * @returns {Object} 200 - Imagen eliminada correctamente
   * @returns {Object} 500 - Error interno al eliminar la imagen
   */
>>>>>>> origin/dev
  router.delete('/delete/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
      await controller.deletePicture(id, userId);
      res.status(200).json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
<<<<<<< HEAD
      console.error('Error eliminando imagen:', error);
=======
>>>>>>> origin/dev
      res.status(500).json({ error: error.message });
    }
  });

<<<<<<< HEAD
  // Ruta para obtener todas las imágenes de un usuario
=======
  /**
   * @route GET /all/:userId
   * @group Imágenes - Gestión de imágenes de usuario
   * @description
   * Obtiene todas las imágenes de un usuario.
   * 
   * @param {string} userId.path.required - ID del usuario
   * @returns {Array<Object>} 200 - Lista de imágenes del usuario
   * @returns {Object} 500 - Error interno al obtener las imágenes
   */
>>>>>>> origin/dev
  router.get('/all/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const pictures = await controller.getUserPictures(userId);
      res.status(200).json(pictures);
    } catch (error) {
<<<<<<< HEAD
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
=======
>>>>>>> origin/dev
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default picturesRouter;
