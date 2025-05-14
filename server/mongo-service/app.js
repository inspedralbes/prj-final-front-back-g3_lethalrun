/**
 * @file Punto de entrada principal del servicio de gestión de skins
 * @description Configura servidor Express, middlewares y rutas para operaciones CRUD de skins
 * @module app
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import slotRoutes from './routes/mongoRoutes.js';

dotenv.config();

/**
 * Instancia de la aplicación Express
 * @type {express.Application}
 */
const app = express();

/**
 * @middleware Configuración CORS para acceso cross-origin
 * @param {Object} options - Opciones de configuración
 * @param {string} options.origin - Orígenes permitidos ('*' para cualquiera)
 * @param {Array<string>} options.methods - Métodos HTTP permitidos
 * @param {Array<string>} options.allowedHeaders - Cabeceras permitidas
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * @middleware Procesamiento de datos en formato JSON
 */
app.use(express.json());

/**
 * @namespace Rutas para gestión de skins
 * @description Endpoints CRUD para operaciones con skins
 */
app.use('/skins', slotRoutes);

/**
 * Puerto del servidor (configurable por entorno)
 * @type {number|string}
 */
const PORT = process.env.PORT || 3000;

/**
 * Inicia el servidor de gestión de skins
 * @listens PORT
 */
app.listen(PORT, () => {
  console.log('\n\n');
  console.log('🧩✨ [MONGO SERVICE] ✨🧩');
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});
