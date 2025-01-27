import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

// Configura el cliente de Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN_URL}:${process.env.PORT}/api/auth/callback`,
    },

    async (accessToken, refreshToken, profile, done) => {

      //Google values
      const user = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos?.[0]?.value || null,
      };

      return done(null, user);
      
    }
  )
);

// Serializa el usuario en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializa el usuario de la sesión
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;