import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './services/googleService.js';
import authRoutes from './routes/authRoutes.js';
import validateAuthRoutes from './routes/verifyRoutes.js'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: (origin, callback) => callback(null, origin),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'clave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000, httpOnly: true, sameSite: 'lax' },
}));

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de validación de tokens para otros servicios
app.use('/validate', validateAuthRoutes); // ⬅️ aquí se añade

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Auth Service escuchando en ${process.env.DOMAIN_URL}:${PORT}`);
});
