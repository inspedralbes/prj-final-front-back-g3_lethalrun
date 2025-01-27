import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import passport from './passport-config.js';
import session from 'express-session';

import db from './sql/connectDB.js';
import createPictureModel from './controllers/pictureController.js';
import createUserModel from './controllers/userController.js';

const userModel = createUserModel(db);
const pictureModel = createPictureModel(db);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT;

// Configuración del servidor
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'clave-secreta',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 86400000, httpOnly: true, sameSite: 'lax' },
  })
);

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Middleware para proteger rutas
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'No autorizado' });
}

// LOGIN CON GOOGLE --------------------------------------------------------------------------
// Ruta protegida
app.get('/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'Ruta protegida' });
});

// Ruta para autenticación con Google
app.get(
  '/api/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

// Callback de autenticación
app.get(
  '/api/auth/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  async (req, res) => {
    try {
      let user = await userModel.getUserByEmail(req.user.email);

      if (!user) {
        // Si el usuario no existe, lo creamos con una contraseña aleatoria
        const randomPassword = crypto.randomBytes(16).toString('hex');
        const userId = await userModel.createUser(req.user.email, req.user.displayName, randomPassword, 'cliente');
        await pictureModel.createDefaultPicture(userId);
        user = await userModel.getUser(userId);
      }

      // Iniciar sesión con el usuario
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
        }

        // Redirigir al cliente con los datos del usuario
        res.redirect(
          `${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}/callback?user=${encodeURIComponent(
            JSON.stringify(user)
          )}`
        );
      });
    } catch (error) {
      res.status(500).json({ message: 'Error en el proceso de autenticación', error: error.message });
    }
  }
);

// Ruta para cerrar sesión
app.get('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}`);
  });
});

// USUARIOS -------------------------------------------------------------------------------
// Crear usuario
app.post('/users', async (req, res) => {
  try {
    const { email, username, password, rol } = req.body;
    const userId = await userModel.createUser(email, username, password, rol);
    await pictureModel.createDefaultPicture(userId);
    res.status(201).json({ id: userId, message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

app.post('/testDB', async (req, res) => {
    try {
      // Datos de prueba
      const email = 'testuser@example.com';
      const username = 'TestUser';
      const password = 'password123';
      const rol = 'cliente';
  
      // Crear usuario y asignar imagen por defecto
      const userId = await userModel.createUser(email, username, password, rol);
      await pictureModel.createDefaultPicture(userId);
  
      // Respuesta de éxito
      res.status(201).json({
        message: 'Prueba exitosa: Usuario creado correctamente',
        userId,
      });
    } catch (error) {
      // Manejo de errores
      res.status(500).json({
        message: 'Prueba fallida: Error al crear usuario',
        error: error.message,
      });
    }
  });
  

// Obtener usuario
app.get('/users/:id', async (req, res) => {
  try {
    const user = await userModel.getUser(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// Eliminar usuario
app.delete('/users/:id', async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

// IMÁGENES -------------------------------------------------------------------------------
// Crear imagen
app.post('/pictures', async (req, res) => {
  try {
    const { path, userId } = req.body;
    const pictureId = await pictureModel.createPicture(path, userId);
    res.status(201).json({ id: pictureId, message: 'Imagen creada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear imagen', error: error.message });
  }
});

// Establecer imagen activa
app.put('/pictures/:id/setActive', async (req, res) => {
  try {
    const { userId } = req.body;
    await pictureModel.setActivePicture(req.params.id, userId);
    res.json({ message: 'Imagen establecida como activa exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al establecer imagen activa', error: error.message });
  }
});

// Obtener imagen activa de un usuario
app.get('/users/:userId/activePicture', async (req, res) => {
  try {
    const activePicture = await pictureModel.getActivePicture(req.params.userId);
    if (activePicture) {
      res.json(activePicture);
    } else {
      res.status(404).json({ message: 'Imagen activa no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener imagen activa', error: error.message });
  }
});

// INICIAR SERVIDOR -----------------------------------------------------------------------
server.listen(PORT, () => console.log(`Servidor corriendo en ${process.env.DOMAIN_URL}:${PORT}`));
