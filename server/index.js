// IMPORTS Y USES -------------------------------------------------------------

// Importación de módulos y dependencias necesarias
import express from 'express'; // Framework para la creación de aplicaciones web
import http from 'http'; // Módulo para crear un servidor HTTP
import cors from 'cors'; // Middleware para permitir el intercambio de recursos entre diferentes dominios
import dotenv from 'dotenv'; // Carga variables de entorno desde un archivo .env
import { fileURLToPath } from 'url'; // Conversión de URL de módulos a rutas de archivos
import path from 'path'; // Manejo de rutas de archivos y directorios
import passport from './googleService.js'; // Servicio de autenticación con Google
import session from 'express-session'; // Manejo de sesiones en Express
import bcrypt from 'bcrypt'; // Biblioteca para el cifrado de contraseñas
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService.js'; // Funciones para enviar correos electrónicos
import db from './sql/connectDB.js'; // Conexión a la base de datos
import createPictureController from './controllers/pictureController.js'; // Controlador de imágenes
import createUserController from './controllers/userController.js'; // Controlador de usuarios
import createTokenController from './controllers/verifyTokenController.js'; // Controlador de tokens de verificación
import initializeSocket from './controllers/socketController.js'; // Configuración de WebSockets

// Creación de instancias de controladores
const pictureController = createPictureController(db);
const userController = createUserController(db);
const tokenController = createTokenController(db);

// Configuración de rutas y directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const PORT = process.env.PORT; // Definición del puerto del servidor

// Configuración del servidor
const app = express(); // Inicialización de la aplicación Express
const server = http.createServer(app); // Creación del servidor HTTP
const io = initializeSocket(server); // Inicialización de WebSockets

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

// Configuración de sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'clave-secreta', // Clave secreta para cifrar sesiones
    resave: false, // Evita guardar sesiones sin modificaciones
    saveUninitialized: false, // No guarda sesiones vacías
    cookie: { maxAge: 86400000, httpOnly: true, sameSite: 'lax' }, // Configuración de la cookie de sesión
  })
);

app.use(express.json()); // Middleware para procesar JSON en las solicitudes
app.use(passport.initialize()); // Inicialización de Passport para autenticación
app.use(passport.session()); // Middleware para manejar sesiones con Passport
app.use('/images', express.static(path.join(__dirname, 'images'))); // Servir archivos estáticos desde la carpeta 'images'

// Middleware para proteger rutas: Verifica si el usuario está autenticado
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'No autorizado' });
}

// Middleware para verificar si el usuario es administrador
function isAdmin() {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user.rol === 'admin') {
      return next(); // Usuario tiene el rol requerido
    }
    res.status(403).json({ message: `Acceso denegado: se requiere rol admin` }); // Acceso denegado
  };
}               

// LOGIN CON EMAIL Y CONTRASEÑA -------------------------------------------------------------

// Ruta para login con email y contraseña
app.post('/api/auth/login', (req, res, next) => {
  // Usamos passport para autenticar con la estrategia 'local' (email y contraseña)
  passport.authenticate('local', (err, user, info) => {
    // Si ocurre un error durante la autenticación, respondemos con un error 500
    if (err) {
      return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
    
    // Si no se encuentra un usuario con las credenciales proporcionadas, respondemos con un error 401
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas', details: info });
    }
    
    // Si la autenticación es exitosa, iniciamos sesión en el servidor
    req.logIn(user, (err) => {
      // Si ocurre un error al iniciar sesión, respondemos con un error 500
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
      }

      // Si todo va bien, redirigimos al usuario a la URL de callback con la información del usuario codificada
      res.status(200).json({ redirectUrl: `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}` });
    });
  })(req, res, next); // Ejecutamos la autenticación
});



// LOGIN CON GOOGLE -------------------------------------------------------------------------

// Ruta protegida (requiere que el usuario esté autenticado)
app.get('/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'Ruta protegida' }); // Mensaje indicando que la ruta está protegida
});

// Ruta no protegida (no requiere autenticación)
app.get('/api/not-protected', (req, res) => {
  res.json({ message: 'Ruta NO protegida' }); // Mensaje indicando que la ruta no está protegida
});

