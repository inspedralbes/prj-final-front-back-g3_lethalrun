/**
 * @file Punto de entrada principal del servicio de autenticación
 * @description Configura servidor Express, middlewares y rutas para autenticación y validación de tokens
 * @module app
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from './services/googleService.js';
import authRoutes from './routes/authRoutes.js';
import validateAuthRoutes from './routes/verifyRoutes.js'; 

dotenv.config();

/**
 * Instancia de la aplicación Express
 * @type {express.Application}
 */
const app = express();

/**
 * Puerto del servidor (configurable por entorno)
 * @type {number|string}
 */
const PORT = process.env.PORT || 4000;

/**
 * @middleware Configuración CORS para comunicaciones entre servicios
 * @param {Object} options - Opciones de configuración
 * @param {Function} options.origin - Permite cualquier origen
 * @param {Array<string>} options.methods - Métodos HTTP permitidos
 * @param {Array<string>} options.allowedHeaders - Cabeceras permitidas
 * @param {boolean} options.credentials - Habilita credenciales cross-origin
 */
app.use(cors({
  origin: (origin, callback) => callback(null, origin),
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

/**
 * @middleware Gestión de sesiones seguras
 * @param {Object} options - Configuración de sesión
 * @param {string} options.secret - Secreto para firmar cookies
 * @param {boolean} options.resave - Evita re-guardar sesiones no modificadas
 * @param {boolean} options.saveUninitialized - Evita guardar sesiones vacías
 * @param {Object} options.cookie - Configuración de cookies seguras
 */
app.use(session({
  secret: process.env.SESSION_SECRET || 'clave-secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000, httpOnly: true, sameSite: 'lax' },
}));

/**
 * @middleware Procesamiento de datos en formato JSON
 */
app.use(express.json());

/**
 * @middleware Inicialización de Passport.js para autenticación
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * @namespace Rutas de autenticación OAuth
 * @description Maneja el flujo de autenticación con Google
 */
app.use('/auth', authRoutes);

/**
 * @namespace Rutas de validación de tokens
 * @description Proporciona endpoints para verificar tokens JWT a otros servicios
 */
app.use('/validate', validateAuthRoutes);

/**
 * Inicia el servidor de autenticación
 * @listens PORT
 */
app.listen(PORT, () => {
  console.log('\n\n');
  console.log('🔒✨ [AUTH SERVICE] ✨🔒');
  console.log(`🚀 Servidor activo en ${process.env.DOMAIN_URL}:${PORT}`);
  console.log('✅ Autenticación Google habilitada');
  console.log('\n');
});
