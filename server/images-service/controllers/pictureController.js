import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Solución para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FOLDER = path.join(__dirname,'..', 'images', 'users');
const DEFAULT_IMAGE_PATH = path.join(__dirname, '..', 'images', 'default', 'default.png');
const API_SQL_URL = process.env.API_SQL_URL;

export const createPictureController = {

  // Crear una imagen personalizada
  async createPicture(file, userId, token) {
    const userFolder = path.join(USERS_FOLDER, userId);

    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    const ext = path.extname(file.originalname) || '.png';
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const fileName = `${userId}_${randomSuffix}${ext}`;
    const newPath = path.join(userFolder, fileName);

    fs.renameSync(file.path, newPath);

    // Usamos el fileName generado para enviarlo al servicio SQL
    const response = await fetch(`${API_SQL_URL}/create/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Se añade el token Bearer
      },
      body: JSON.stringify({ customName: fileName })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al guardar la imagen en SQL');
    }

    return;
  },

  // Crear una imagen por defecto para un usuario (NO llama a SQL)
  async createDefaultPicture(userId, customName) {
    console.log('--- [createDefaultPicture] ---');
    console.log('Parámetros recibidos:', { userId, customName });

    if (!userId || !customName) {
      console.error('Faltan parámetros: userId y customName son obligatorios.');
      throw new Error('Faltan parámetros: userId y customName son obligatorios.');
    }

    console.log('USERS_FOLDER:', USERS_FOLDER);
    const userFolder = path.join(USERS_FOLDER, userId);
    console.log('Ruta de la carpeta del usuario:', userFolder);

    try {
      // Verificar y crear la carpeta del usuario si no existe
      if (!fs.existsSync(userFolder)) {
        console.log('La carpeta del usuario no existe. Creándola...');
        fs.mkdirSync(userFolder, { recursive: true });
        console.log('Carpeta creada:', userFolder);
      } else {
        console.log('La carpeta del usuario ya existe.');
      }

      // Comprobar si la imagen por defecto existe
      console.log('Ruta de la imagen por defecto:', DEFAULT_IMAGE_PATH);
      if (!fs.existsSync(DEFAULT_IMAGE_PATH)) {
        console.error('La imagen por defecto no existe:', DEFAULT_IMAGE_PATH);
        throw new Error('La imagen por defecto no existe.');
      }

      // Copiar la imagen por defecto al destino
      const newPath = path.join(userFolder, customName);
      console.log(`Copiando imagen por defecto a: ${newPath}`);
      fs.copyFileSync(DEFAULT_IMAGE_PATH, newPath);
      console.log('Imagen copiada correctamente.');

      return { message: 'Imagen por defecto creada correctamente' };
    } catch (err) {
      console.error('Error en createDefaultPicture:', err);
      throw err;
    }
  },

  // Eliminar una imagen (requiere pictureId)
  async deletePicture(id, userId, token, fileName) {
    const userFolder = path.join(USERS_FOLDER, userId);
    const filePath = path.join(userFolder, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Elimina la imagen local

      console.log('url Hard: ', "http://localhost:3003/sql/pictures/delete/7/16");
      console.log('url: ', `${API_SQL_URL}/delete/${id}/${userId}`);
      console.log('token: ', token);

      const response = await fetch(`${API_SQL_URL}/delete/${id}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Error al eliminar la imagen en SQL');
      }

      return { message: 'Imagen eliminada correctamente' };
    } else {
      throw new Error('Imagen no encontrada.');
    }
  },

  // Obtener todas las imágenes de un usuario
  async getUserPictures(userId, token) {

    const response = await fetch(`${API_SQL_URL}/all/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Se añade el token Bearer
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al obtener las imágenes del usuario.');
    }

    const pictures = await response.json();
    return pictures;
  },

  // Obtener la imagen activa de un usuario desde SQL
  async getActivePicture(userId, token) {
    const response = await fetch(`${API_SQL_URL}/active/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Se añade el token Bearer
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al obtener la imagen activa del usuario desde SQL');
    }

    const picture = await response.json();
    return picture;
  },

  // Establecer la imagen activa (hace proxy al SQL)
  async setActivePicture(pictureId, userId, token) {
    const response = await fetch(`${API_SQL_URL}/set-active/${pictureId}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Se añade el token Bearer
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al establecer la imagen activa en SQL');
    }
    return;
  },

  // Eliminar la carpeta completa de un usuario
  async deleteUserFolder(userId) {
    const userFolder = path.join(USERS_FOLDER, userId);

    if (!fs.existsSync(userFolder)) {
      throw new Error(`La carpeta del usuario ${userId} no existe.`);
    }

    try {
      fs.rmSync(userFolder, { recursive: true, force: true });
    } catch (err) {
      console.error(`❌ Error eliminando carpeta del usuario ${userId}:`, err.message);
      throw new Error('Error al eliminar la carpeta del usuario.');
    }
  }
};
