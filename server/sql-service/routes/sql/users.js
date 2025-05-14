import express from 'express';
import createUserController from '../../controllers/userController.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * @function usersRouter
 * @group Usuarios - Gestión de usuarios
 * @description Router modular para operaciones CRUD de usuarios
 * @param {Object} db - Objeto con modelos de base de datos
 * @returns {import('express').Router} Router configurado
 */
const usersRouter = (db) => {
  const controller = createUserController(db);

  /**
   * @route POST /
   * @group Usuarios - Gestión de usuarios
   * @description Crea un nuevo usuario. Campos requeridos: email, username y password
   * @param {string} email.body.required - Email único del usuario
   * @param {string} username.body.required - Nombre de usuario
   * @param {string} password.body.required - Contraseña en texto plano
   * @returns {Object} 201 - Usuario creado con ID
   * @returns {Object} 400 - Faltan campos requeridos
   * @returns {Object} 500 - Error interno del servidor
   */
  router.post('/', async (req, res) => {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Email, username y password son requeridos' });
    }

    try {
      const userId = await controller.createUser(email, username, password);
      res.status(201).json({ userId, message: 'Usuario registrado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @route GET /:id
   * @group Usuarios - Gestión de usuarios
   * @description Obtiene un usuario por su ID
   * @param {string} id.path.required - ID del usuario
   * @returns {Object} 200 - Datos del usuario
   * @returns {Object} 404 - Usuario no encontrado
   * @returns {Object} 500 - Error interno del servidor
   */
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const user = await controller.getUser(id);
      user ? res.status(200).json(user) : res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @route GET /by-email/:email
   * @group Usuarios - Gestión de usuarios
   * @description Busca un usuario por su email
   * @param {string} email.path.required - Email del usuario
   * @returns {Object} 200 - Datos del usuario
   * @returns {Object} 404 - Usuario no encontrado
   * @returns {Object} 500 - Error interno del servidor
   */
  router.get('/by-email/:email', async (req, res) => {
    const { email } = req.params;

    try {
      const user = await controller.getUserByEmail(email);
      user ? res.status(200).json(user) : res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @route PUT /:id/username
   * @group Usuarios - Gestión de usuarios
   * @description Actualiza el nombre de usuario
   * @param {string} id.path.required - ID del usuario
   * @param {string} newUsername.body.required - Nuevo nombre de usuario
   * @returns {Object} 200 - Nombre actualizado
   * @returns {Object} 400 - Falta nuevo nombre
   * @returns {Object} 404 - Usuario no encontrado
   * @returns {Object} 500 - Error interno del servidor
   */
  router.put('/:id/username', async (req, res) => {
    const { id } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ error: 'El nuevo nombre de usuario es requerido' });
    }

    try {
      const user = await controller.getUser(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      
      await controller.changeUsername(user, newUsername);
      res.status(200).json({ message: 'Nombre de usuario actualizado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @route PUT /:id/password
   * @group Usuarios - Gestión de usuarios
   * @description Actualiza la contraseña del usuario (se hashea antes de guardar)
   * @param {string} id.path.required - ID del usuario
   * @param {string} password.body.required - Nueva contraseña en texto plano
   * @returns {Object} 200 - Contraseña actualizada
   * @returns {Object} 400 - Falta nueva contraseña
   * @returns {Object} 404 - Usuario no encontrado
   * @returns {Object} 500 - Error interno del servidor
   */
  router.put('/:id/password', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'La nueva contraseña es requerida' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await controller.getUser(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
      
      await controller.changePassword(user, hashedPassword);
      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /**
   * @route DELETE /:id
   * @group Usuarios - Gestión de usuarios
   * @description Elimina un usuario y todos sus datos asociados
   * @param {string} id.path.required - ID del usuario
   * @returns {Object} 200 - Usuario eliminado
   * @returns {Object} 500 - Error interno del servidor
   */
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await controller.deleteUser(id);
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default usersRouter;