// Ruta para autenticación con Google
// Esta ruta redirige al usuario a la página de login de Google para autenticarlo
app.get(
  '/api/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'], // Solicitamos acceso al perfil y al email del usuario
  })
);

// Ruta de callback de Google
// Google redirige al usuario a esta ruta después de autenticarlo
app.get(
  '/api/auth/callback',
  passport.authenticate('google', { failureRedirect: '/' }), // Si la autenticación falla, se redirige al inicio
  (req, res) => {
    // Si la autenticación con Google es exitosa, redirigimos al usuario a la URL de callback con la información del usuario
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?user=${encodeURIComponent(JSON.stringify(req.user))}`);
  }
);

// Ruta para cerrar sesión (logout)
// Requiere que el usuario esté autenticado para cerrar sesión
app.get('/api/auth/logout', isAuthenticated, (req, res) => {
  // Utilizamos el método logout de passport para cerrar la sesión del usuario
  req.logout((err) => {
    // Si ocurre un error al cerrar sesión, respondemos con un error 500
    if (err) return res.status(500).send('Error al cerrar sesión');
    
    // Si el logout es exitoso, redirigimos al usuario a la página principal
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}`);
  });
});


// EMAILS ----------------------------------------------------------------------------------

// Ruta para enviar un correo de verificación de registro
app.post('/send-verification-email', async (req, res) => {
  const { email, username, password } = req.body;

  // Verificar que se haya proporcionado un correo electrónico
  if (!email) {
    return res.status(400).json({ message: "El correo electrónico es requerido."});
  }

  try {
    // Verificar si el email ya existe en la base de datos
    const existingUser = await userController.getUserByEmail(email);
    if (existingUser) {
      // Si el usuario ya existe, responder con un error
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Si el email no existe, creamos un token de verificación
    const token = await tokenController.createToken(email, username, password);
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/verify-register?token=${token}`;

    // Enviar el correo con el enlace de verificación
    await sendVerificationEmail(email, link);
    // Responder indicando que el correo de verificación fue enviado
    res.status(200).json({ message: `Correo de verificación enviado a ${email}` })
  } catch (error) {
    // Si ocurre un error al intentar enviar el correo
    console.error('Error al enviar el correo de verificación:', error);
    res.status(500).json({ message: "Hubo un error al enviar el correo de verificación."});
  }
});

// Ruta para enviar un correo de restablecimiento de contraseña
app.post('/send-password-reset-email', async (req, res) => {

  const { email } = req.body;
  // Verificar que se haya proporcionado un correo electrónico
  if (!email) {
    return res.status(400).send("El correo electrónico es requerido.");
  }

  try {
    // Verificar si el email existe en la base de datos
    const user = await userController.getUserByEmail(email);
    if (!user) {
      // Si no se encuentra un usuario con ese correo, responder con error
      return res.status(400).json({message: "No se encontró un usuario con ese correo electrónico."});
    }

    // Crear un token para restablecer la contraseña
    const token = await tokenController.createPasswordResetToken(email);
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/reset-password?token=${token}`;

    // Enviar el correo con el enlace para restablecer la contraseña
    await sendPasswordResetEmail(email, link);
    // Responder indicando que el correo de restablecimiento fue enviado
    res.status(200).json({ message: `Correo para restablecer contraseña enviado a ${email}` });
  } catch (error) {
    // Si ocurre un error al intentar enviar el correo
    console.error('Error al enviar el correo para restablecer contraseña:', error);
    res.status(500).json({message: "Hubo un error al enviar el correo para restablecer la contraseña."});
  }
});

// Ruta para verificar el token de verificación de registro
app.post('/verify-email/:token', async (req, res) => {

  const { token } = req.params;

  try {
    // Verificar si el token es válido
    const verificationData = await tokenController.verifyToken(token);

    if (!verificationData) {
      // Si el token es inválido o ha expirado, devolver error
      return res.status(400).send("Token inválido o expirado.");
    }

    // Verificar si el usuario ya existe con el email en el token
    const existingUser = await userController.getUserByEmail(verificationData.email);
    if (existingUser) {
      // Si el usuario ya existe, devolver error
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Crear un nuevo usuario utilizando los datos del token
    const userId = await userController.createUser(verificationData.email, verificationData.username, verificationData.password);
    // Crear una imagen por defecto para el usuario
    await pictureController.createDefaultPicture(userId);

    // Responder indicando que el usuario ha sido registrado exitosamente
    res.status(200).send("Token valido, usuario registrado");
  } catch (error) {
    // Si ocurre un error al verificar el token
    console.error('Error al verificar el token:', error);
    res.status(500).send("Error al verificar el token.");
  }
});

// Ruta para restablecer la contraseña usando un token
app.post('/reset-password/:token', async (req, res) => {

  const { newPassword } = req.body;
  const { token } = req.params

  // Verificar que tanto el token como la nueva contraseña están presentes
  if (!token || !newPassword) {
    return res.status(400).json({ message: "Token y nueva contraseña son requeridos." });
  }

  try {
    // Verificar si el token es válido
    const tokenData = await tokenController.verifyToken(token);

    if (!tokenData) {
      // Si el token es inválido o ha expirado, devolver error
      return res.status(400).json({ message: "Token inválido o expirado." });
    }

    // Buscar al usuario utilizando el email almacenado en el token
    const user = await userController.getUserByEmail(tokenData.email);
    if (!user) {
      // Si no se encuentra el usuario, devolver error
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Hashear la nueva contraseña antes de guardarla
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar la contraseña del usuario
    await userController.changePassword(user, hashedPassword);

    // Responder indicando que la contraseña fue actualizada con éxito
    res.status(200).json({ message: "Contraseña actualizada con éxito." });
  } catch (error) {
    // Si ocurre un error al restablecer la contraseña
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: "Error al restablecer la contraseña." });
  }
});

// USUARIOS -------------------------------------------------------------------------------

// Ruta para crear un nuevo usuario (registro)
// Requiere privilegios de administrador
app.post('/users', isAdmin, async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Verificar si ya existe un usuario con el mismo correo electrónico
    const existingUser = await userController.getUserByEmail(email);
    if (existingUser) {
      // Si el usuario ya existe, se responde con un error 400
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // Crear un nuevo usuario en la base de datos
    const userId = await userController.createUser(email, username, password);

    // Crear una imagen por defecto para el usuario recién creado
    await pictureController.createDefaultPicture(userId);

    // Responder con un mensaje de éxito y el ID del nuevo usuario
    res.status(201).json({ id: userId, message: 'Usuario creado exitosamente' });
  } catch (error) {
    // Si ocurre un error al registrar el usuario, se responde con un error 500
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: "Error al registrar el usuario." });
  }
});

