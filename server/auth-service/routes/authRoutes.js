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

/**
 * @typedef {Object} AuthResponse
 * @property {string} message - Mensaje descriptivo de la operación
 * @property {string} [token] - Token JWT (cuando aplica)
 * @property {Object} [user] - Datos del usuario (cuando aplica)
 */

/**
 * Router para manejar autenticación de usuarios
 * 
 * Incluye:
 * - Login local y con Google
 * - Verificación de email
 * - Restablecimiento de contraseña
 * - Rutas protegidas
 */
 
/**
 * @route POST /login
 * @group Autenticación - Operaciones de login
 * @param {string} email.body.required - Correo del usuario
 * @param {string} password.body.required - Contraseña
 * @returns {AuthResponse} 200 - Login exitoso
 * @returns {Object} 401 - Credenciales inválidas
 * @returns {Object} 500 - Error del servidor
 */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ message: 'Error en el servidor', error: err.message });
    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas', details: info });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });

      const token = generateJWT(user);
      res.status(200).json({ message: 'Login exitoso', token, user });
    });
  })(req, res, next);
});

/**
 * @route GET /google
 * @group Autenticación - Login con Google
 * @description Inicia el flujo de autenticación con Google OAuth2
 */
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

/**
 * @route GET /callback
 * @group Autenticación - Login con Google
 * @description Callback de Google OAuth2. Redirige a la web con token JWT
 * @param {string} code.query - Código de autorización de Google
 */
router.get('/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const user = req.user;
  const userJson = JSON.stringify(user);
  const token = generateJWT(user);
  res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/callback?token=${token}&user=${userJson}`);
});

/**
 * @route GET /logout
 * @group Autenticación - Gestión de sesión
 * @security JWT
 * @description Cierra la sesión actual y redirige a la página principal
 */
router.get('/logout', verifyJWTCliente, (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect(`${process.env.DOMAIN_URL}:${process.env.WEB_PORT}`);
  });
});

/**
 * @route POST /send-verification-email
 * @group Verificación - Registro de usuario
 * @param {string} email.body.required - Correo a verificar
 * @param {string} username.body.required - Nombre de usuario
 * @param {string} password.body.required - Contraseña
 * @returns {Object} 200 - Correo enviado exitosamente
 * @returns {Object} 400 - Datos faltantes
 * @returns {Object} 409 - Usuario ya existe
 */
router.post('/send-verification-email', async (req, res) => {
  const { email, username, password } = req.body;
  const adminEmails = ['admin1@example.com', 'admin2@example.com'];
  let rol = adminEmails.includes(email) ? 'admin' : 'cliente';

  if (!email) return res.status(400).json({ message: 'El correo electrónico es requerido.' });

  try {
    const existingUser = await userController.getUserByEmail(email);
    if (existingUser) return res.status(409).json({ message: 'El usuario ya existe.' });

    const token = await tokenController.createToken(email, username, password, rol);
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/verify-register?token=${token}`;
    await sendVerificationEmail(email, link);

    res.status(200).json({ message: `Correo de verificación enviado a ${email}` });
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al enviar el correo de verificación.' });
  }
});

/**
 * @route POST /send-password-reset-email
 * @group Verificación - Recuperación de contraseña
 * @param {string} email.body.required - Correo asociado a la cuenta
 * @returns {Object} 200 - Correo enviado exitosamente
 * @returns {Object} 400 - Datos faltantes
 * @returns {Object} 404 - Usuario no encontrado
 */
router.post('/send-password-reset-email', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'El correo electrónico es requerido.' });

  try {
    const user = await userController.getUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const token = await tokenController.createToken(user.email, user.username, null, user.rol);
    const link = `${process.env.DOMAIN_URL}:${process.env.WEB_PORT}/auth/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, link);

    res.status(200).json({ message: `Correo de restablecimiento enviado a ${email}` });
  } catch (error) {
    res.status(500).json({ message: 'Hubo un error al enviar el correo de restablecimiento.' });
  }
});

/**
 * @route POST /verify-email/:token
 * @group Verificación - Registro de usuario
 * @param {string} token.path.required - Token de verificación
 * @returns {Object} 200 - Usuario registrado exitosamente
 * @returns {Object} 400 - Token inválido o datos incompletos
 * @returns {Object} 500 - Error del servidor
 */
router.post('/verify-email/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const verificationData = await tokenController.verifyToken(token);
    if (!verificationData) return res.status(400).json({ error: 'Token inválido o expirado.' });

    const { email, username, password, rol } = verificationData;
    if (!email || !username || !password) return res.status(400).json({ error: 'Datos incompletos en el token.' });

    const existingUser = await userController.getUserByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'El usuario ya existe.' });

    await userController.createUser(email, username, password, rol || 'cliente');
    res.status(200).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message || error });
  }
});

/**
 * @route POST /reset-password/:token
 * @group Verificación - Recuperación de contraseña
 * @param {string} token.path.required - Token de restablecimiento
 * @param {string} newPassword.body.required - Nueva contraseña
 * @returns {Object} 200 - Contraseña actualizada
 * @returns {Object} 400 - Datos faltantes o token inválido
 * @returns {Object} 404 - Usuario no encontrado
 */
router.post('/reset-password/:token', async (req, res) => {
  const { newPassword } = req.body;
  const { token } = req.params;

  if (!token || !newPassword) return res.status(400).json({ message: 'Token y nueva contraseña son requeridos.' });

  try {
    const tokenData = await tokenController.verifyToken(token);
    if (!tokenData) return res.status(400).json({ message: 'Token inválido o expirado.' });

    const user = await userController.getUserByEmail(tokenData.email);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userController.changePassword(user, hashedPassword);

    res.status(200).json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al restablecer la contraseña.' });
  }
});

export default router;
