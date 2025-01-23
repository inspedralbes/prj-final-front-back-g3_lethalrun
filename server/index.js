import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongopkg from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import db from '../sql/connectDB.js';
import createPictureModel from './controllers/pictureController.js';
import createUserModel from './controllers/userController.js';

const userModel = createUserModel(db);
const pictureModel = createPictureModel(db);

const { mongoClient } = mongopkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Carga las variables de entorno de .env

const PORT = process.env.PORT;

// Configuración del servidor
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(cors()); // Habilita CORS
app.use(express.json()); // Permite recibir y trabajar con JSON

app.get('/', (req, res) => { res.status(200).json({"message":"RUTA GET CORRECTA"}) });  

server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));