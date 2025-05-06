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
import { sendVerificationEmail, sendPasswordResetEmail } from './auth-service/services/emailService.js'; // Funciones para enviar correos electrónicos
import db from './sql-service/connectDB.js'; // Conexión a la base de datos
import createPictureController from './controllers/pictureController.js'; // Controlador de imágenes
import createUserController from './controllers/userController.js'; // Controlador de usuarios
import createTokenController from './auth-service/controllers/verifyTokenController.js'; // Controlador de tokens de verificación
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

// INICIAR SERVIDOR -----------------------------------------------------------------------
// Iniciar el servidor y escuchar en el puerto especificado
server.listen(PORT, () => {
  console.log(`Servidor corriendo en ${process.env.DOMAIN_URL}:${PORT}`)
});
