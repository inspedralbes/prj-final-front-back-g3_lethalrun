import express from 'express';
import passport from '../services/googleService.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import createTokenController from '../controllers/verifyTokenController.js';
import createUserController from '../controllers/userController.js';
import bcrypt from 'bcrypt';
import { generateJWT, verifyJWTCliente, verifyJWTAdmin } from '../middleware/verifyJWT.js';

const router = express.Router();

const tokenController = createTokenController();
const userController = createUserController();

// LOGIN CON EMAIL Y CONTRASEÑA
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas', details: info });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });

      const token = generateJWT(user);
      res.status(200).json({ message: 'Login exitoso', token });
    });
  })(req, res, next);
});

// LOGIN CON GOOGLE
router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/auth/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const token = generateJWT(req.user);
  res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?token=${token}`);
});

// CERRAR SESIÓN
router.get('/logout', verifyJWTCliente, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}`);
  });
});

// ENVIAR CORREO DE VERIFICACIÓN
router.post('/send-verification-email', async (req, res) => {
  const { email, username, password, rol = 'cliente' } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo electrónico es requerido.' });
  }

  try {
    const existingUser = await userController.getUserByEmail(email); // Solo hace llamada a API ahora
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe.' });
    }

    const token = await tokenController.createToken(email, username, password, rol); // Llamada API
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/verify-register?token=${token}`;

    await sendVerificationEmail(email, link);
    res.status(200).json({ message: `Correo de verificación enviado a ${email}` });
  } catch (error) {
    console.error('Error al enviar el correo de verificación:', error);
    res.status(500).json({ message: 'Hubo un error al enviar el correo de verificación.' });
  }
});

// ✅ ENVIAR CORREO DE RECUPERACIÓN DE CONTRASEÑA
router.post('/send-password-reset-email', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'El correo electrónico es requerido.' });
  }

  try {
    const user = await userController.getUserByEmail(email); // Solo hace llamada a API ahora
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const token = await tokenController.createToken(user.email, user.username, null, user.rol); // Llamada API
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/reset-password?token=${token}`;

    await sendPasswordResetEmail(user.email, link);
    res.status(200).json({ message: `Correo de restablecimiento enviado a ${email}` });
  } catch (error) {
    console.error('Error al enviar el correo de restablecimiento:', error);
    res.status(500).json({ message: 'Hubo un error al enviar el correo de restablecimiento.' });
  }
});

// VERIFICACIÓN DE EMAIL
router.post('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const verificationData = await tokenController.verifyToken(token); // Llamada API
    if (!verificationData) return res.status(400).send('Token inválido o expirado.');

    const existingUser = await userController.getUserByEmail(verificationData.email); // Solo hace llamada a API ahora
    if (existingUser) return res.status(400).json({ message: 'El usuario ya existe.' });

    await userController.createUser(
      verificationData.email,
      verificationData.username,
      verificationData.password,
      verificationData.rol || 'cliente'
    );

    res.status(200).send('Usuario registrado correctamente');
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(500).send('Error al verificar el token.');
  }
});

// RESTABLECER CONTRASEÑA
router.post('/reset-password/:token', async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token y nueva contraseña son requeridos.' });
  }

  try {
    const tokenData = await tokenController.verifyToken(token); // Llamada API
    if (!tokenData) return res.status(400).json({ message: 'Token inválido o expirado.' });

    const user = await userController.getUserByEmail(tokenData.email); // Solo hace llamada a API ahora
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userController.changePassword(user, hashedPassword); // Solo hace llamada a API ahora

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    console.error('Error al restablecer la contraseña:', error);
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

// RUTAS PROTEGIDAS
router.get('/protected', verifyJWTCliente, (req, res) => {
  res.status(200).json({ message: 'Ruta protegida accesible por cliente o admin', user: req.user });
});

router.get('/admin-only', verifyJWTAdmin, (req, res) => {
  res.status(200).json({ message: 'Acceso concedido solo a administradores', user: req.user });
});

router.get('/cliente-area', verifyJWTCliente, (req, res) => {
  res.status(200).json({ message: 'Área accesible para clientes y administradores', user: req.user });
});

export default router;
