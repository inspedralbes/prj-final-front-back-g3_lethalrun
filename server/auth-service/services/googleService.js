import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import createuserController from '../controllers/userController.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Configuración principal de estrategias de autenticación Passport.js
 * @module auth/passportConfig
 * @requires passport
 * @requires passport-google-oauth20
 * @requires passport-local
 * @requires dotenv
 * @requires ../controllers/userController.js
 * @requires crypto
 * @requires bcrypt
 */

/**
 * Controlador de usuarios para operaciones de autenticación
 * @type {Object}
 */
const userController = createuserController();

// Carga variables de entorno
dotenv.config();

/**
 * Estrategia de autenticación con Google OAuth 2.0
 * @name GoogleStrategy
 * @memberof module:auth/passportConfig
 * @function
 * @param {Object} options - Configuración de la estrategia
 * @param {string} options.clientID - Client ID de Google OAuth
 * @param {string} options.clientSecret - Client Secret de Google OAuth
 * @param {string} options.callbackURL - URL de callback para redirección
 * @param {verifyCallback} verifyCallback - Función de verificación
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    /**
     * Callback de verificación para autenticación con Google
     * @async
     * @param {string} accessToken - Token de acceso de Google
     * @param {string} refreshToken - Token de refresco de Google
     * @param {Object} profile - Perfil del usuario de Google
     * @param {Object} profile.emails - Array de emails del usuario
     * @param {function} done - Función de callback de Passport
     * @returns {Promise<void>}
     */
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await userController.getUserByEmail(email);
        
        if (!user) {
          const randomPassword = crypto.randomBytes(16).toString('hex');
          const userId = await userController.createUser(email, profile.displayName, randomPassword);
          user = await userController.getUser(userId);
        }
        
        // Eliminamos datos sensibles antes de serializar
        const { password, ...safeUser } = user;
        return done(null, safeUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * Estrategia de autenticación local con email y contraseña
 * @name LocalStrategy
 * @memberof module:auth/passportConfig
 * @function
 * @param {Object} options - Configuración de campos
 * @param {string} options.usernameField - Campo del formulario para el email
 * @param {string} options.passwordField - Campo del formulario para la contraseña
 * @param {verifyCallback} verifyCallback - Función de verificación
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    /**
     * Callback de verificación para autenticación local
     * @async
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña en texto plano
     * @param {function} done - Función de callback de Passport
     * @returns {Promise<void>}
     */
    async (email, password, done) => {
      try {
        const user = await userController.getUserByEmail(email);
        if (!user) return done(null, false, { message: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: 'Contraseña incorrecta' });

        // Eliminamos la contraseña del objeto usuario
        const { password: _, ...safeUser } = user;
        return done(null, safeUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * Serialización del usuario para la sesión
 * @param {Object} user - Objeto usuario completo
 * @param {function} done - Función de callback
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Deserialización del usuario desde la sesión
 * @param {Object} user - Objeto usuario serializado
 * @param {function} done - Función de callback
 */
passport.deserializeUser((user, done) => {
  done(null, user);
});

/**
 * @typedef {function} verifyCallback
 * @param {?Error} error - Objeto de error (si aplica)
 * @param {?(Object|boolean)} user - Objeto usuario o false
 * @param {?Object} info - Información adicional
 */

export default passport;
