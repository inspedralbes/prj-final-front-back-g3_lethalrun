import express from 'express';
import bcrypt from 'bcrypt';
import createUserController from '../../controllers/userController.js';

// Recibe los modelos como parámetro
const usersRouter = (db) => {
  const router = express.Router();
  const controller = createUserController(db);

  // Crear usuario
  router.post('/', async (req, res) => {
    const { email, username, password } = req.body;
    try {
      const userId = await controller.createUser(email, username, password);
      res.status(201).json({ id: userId });
    } catch (error) {
      console.error('❌ Error al crear el usuario:', error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  });

  // Obtener usuario por ID
  router.get('/:id', async (req, res) => {
    try {
      const user = await controller.getUser(req.params.id);
      if (user) res.json(user);
      else res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
      console.error('❌ Error al obtener el usuario:', error);
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  });

  // Obtener usuario por email (query param ?email=...)
  router.get('/', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: 'Email requerido en query' });

    try {
      const user = await controller.getUserByEmail(email);
      if (user) res.json(user);
      else res.status(404).json({ error: 'Usuario no encontrado' });
    } catch (error) {
      console.error('❌ Error al obtener usuario por email:', error);
      res.status(500).json({ error: 'Error al obtener el usuario por email' });
    }
  });

  // Cambiar nombre de usuario
  router.put('/:id/username', async (req, res) => {
    const { newUsername } = req.body;
    try {
      const user = await db.User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      await controller.changeUsername(user, newUsername);
      res.json({ message: 'Nombre de usuario actualizado' });
    } catch (error) {
      console.error('❌ Error al cambiar el nombre de usuario:', error);
      res.status(500).json({ error: 'Error al cambiar el nombre de usuario' });
    }
  });

  // Cambiar contraseña
  router.put('/:id/password', async (req, res) => {
    const { password } = req.body;
    try {
      const user = await db.User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      const hashed = await bcrypt.hash(password, 10);
      await controller.changePassword(user, hashed);
      res.json({ message: 'Contraseña actualizada' });
    } catch (error) {
      console.error('❌ Error al cambiar la contraseña:', error);
      res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
  });

  // Eliminar usuario
  router.delete('/:id', async (req, res) => {
    try {
      await controller.deleteUser(req.params.id);
      res.json({ message: 'Usuario eliminado' });
    } catch (error) {
      console.error('❌ Error al eliminar el usuario:', error);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  });

  return router;
};

export default usersRouter;
