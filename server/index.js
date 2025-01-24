import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongopkg from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './sql/connectDB.js';
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

//RUTAS PARA USUARIOS -----------------------------------------------------------------------------------------------------------------------------------
app.post('/users', async (req, res) => {
    try {
        const { email, username, password, rol } = req.body;
        const userId = await userModel.createUser(email, username, password, rol);
        await pictureModel.createDefaultPicture(userId);
        res.status(201).json({ id: userId, message: "Usuario creado exitosamente con imagen por defecto" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear usuario o imagen por defecto", error: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await userModel.getUser(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: "Usuario no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuario", error: error.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const { email, username, xp, playTime, rol } = req.body;
        await userModel.updateUser(req.params.id, email, username, xp, playTime, rol);
        res.json({ message: "Usuario actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar usuario", error: error.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        await userModel.deleteUser(req.params.id);
        res.json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar usuario", error: error.message });
    }
});

app.put('/users/:id/email', async (req, res) => {
    try {
        const { email } = req.body;
        await userModel.updateEmail(req.params.id, email);
        res.json({ message: "Email de usuario actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar email del usuario", error: error.message });
    }
});

app.put('/users/:id/username', async (req, res) => {
    try {
        const { username } = req.body;
        await userModel.updateUsername(req.params.id, username);
        res.json({ message: "Nombre de usuario actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar nombre de usuario", error: error.message });
    }
});

app.put('/users/:id/password', async (req, res) => {
    try {
        const { newPassword } = req.body;
        await userModel.updatePassword(req.params.id, newPassword);
        res.json({ message: "Contraseña de usuario actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar contraseña del usuario", error: error.message });
    }
});

app.put('/users/:id/xp', async (req, res) => {
    try {
        const { xp } = req.body;
        await userModel.updateXp(req.params.id, xp);
        res.json({ message: "XP de usuario actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar XP del usuario", error: error.message });
    }
});

app.put('/users/:id/playtime', async (req, res) => {
    try {
        const { playTime } = req.body;
        await userModel.updatePlayTime(req.params.id, playTime);
        res.json({ message: "Tiempo de juego de usuario actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar tiempo de juego del usuario", error: error.message });
    }
});

app.put('/users/:id/rol', async (req, res) => {
    try {
        const { rol } = req.body;
        await userModel.updateRol(req.params.id, rol);
        res.json({ message: "Rol de usuario actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar rol del usuario", error: error.message });
    }
});

//RUTAS PARA PICTURES -----------------------------------------------------------------------------------------------------------------
app.post('/pictures', async (req, res) => {
    try {
        const { path, userId } = req.body;
        const pictureId = await pictureModel.createPicture(path, userId);
        res.status(201).json({ id: pictureId, message: "Imagen creada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear imagen", error: error.message });
    }
});

app.get('/pictures/:id', async (req, res) => {
    try {
        const picture = await pictureModel.getPicture(req.params.id);
        if (picture) {
            res.json(picture);
        } else {
            res.status(404).json({ message: "Imagen no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener imagen", error: error.message });
    }
});

app.put('/pictures/:id', async (req, res) => {
    try {
        const { path, userId } = req.body;
        await pictureModel.updatePicture(req.params.id, path, userId);
        res.json({ message: "Imagen actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar imagen", error: error.message });
    }
});

app.delete('/pictures/:id', async (req, res) => {
    try {
        await pictureModel.deletePicture(req.params.id);
        res.json({ message: "Imagen eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar imagen", error: error.message });
    }
});

server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
