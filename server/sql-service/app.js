/**
 * @file Punto de entrada principal del servicio SQL
 * @description Configura servidor Express, conexión a base de datos y rutas para gestión de usuarios e imágenes
 * @module app
 */

import express from 'express';
import dotenv from 'dotenv';
import initializeDatabase from './models/index.js';
import usersRouter from './routes/sql/users.js';
import picturesRouter from './routes/sql/pictures.js';

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
const PORT = process.env.PORT || 3000;

/**
 * @middleware Procesamiento de solicitudes JSON
 */
app.use(express.json());

/**
 * Inicializa y configura el servidor con la base de datos
 * @async
 * @function startServer
 * @description Establece conexión con la base de datos, configura rutas e inicia el servidor
 */
const startServer = async () => {
  try {
    const db = await initializeDatabase();
    await db.sequelize.authenticate();
    
    console.log('\n\n');
    console.log('🗃️✨ [SQL SERVICE] ✨🗃️');
    console.log('✅ Conectado a la base de datos');

    /**
     * @namespace Rutas de usuarios SQL
     * @description Endpoints CRUD para gestión de usuarios
     */
    app.use('/sql/users', usersRouter(db));

    /**
     * @namespace Rutas de imágenes SQL
     * @description Endpoints CRUD para gestión de imágenes
     */
    app.use('/sql/pictures', picturesRouter(db));

    app.listen(PORT, () => {
      console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
      console.log('\n');
    });
    
  } catch (error) {
    console.error('\n❌ Error crítico:', error.message);
    console.log('🔧 Solución: Verificar variables de entorno y conexión a DB');
    process.exit(1);
  }
};

startServer();
