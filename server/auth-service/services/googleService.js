import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import createuserController from '../controllers/userController.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

/**
 * Inicializa el controlador de usuarios
 * @type {Object}
 */
const userController = createuserController();

// Carga las variables de entorno desde el archivo .env
dotenv.config();

/**
 * Configura la estrategia de autenticación de Google OAuth
 * Esta estrategia permite a los usuarios iniciar sesión con sus cuentas de Google
 */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    /**
     * Función de verificación para la autenticación de Google
     * @param {string} accessToken - Token de acceso proporcionado por Google
     * @param {string} refreshToken - Token de actualización proporcionado por Google
     * @param {Object} profile - Perfil del usuario de Google
     * @param {Function} done - Función de callback para indicar el resultado de la autenticación
     */
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Busca un usuario existente por email
        let user = await userController.getUserByEmail(profile.emails[0].value);
        if (!user) {
          // Si el usuario no existe, crea uno nuevo
          const randomPassword = crypto.randomBytes(16).toString('hex');
          const userId = await userController.createUser(profile.emails[0].value, profile.displayName, randomPassword);

          // Obtiene el usuario recién creado
          user = await userController.getUser(userId);
        }
        // Elimina la contraseña del objeto usuario por seguridad
        delete user.password;
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * Configura la estrategia de autenticación local
 * Esta estrategia permite a los usuarios iniciar sesión con email y contraseña
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    /**
     * Función de verificación para la autenticación local
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña del usuario
     * @param {Function} done - Función de callback para indicar el resultado de la autenticación
     */
    async (email, password, done) => {
      try {
        // Busca un usuario por email
        const user = await userController.getUserByEmail(email);
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }

        // Compara la contraseña proporcionada con la almacenada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Contraseña incorrecta' });
        }

        // Elimina la contraseña del objeto usuario por seguridad
        delete user.password;
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

/**
 * Serializa el usuario para almacenarlo en la sesión
 * @param {Object} user - Objeto de usuario
 * @param {Function} done - Función de callback
 */
passport.serializeUser((user, done) => {
  done(null, user);
});

/**
 * Deserializa el usuario de la sesión
 * @param {Object} user - Objeto de usuario serializado
 * @param {Function} done - Función de callback
 */
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
