import express from 'express';
import passport from '../googleService.js'; // Suponiendo que tu archivo de googleService está en un directorio superior
import { sendVerificationEmail, sendPasswordResetEmail } from '../auth-service/services/emailService.js';
import createTokenController from '../auth-service/controllers/verifyTokenController.js';
import createUserController from '../controllers/userController.js';
import bcrypt from 'bcrypt';
import { generateJWT } from '../middleware/verifyJWT.js'; // Importamos la función para generar el token
import verifyJWT from '../middleware/verifyJWT.js'; // Importamos el middleware de verificación de token

const router = express.Router();

// Crear instancias de controladores
const tokenController = createTokenController();
const userController = createUserController();

// LOGIN CON EMAIL Y CONTRASEÑA -------------------------------------------------------------
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas', details: info });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });

      // Generamos el JWT y lo enviamos al cliente
      const token = generateJWT(user);
      res.status(200).json({
        message: 'Login exitoso',
        token, // El token se envía al cliente
      });
    });
  })(req, res, next);
});

// LOGIN CON GOOGLE -------------------------------------------------------------------------
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Generamos el JWT y lo enviamos al cliente después del login con Google
  const token = generateJWT(req.user);
  res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?token=${token}`);
});

// CERRAR SESIÓN (Logout) --------------------------------------------------------------
router.get('/logout', verifyJWT, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}`);
  });
});

// ENVIAR CORREO DE VERIFICACIÓN ---------------------------------------------------------
router.post('/send-verification-email', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo electrónico es requerido.' });
  }

  try {
    const existingUser = await userController.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    const token = await tokenController.createToken(email, username, password);
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/verify-register?token=${token}`;

    await sendVerificationEmail(email, link);
    res.status(200).json({ message: `Correo de verificación enviado a ${email}` });
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    res.status(500).json({ message: 'Hubo un error al enviar el correo de verificación.' });
  }
});

// RUTAS PROTEGIDAS REQUIRIENDO EL JWT ---------------------------------------------------
router.get('/protected', verifyJWT, (req, res) => {
  // Esta ruta ahora está protegida por el JWT
  res.status(200).json({ message: 'Acceso concedido a la ruta protegida', user: req.user });
});

// VERIFICACIÓN DE TOKEN DE REGISTRO ------------------------------------------------------
router.post('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const verificationData = await tokenController.verifyToken(token);
    if (!verificationData) {
      return res.status(400).send('Token inválido o expirado.');
    }

    const existingUser = await userController.getUserByEmail(verificationData.email);
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    const userId = await userController.createUser(verificationData.email, verificationData.username, verificationData.password);
    res.status(200).send('Usuario registrado correctamente');
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).send('Error al verificar el token.');
  }
});

// RESTABLECER CONTRASEÑA CON TOKEN -------------------------------------------------------
router.post('/reset-password/:token', async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos.' });
  }

  try {
    const tokenData = await tokenController.verifyToken(token);
    if (!tokenData) {
      return res.status(400).json({ message: 'Token inválido o expirado.' });
    }

    const user = await userController.getUserByEmail(tokenData.email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    await userController.changePassword(user, hashedPassword);

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

export default router;
