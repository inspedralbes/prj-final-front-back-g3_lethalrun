<<<<<<< HEAD
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

config(); // Cargar variables de entorno desde .env

const API_URL = process.env.API_URL; // URL de la API

export const createPictureController = {

  /**
   * Crea una imagen por defecto cuando se crea un nuevo usuario.
   * @param {number} userId - El ID del usuario al que se le asignará la imagen.
   * @returns {number} - El ID de la imagen creada.
   * @throws {Error} - Si ocurre un error al crear la imagen.
   */
  async createDefaultPicture(userId) {
    try {
      const data = await response.json();
      const pictureId = data.pictureId;

      // Nombre del archivo
      const defaultImageName = 'default.png';
      const newImageName = `${pictureId}_${defaultImageName}`;

      // Rutas de las imágenes
      const defaultImagePath = path.join(__dirname, '..', 'images', 'default', defaultImageName);
      const userFolderPath = path.join(__dirname, '..', 'images', 'users', userId.toString());
      const newImagePath = path.join(userFolderPath, newImageName);

      // Crear carpeta del usuario si no existe
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
      }

      // Copiar y renombrar la imagen
      fs.copyFileSync(defaultImagePath, newImagePath);

      return pictureId;
    } catch (error) {
      console.error('Error creating default picture:', error);
      throw error;
=======
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
>>>>>>> origin/dev
    }
  },

  /**
<<<<<<< HEAD
   * Crea una nueva imagen asociada a un usuario.
   * @param {Object} file - El archivo de imagen subido.
   * @param {number} userId - El ID del usuario al que se le asociará la imagen.
   * @returns {number} - El ID de la imagen creada.
   * @throws {Error} - Si ocurre un error al crear la imagen.
   */
  async createPicture(file, userId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);

      const response = await fetch(`${API_URL}/pictures/create`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error en la creación de la imagen: ${response.statusText}`);
      }

      const data = await response.json();
      const pictureId = data.pictureId;

      const fileExtension = path.extname(file.originalname);
      const newFilename = `${pictureId}_${path.basename(file.originalname, fileExtension)}${fileExtension}`;

      const userFolderPath = path.join('./images', 'users', userId.toString());

      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
      }

      const oldPath = path.join('./images', file.filename);
      const newPath = path.join(userFolderPath, newFilename);

      fs.renameSync(oldPath, newPath);

      return pictureId;
    } catch (error) {
      console.error('Error creating picture:', error);
      throw error;
    }
  },

  /**
   * Establece una imagen activa para un usuario.
   * @param {number} pictureId - El ID de la imagen que se quiere establecer como activa.
   * @param {number} userId - El ID del usuario.
   * @throws {Error} - Si ocurre un error al establecer la imagen activa.
   */
  async setActivePicture(pictureId, userId) {
    try {
      const response = await fetch(`${API_URL}/pictures/set-active/${pictureId}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error estableciendo la imagen activa: ${response.statusText}`);
      }

      return { message: 'Imagen activa establecida correctamente' };
    } catch (error) {
      console.error('Error setting active picture:', error);
      throw error;
    }
  },

  /**
   * Obtiene la imagen activa de un usuario.
   * @param {number} userId - El ID del usuario.
   * @returns {Object|null} - La imagen activa del usuario, o null si no existe.
   * @throws {Error} - Si ocurre un error al obtener la imagen activa.
   */
  async getActivePicture(userId) {
    try {
      const response = await fetch(`${API_URL}/pictures/active/${userId}`);

      if (!response.ok) {
        throw new Error(`Error obteniendo la imagen activa: ${response.statusText}`);
      }

      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error('Error getting active picture:', error);
      throw error;
    }
  },

  /**
   * Elimina una imagen si no está activa.
   * @param {number} id - El ID de la imagen a eliminar.
   * @param {number} userId - El ID del usuario dueño de la imagen.
   * @throws {Error} - Si ocurre un error al eliminar la imagen.
   */
  async deletePicture(id, userId) {
    try {
      // Hacer la solicitud a la API para eliminar la imagen
      const response = await fetch(`${API_URL}/pictures/delete/${id}/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error eliminando la imagen: ${response.statusText}`);
      }

      // Eliminar el archivo físico si es necesario
      const picture = await this.getUserPicture(id);
      if (picture && picture.path) {
        const filePath = path.join('./images', picture.path);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

    } catch (error) {
      console.error('Error deleting picture:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las imágenes de un usuario.
   * @param {number} userId - El ID del usuario.
   * @returns {Array} - Un array de imágenes asociadas al usuario.
   * @throws {Error} - Si ocurre un error al obtener las imágenes.
   */
  async getUserPictures(userId) {
    try {
      const response = await fetch(`${API_URL}/pictures/all/${userId}`);

      if (!response.ok) {
        throw new Error(`Error obteniendo las imágenes del usuario: ${response.statusText}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error getting user pictures:', error);
      throw error;
    }
  },

  /**
   * Actualiza una imagen existente para un usuario.
   * @param {number} id - El ID de la imagen que se desea actualizar.
   * @param {Object} newFile - El nuevo archivo de imagen.
   * @param {number} userId - El ID del usuario propietario de la imagen.
   * @returns {number} - El ID de la imagen actualizada.
   * @throws {Error} - Si ocurre un error al actualizar la imagen.
   */
  async updatePicture(id, newFile, userId) {
    try {
      const formData = new FormData();
      formData.append('file', newFile);
      formData.append('userId', userId);

      const response = await fetch(`${API_URL}/pictures/update/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error actualizando la imagen: ${response.statusText}`);
      }

      const data = await response.json();
      return data.pictureId;
    } catch (error) {
      console.error('Error updating picture:', error);
      throw error;
    }
  },
=======
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
>>>>>>> origin/dev
};
