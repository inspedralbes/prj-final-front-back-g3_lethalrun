import express from 'express';
import pictureController from '../../controllers/pictureController.js';

const router = express.Router();

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
      res.status(500).json({ error: error.message });
    }
  });

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
  router.put('/set-active/:pictureId/:userId', async (req, res) => {
    const { pictureId, userId } = req.params;
    try {
      await controller.setActivePicture(pictureId, userId);
      res.status(200).json({ message: 'Imagen activa establecida correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

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
      res.status(500).json({ error: error.message });
    }
  });

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
  router.delete('/delete/:id/:userId', async (req, res) => {
    const { id, userId } = req.params;
    try {
      await controller.deletePicture(id, userId);
      res.status(200).json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

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
  router.get('/all/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const pictures = await controller.getUserPictures(userId);
      res.status(200).json(pictures);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default picturesRouter;