// Ruta para obtener los detalles de un usuario
// Requiere privilegios de administrador
app.get('/users/:id', isAdmin, async (req, res) => {
  try {
    // Obtener el usuario de la base de datos por su ID
    const user = await userController.getUser(req.params.id);

    // Si se encuentra el usuario, se devuelve su información
    if (user) {
      res.json(user);
    } else {
      // Si no se encuentra el usuario, se responde con un error 404
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    // Si ocurre un error al obtener el usuario, se responde con un error 500
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
});

// Ruta para actualizar el nombre de usuario
// Requiere que el usuario esté autenticado
app.put('/users/:id/username', isAuthenticated, async (req, res) => {
  try {
    // Intentar actualizar el nombre de usuario con el nuevo valor
    const updated = await userController.changeUsername(req.user, req.body.username);

    // Si el nombre de usuario se actualiza correctamente, se responde con un mensaje de éxito
    if (updated) {
      res.json({ message: 'Nombre de usuario actualizado exitosamente' });
    } else {
      // Si el usuario no existe o no se puede actualizar, se responde con un error 404
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    // Si ocurre un error al actualizar el nombre de usuario, se responde con un error 500
    res.status(500).json({ message: 'Error al actualizar nombre de usuario', error: error.message });
  }
});

// Ruta para eliminar un usuario
// Requiere privilegios de administrador
app.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    // Intentar eliminar el usuario de la base de datos
    await userController.deleteUser(req.params.id);

    // Si la eliminación es exitosa, se responde con un mensaje de éxito
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    // Si ocurre un error al eliminar el usuario, se responde con un error 500
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

// IMÁGENES -------------------------------------------------------------------------------

// Ruta para crear una nueva imagen
// Requiere que el usuario esté autenticado y que se haya subido una imagen
app.post('/pictures', isAuthenticated, pictureController.uploadMiddleware, async (req, res) => {
  try {
    // Verificar si no se ha subido ninguna imagen
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    // Crear una nueva imagen en la base de datos
    const pictureId = await pictureController.createPicture(req.file, req.user.id);

    // Responder con el ID de la nueva imagen y un mensaje de éxito
    res.status(201).json({ id: pictureId, message: 'Imagen creada exitosamente' });

    // Obtener las imágenes del usuario y emitir un evento para actualizarlas en tiempo real
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('create-picture', pictures);
  } catch (error) {
    // Si ocurre un error al crear la imagen, se responde con un error 500
    res.status(500).json({ message: 'Error al crear imagen', error: error.message });
  }
});

// Ruta para establecer una imagen como activa
// Requiere que el usuario esté autenticado
app.put('/pictures/:id/setActive', isAuthenticated, async (req, res) => {
  try {
    // Establecer la imagen como activa
    await pictureController.setActivePicture(req.params.id, req.user.id);

    // Responder con un mensaje de éxito
    res.json({ message: 'Imagen establecida como activa exitosamente' });

    // Obtener las imágenes del usuario y emitir un evento para actualizarlas en tiempo real
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('set-active-picture', pictures);
  } catch (error) {
    // Si ocurre un error al establecer la imagen activa, se responde con un error 500
    res.status(500).json({ message: 'Error al establecer imagen activa', error: error.message });
  }
});

// Ruta para eliminar una imagen
// Requiere que el usuario esté autenticado
app.delete('/pictures/:id', isAuthenticated, async (req, res) => {
  try {
    // Eliminar la imagen de la base de datos
    await pictureController.deletePicture(req.params.id, req.user.id);

    // Responder con un mensaje de éxito
    res.json({ message: 'Imagen eliminada exitosamente' });

    // Obtener las imágenes del usuario y emitir un evento para actualizarlas en tiempo real
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('delete-picture', pictures);
  } catch (error) {
    // Si ocurre un error al eliminar la imagen, se responde con un error 500
    res.status(500).json({ message: 'Error al eliminar imagen', error: error.message });
  }
});

// Ruta para obtener todas las imágenes de un usuario
// Requiere que el usuario esté autenticado
app.get('/users/:userId/pictures', isAuthenticated, async (req, res) => {
  try {
    // Obtener todas las imágenes del usuario
    const pictures = await pictureController.getUserPictures(req.params.userId);

    // Devolver la lista de imágenes
    res.json(pictures);
  } catch (error) {
    // Si ocurre un error al obtener las imágenes, se responde con un error 500
    res.status(500).json({ message: 'Error al obtener imágenes del usuario', error: error.message });
  }
});

// Ruta para actualizar una imagen existente
// Requiere que el usuario esté autenticado y que se haya subido una nueva imagen
app.put('/pictures/:id', isAuthenticated, pictureController.uploadMiddleware, async (req, res) => {
  try {
    // Verificar si no se ha subido ninguna imagen
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
    }

    // Actualizar la imagen en la base de datos
    const updatedPictureId = await pictureController.updatePicture(req.params.id, req.file, req.user.id);

    // Responder con el ID de la imagen actualizada y un mensaje de éxito
    res.json({ id: updatedPictureId, message: 'Imagen actualizada exitosamente' });

    // Obtener las imágenes del usuario y emitir un evento para actualizarlas en tiempo real
    const pictures = await pictureController.getUserPictures(req.user.id);
    io.emit('update-picture', pictures);
  } catch (error) {
    // Si ocurre un error al actualizar la imagen, se responde con un error 500
    res.status(500).json({ message: 'Error al actualizar imagen', error: error.message });
  }
});

// INICIAR SERVIDOR -----------------------------------------------------------------------
// Iniciar el servidor y escuchar en el puerto especificado
server.listen(PORT, () => {
  console.log(`Servidor corriendo en ${process.env.DOMAIN_URL}:${PORT}`)
});
