import express from 'express';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import cors from 'cors'; // 👈 Importar CORS
import router from './routes/pictureRoutes.js';

config(); // Cargar las variables de entorno desde .env

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS para cualquier origen
app.use(cors({
  origin: '*', // Permitir cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
}));
app.use('/images', express.static('images'));

// Middleware para procesar JSON y formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta base de la API
app.use('/pictures', router);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
