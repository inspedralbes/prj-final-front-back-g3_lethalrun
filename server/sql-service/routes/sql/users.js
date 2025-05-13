import express from 'express';
import createUserController from '../../controllers/userController.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const usersRouter = (db) => {
  const controller = createUserController(db);

 // usersRouter.js
router.post('/', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ error: 'Email, username y password son requeridos' });
  }

  try {
    const userId = await controller.createUser(email, username, password);
    // Hasta aquí no se responde nada
    res.status(201).json({ userId, message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error creando el usuario:', error);
    res.status(500).json({ error: error.message });
  }
});

  // Obtener usuario por ID
  router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      const user = await controller.getUser(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error obteniendo el usuario:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Obtener usuario por email (ruta ajustada para evitar colisión)
  router.get('/by-email/:email', async (req, res) => {
    const { email } = req.params;

    try {
      const user = await controller.getUserByEmail(email);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error obteniendo el usuario por email:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Cambiar el nombre de usuario
  router.put('/:id/username', async (req, res) => {
    const { id } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) {
      return res.status(400).json({ error: 'El nuevo nombre de usuario es requerido' });
    }

    try {
      const user = await controller.getUser(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await controller.changeUsername(user, newUsername);
      res.status(200).json({ message: 'Nombre de usuario actualizado correctamente' });
    } catch (error) {
      console.error('Error cambiando el nombre de usuario:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Cambiar la contraseña
  router.put('/:id/password', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'La nueva contraseña es requerida' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await controller.getUser(id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      await controller.changePassword(user, hashedPassword);
      res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
      console.error('Error cambiando la contraseña:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Eliminar usuario
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
      await controller.deleteUser(id);
      res.status(200).json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      console.error('Error eliminando el usuario:', error);
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};

export default usersRouter;
