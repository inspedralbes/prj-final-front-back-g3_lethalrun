import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import slotRoutes from './routes/mongoRoutes.js';

dotenv.config(); // Carga las variables desde .env

const app = express();

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Para leer JSON del body

// Rutas
app.use('/skins', slotRoutes);

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
