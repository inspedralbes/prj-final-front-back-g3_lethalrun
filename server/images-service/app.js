import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import router from './routes/pictureRoutes.js';

config(); // Cargar las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta base de la API
app.use('/pictures', router);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
