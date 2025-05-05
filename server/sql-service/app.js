import express from 'express';
import dotenv from 'dotenv';
import initializeDatabase from './models/index.js'; // Importa la función para inicializar la DB
import usersRouter from './routes/sql/users.js';  // Importar las rutas de usuarios
import picturesRouter from './routes/sql/pictures.js'; // Importar las rutas de imágenes

dotenv.config(); // Cargar .env

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Inicializar la base de datos y obtener los modelos
const startServer = async () => {
  try {
    const db = await initializeDatabase(); // Crear DB si no existe y conectar
    await db.sequelize.authenticate();
    console.log('✅ Conectado a la base de datos');

    // Pasar los modelos a las rutas
    app.use('/sql/users', usersRouter(db)); // Pasar db (modelos) a las rutas
    app.use('/sql/pictures', picturesRouter(db)); // Pasar db (modelos) a las rutas

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
