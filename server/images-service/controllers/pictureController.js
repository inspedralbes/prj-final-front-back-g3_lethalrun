
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Solución para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_FOLDER = path.join(__dirname, '..', 'images', 'users');
const DEFAULT_IMAGE_PATH = path.join(__dirname, '..', 'images', 'default', 'default.png');
const API_SQL_URL = process.env.API_SQL_URL;

/**
 * Controlador para la gestión de imágenes de usuario.
 * Permite crear, copiar, eliminar y consultar imágenes de usuario,
 * así como interactuar con un servicio externo para almacenar metadatos.
 */
export const createPictureController = {
  /**
   * Crea una imagen personalizada para el usuario.
   * Mueve el archivo subido a la carpeta del usuario y notifica al servicio SQL.
   *
   * @param {Object} file - Archivo subido (debe tener path y originalname).
   * @param {string} userId - ID del usuario.
   * @param {string} token - Token de autenticación Bearer.
   * @returns {Promise<void>}
   * @throws {Error} Si falla la operación local o la petición al servicio SQL.
   */
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

    const response = await fetch(`${API_SQL_URL}/create/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ customName: fileName })
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al guardar la imagen en SQL');
    }
  },
  /**
   * Copia la imagen por defecto a la carpeta del usuario con un nombre personalizado.
   * No realiza ninguna llamada al servicio SQL.
   *
   * @param {string} userId - ID del usuario.
   * @param {string} customName - Nombre de archivo destino.
   * @returns {Promise<{message: string}>} Mensaje de éxito.
   * @throws {Error} Si faltan parámetros, la imagen por defecto no existe,
   *                 o ocurre un error al copiar.
   */
  async createDefaultPicture(userId, customName) {
    if (!userId || !customName) {
      throw new Error('Faltan parámetros: userId y customName son obligatorios.');
    }

    const userFolder = path.join(USERS_FOLDER, userId);

    // Verificar y crear la carpeta del usuario si no existe
    if (!fs.existsSync(userFolder)) {
      fs.mkdirSync(userFolder, { recursive: true });
    }

    // Comprobar si la imagen por defecto existe
    if (!fs.existsSync(DEFAULT_IMAGE_PATH)) {
      throw new Error('La imagen por defecto no existe.');
    }

    // Copiar la imagen por defecto al destino
    const newPath = path.join(userFolder, customName);
    fs.copyFileSync(DEFAULT_IMAGE_PATH, newPath);

    return { message: 'Imagen por defecto creada correctamente' };
  },

  /**
   * Elimina una imagen específica del usuario, tanto localmente como en el servicio SQL.
   *
   * @param {string} id - ID de la imagen en el servicio SQL.
   * @param {string} userId - ID del usuario.
   * @param {string} token - Token de autenticación Bearer.
   * @param {string} fileName - Nombre del archivo a eliminar.
   * @returns {Promise<{message: string}>} Mensaje de éxito.
   * @throws {Error} Si la imagen no existe o la eliminación falla.
   */
  async deletePicture(id, userId, token, fileName) {
    const userFolder = path.join(USERS_FOLDER, userId);
    const filePath = path.join(userFolder, fileName);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);

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

  /**
   * Obtiene todas las imágenes asociadas a un usuario desde el servicio SQL.
   *
   * @param {string} userId - ID del usuario.
   * @param {string} token - Token de autenticación Bearer.
   * @returns {Promise<Array>} Lista de imágenes del usuario.
   * @throws {Error} Si ocurre un error al consultar las imágenes.
   */
  async getUserPictures(userId, token) {
    const response = await fetch(`${API_SQL_URL}/all/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al obtener las imágenes del usuario.');
    }

    const pictures = await response.json();
    return pictures;
  },

  /**
   * Obtiene la imagen activa de un usuario desde el servicio SQL.
   *
   * @param {string} userId - ID del usuario.
   * @param {string} token - Token de autenticación Bearer.
   * @returns {Promise<Object>} Imagen activa del usuario.
   * @throws {Error} Si ocurre un error al consultar la imagen activa.
   */
  async getActivePicture(userId, token) {
    const response = await fetch(`${API_SQL_URL}/active/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al obtener la imagen activa del usuario desde SQL');
    }

    const picture = await response.json();
    return picture;
  },

  /**
   * Establece una imagen como activa para el usuario en el servicio SQL.
   *
   * @param {string} pictureId - ID de la imagen a activar.
   * @param {string} userId - ID del usuario.
   * @param {string} token - Token de autenticación Bearer.
   * @returns {Promise<void>}
   * @throws {Error} Si ocurre un error al actualizar la imagen activa.
   */
  async setActivePicture(pictureId, userId, token) {
    const response = await fetch(`${API_SQL_URL}/set-active/${pictureId}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.error || 'Error al establecer la imagen activa en SQL');
    }
  },

  /**
   * Elimina la carpeta completa de imágenes de un usuario localmente.
   *
   * @param {string} userId - ID del usuario.
   * @returns {Promise<void>}
   * @throws {Error} Si la carpeta no existe o ocurre un error al eliminarla.
   */
  async deleteUserFolder(userId) {
    const userFolder = path.join(USERS_FOLDER, userId);

    if (!fs.existsSync(userFolder)) {
      throw new Error(`La carpeta del usuario ${userId} no existe.`);
    }

    try {
      fs.rmSync(userFolder, { recursive: true, force: true });
    } catch (err) {
      throw new Error('Error al eliminar la carpeta del usuario.');
    }
  }
};
