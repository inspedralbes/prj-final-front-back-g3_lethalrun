import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';
import createuserController from './controllers/userController.js';
import createPictureController from './controllers/pictureController.js';
import db from './sql/connectDB.js';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const userController = createuserController(db);
const pictureController = createPictureController(db);

dotenv.config();

// Configura el cliente de Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },

    async (accessToken, refreshToken, profile, done) => {

      try {
        let user = await userController.getUserByEmail(profile.emails[0].value);
          if (!user) {
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const userId = await userController.createUser(profile.emails[0].value, profile.displayName, randomPassword);

            await pictureController.createDefaultPicture(userId);

            user = await userController.getUser(userId);

          }
          delete user.password;
          return done(null, user);
      } catch (error) {
        return done(error, null);
      }

    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // Campo de email
      passwordField: 'password', // Campo de contraseña
    },
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

        delete user.password;
        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serializa el usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;