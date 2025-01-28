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
import createPictureController from './controllers/pictureController.js';
import createUserController from './controllers/userController.js';

const userController = createUserController(db);
const pictureController = createPictureController(db);

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
    origin: (origin, callback) => {
        callback(null, origin);
    },
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

function isAdmin() {
    return (req, res, next) => {
        if (req.isAuthenticated() && req.user.rol === 'admin') {
            return next(); // Usuario tiene el rol requerido
        }
        res.status(403).json({ message: `Acceso denegado: se requiere rol admin` }); // Acceso denegado
    };
}
// LOGIN CON EMAIL I CONTRASENYA -------------------------------------------------------------

app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error en el servidor', error: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: 'Credenciales incorrectas', details: info });
        }
        req.logIn(user, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
            }

            res.status(200).json({ redirectUrl:`${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}` });

        });
    })(req, res, next);
});



// LOGIN CON GOOGLE --------------------------------------------------------------------------

// Ruta protegida
app.get('/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'Ruta protegida' });
});

// Ruta protegida
app.get('/api/not-protected', (req, res) => {
    res.json({ message: 'Ruta NO protegida' });
  });

// Ruta para autenticación con Google
app.get(
  '/api/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

app.get(
    '/api/auth/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect(`${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
);

// Ruta para cerrar sesión
app.get('/api/auth/logout', isAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}`);
  });
});

// USUARIOS -------------------------------------------------------------------------------

// Crear usuario / registrarse
app.post('/users', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    console.log('findBymail')
    const existingUser = await userController.getUserByEmail(email);

    if (existingUser) return res.status(400).json({message: "L'usuari ya existeix."})

    console.log('creating user...')
    const userId = await userController.createUser(email, username, password);

    console.log('creating picture...')
    await pictureController.createDefaultPicture(userId);

    res.status(201).json({ id: userId, message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear usuario', error: error.message });
  }
});

app.post('/testDB', async (req, res) => {
    try {
      // Datos de prueba
      const email = 'hola@example.com';
      const username = 'TestUser';
      const password = 'password123';
        
      console.log('Apunto de crear usuario.')
      // Crear usuario y asignar imagen por defecto
      const userId = await userController.createUser(email, username, password);
      console.log('El usuario se acaba de crear.')

      await pictureController.createDefaultPicture(userId);
  
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
app.get('/users/:id', isAdmin, async (req, res) => {
  try {
    const user = await userController.getUser(req.params.id);
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
app.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    await userController.deleteUser(req.params.id);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

// IMÁGENES -------------------------------------------------------------------------------
// Crear imagen
app.post('/pictures', isAuthenticated, async (req, res) => {
  try {
    const { path, userId } = req.body;
    const pictureId = await pictureController.createPicture(path, userId);
    res.status(201).json({ id: pictureId, message: 'Imagen creada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear imagen', error: error.message });
  }
});

// Establecer imagen activa
app.put('/pictures/:id/setActive', isAuthenticated, async (req, res) => {
  try {
    const { userId } = req.body;
    await pictureController.setActivePicture(req.params.id, userId);
    res.json({ message: 'Imagen establecida como activa exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al establecer imagen activa', error: error.message });
  }
});

// Obtener imagen activa de un usuario
app.get('/users/:userId/activePicture', isAdmin, async (req, res) => {
  try {
    const activePicture = await pictureController.getActivePicture(req.params.userId);
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
