<<<<<<< HEAD
import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import routes from './routes.js';

config(); // Cargar las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta base de la API
app.use('/pictures', routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
=======
/**
 * @fileoverview Punto de entrada principal del servicio de imágenes.
 * @description Configura el servidor Express, middlewares y rutas para la gestión y consulta de imágenes.
 * @module app
 */

import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import cors from 'cors';
import router from './routes/pictureRoutes.js';

config(); // Cargar variables de entorno

/**
 * Instancia de la aplicación Express.
 * @type {express.Application}
 */
const app = express();

/**
 * Puerto en el que se ejecuta el servidor.
 * @type {number|string}
 */
const PORT = process.env.PORT || 3000;

/**
 * @middleware Habilita CORS para cualquier origen.
 */
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

/**
 * @middleware Servir archivos estáticos desde la carpeta 'images'.
 */
app.use('/images', express.static('images'));

/**
 * @middleware Procesa datos en formato JSON y formularios.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * @namespace Rutas para gestión de imágenes.
 * @description Endpoints para operaciones CRUD sobre imágenes.
 */
app.use('/pictures', router);

/**
 * Inicia el servidor de imágenes.
 * @listens PORT
 */
app.listen(PORT, () => {
  console.log('\n\n');
  console.log('🖼️✨ [IMAGES SERVICE] ✨🖼️');
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log('\n');
>>>>>>> origin/dev
});
