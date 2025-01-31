import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from 'crypto';
import passport from './googleService.js';
import session from 'express-session';

import { sendEmailWithButton } from './emailService.js'

import db from './sql/connectDB.js';
import createPictureController from './controllers/pictureController.js';
import createUserController from './controllers/userController.js';
import createTokenController from './controllers/verifyTokenController.js';

const tokenController = createTokenController(db);
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

      res.status(200).json({ redirectUrl: `${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}` });

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

//EMAILS ----------------------------------------------------------------------------------

app.post('/send-verification-email', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email) {
    return res.status(400).send("El correo electrónico es requerido.");
  }

  try {
    const token = await tokenController.createToken(email, username, password);
    const link = `${process.env.DOMAIN_URL}:${process.env.DOMAIN_PORT}/auth/verify-register?token=${token}`;

    await sendEmailWithButton(email, link);
    res.status(200).json({ message: `Correo de verificación enviado a ${email}` })
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    res.status(500).send("Hubo un error al enviar el correo de verificación.");
  }
});

app.post('/verify/:token', async (req, res) => {
  const { token } = req.params;
  //console.log(`Intento de verificación para el token: ${token}`);

  try {
    //console.log('Iniciando verificación del token...');
    const verificationData = await tokenController.verifyToken(token);

    if (!verificationData) {
      //console.log('Token inválido o expirado');
      return res.status(400).send("Token inválido o expirado.");
    }

    //console.log('Token verificado exitosamente. Datos:', verificationData);

    //console.log('Iniciando registro de usuario...');

    const existingUser = await userController.getUserByEmail(verificationData.email);

    if (existingUser) {
      //console.log(`Usuario ya existe: ${verificationData.email}`);
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const userId = await userController.createUser(verificationData.email, verificationData.username, verificationData.password);
    //console.log(`Usuario creado con ID: ${userId}`);

    await pictureController.createDefaultPicture(userId);
    //console.log(`Imagen por defecto creada para el usuario: ${userId}`);


    //console.log('Proceso de verificación y registro completado');

    res.status(200).send("Token valido, usuario registrado");
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).send("Error al verificar el token.");
  }
});


// USUARIOS -------------------------------------------------------------------------------

// Crear usuario / registrarse
app.post('/users', isAdmin, async (req, res) => {
  try {
    const { email, username, password } = req.body;
    //console.log(`Intentando registrar usuario: ${username}, email: ${email}`);

    const existingUser = await userController.getUserByEmail(email);

    if (existingUser) {
      //console.log(`Usuario ya existe: ${email}`);
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const userId = await userController.createUser(email, username, password);
    //console.log(`Usuario creado con ID: ${userId}`);

    await pictureController.createDefaultPicture(userId);
    //console.log(`Imagen por defecto creada para el usuario: ${userId}`);

    res.status(201).json({ id: userId, message: 'Usuario creado exitosamente' });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: "Error al registrar el usuario." });
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
server.listen(PORT, () => //console.log(`Servidor corriendo en ${process.env.DOMAIN_URL}:${PORT}`));


//METODOS EXTRA


