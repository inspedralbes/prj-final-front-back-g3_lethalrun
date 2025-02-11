import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import passport from './googleService.js';
import session from 'express-session';
import bcrypt from 'bcrypt';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js'
// import userController from './controllers/userController.js';

import db from './sql/connectDB.js';
import createPictureController from './controllers/pictureController.js';
import createUserController from './controllers/userController.js';
import createTokenController from './controllers/verifyTokenController.js';
import initializeSocket from './controllers/socketController.js';

const pictureController = createPictureController(db);
const userController = createUserController(db);
const tokenController = createTokenController(db);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const PORT = process.env.PORT;

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);

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
app.use('/images', express.static(path.join(__dirname, 'images')));

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

      res.status(200).json({ redirectUrl: `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}` });

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
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// Ruta para cerrar sesión
app.get('/api/auth/logout', isAuthenticated, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}`);
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
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/verify-register?token=${token}`;

    await sendVerificationEmail(email, link);
    res.status(200).json({ message: `Correo de verificación enviado a ${email}` })
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    res.status(500).send("Hubo un error al enviar el correo de verificación.");
  }
});

app.post('/send-password-reset-email', async (req, res) => {

  const { email } = req.body;
  console.log("1");
  if (!email) {
    return res.status(400).send("El correo electrónico es requerido.");
  }
  console.log("1");
  try {
    // Verificar si el email existe en la base de datos
    const user = await userController.getUserByEmail(email);
    if (!user) {
      return res.status(404).send("No se encontró un usuario con ese correo electrónico.");
    }

    // Crear un token para restablecer la contraseña
    const token = await tokenController.createPasswordResetToken(email);
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/reset-password?token=${token}`;

    

    // Enviar el correo con el enlace para restablecer la contraseña
    await sendPasswordResetEmail(email, link);
    res.status(200).json({ message: `Correo para restablecer contraseña enviado a ${email}` });
  } catch (error) {
    console.error('Error al enviar el correo para restablecer contraseña:', error);
    res.status(500).send("Hubo un error al enviar el correo para restablecer la contraseña.");
  }
});



app.post('/verify-email/:token', async (req, res) => {

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

app.post('/reset-password/:token', async (req, res) => {

  const { newPassword } = req.body;
  const { token } = req.params

  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token y nueva contraseña son requeridos." });
  }

  try {
    
    const tokenData = await tokenController.verifyToken(token);

    if (!tokenData) {
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    // Buscar al usuario por email
    const user = await userController.getUserByEmail(tokenData.email);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Hashear la nueva contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña del usuario
    await userController.changePassword(user, hashedPassword);

    res.status(200).json({ message: "Contraseña actualizada con éxito." });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: "Error al restablecer la contraseña." });
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

// Crear una nueva imagen
app.post('/pictures', isAuthenticated, pictureController.uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }
    const pictureId = await pictureController.createPicture(req.file, req.user.id);
    res.status(201).json({ id: pictureId, message: 'Imagen creada exitosamente' });
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('create-picture', pictures);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear imagen', error: error.message });
  }
});

// Establecer imagen activa
app.put('/pictures/:id/setActive', isAuthenticated, async (req, res) => {
  try {
    await pictureController.setActivePicture(req.params.id, req.user.id);
    res.json({ message: 'Imagen establecida como activa exitosamente' });
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('set-active-picture', pictures);
  } catch (error) {
    res.status(500).json({ message: 'Error al establecer imagen activa', error: error.message });
  }
});

// // Obtener imagen activa de un usuario
// app.get('/users/:userId/activePicture', isAuthenticated, async (req, res) => {
//   try {
//     const activePicture = await pictureController.getActivePicture(req.params.userId);
//     if (activePicture) {
//       res.json(activePicture);
//     } else {
//       res.status(404).json({ message: 'Imagen activa no encontrada' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: 'Error al obtener imagen activa', error: error.message });
//   }
// });

// Eliminar una imagen
app.delete('/pictures/:id', isAuthenticated, async (req, res) => {
  try {
    await pictureController.deletePicture(req.params.id, req.user.id);
    res.json({ message: 'Imagen eliminada exitosamente' });
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('delete-picture', pictures);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar imagen', error: error.message });
  }
});

// Obtener todas las imágenes de un usuario
app.get('/users/:userId/pictures', isAuthenticated, async (req, res) => {
  try {
    const pictures = await pictureController.getUserPictures(req.params.userId);
    res.json(pictures);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener imágenes del usuario', error: error.message });
  }
});

// Actualizar una imagen existente
app.put('/pictures/:id', isAuthenticated, pictureController.uploadMiddleware, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }
    const updatedPictureId = await pictureController.updatePicture(req.params.id, req.file, req.user.id);
    res.json({ id: updatedPictureId, message: 'Imagen actualizada exitosamente' });
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('update-picture', pictures);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar imagen', error: error.message });
  }
});

// INICIAR SERVIDOR -----------------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`Servidor corriendo en ${process.env.DOMAIN_URL}:${PORT}`)
});


//METODOS EXTRA-----------------------------------------------------------------------------


