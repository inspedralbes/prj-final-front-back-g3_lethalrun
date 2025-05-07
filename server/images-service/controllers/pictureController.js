import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

config(); // Cargar variables de entorno desde .env

const API_URL = process.env.API_URL; // URL de la API

export const createPictureController = {

  /**
   * Crea una imagen por defecto cuando se crea un nuevo usuario.
   * Ahora se puede proporcionar un nombre para la imagen.
   * @param {number} userId - El ID del usuario al que se le asignará la imagen.
   * @param {string} customName - El nombre personalizado para la imagen.
   * @returns {number} - El ID de la imagen creada.
   * @throws {Error} - Si ocurre un error al crear la imagen.
   */
  async createDefaultPicture(userId, customName) {
    try {
      // Nombre del archivo de la imagen por defecto
      const defaultImageName = 'default.png';
      const newImageName = customName ? `${userId}_${customName}.png` : `${userId}_${defaultImageName}`;

      // Rutas de las imágenes
      const defaultImagePath = path.join(__dirname, '..', 'images', 'default', defaultImageName);
      const userFolderPath = path.join(__dirname, '..', 'images', 'users', userId.toString());
      const newImagePath = path.join(userFolderPath, newImageName);

      // Crear carpeta del usuario si no existe
      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
      }

      // Copiar y renombrar la imagen por defecto
      fs.copyFileSync(defaultImagePath, newImagePath);

      return userId; // Retornamos el ID de usuario como referencia de la creación
    } catch (error) {
      console.error('Error creando la imagen por defecto:', error);
      throw error;
    }
  },

  /**
   * Crea una nueva imagen asociada a un usuario.
   * Ahora se puede proporcionar un nombre para la imagen.
   * @param {Object} file - El archivo de imagen subido.
   * @param {number} userId - El ID del usuario al que se le asociará la imagen.
   * @param {string} customName - El nombre personalizado para la imagen.
   * @returns {number} - El ID de la imagen creada.
   * @throws {Error} - Si ocurre un error al crear la imagen.
   */
  async createPicture(file, userId, customName) {
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

      // Si se proporcionó un nombre personalizado, lo usamos; de lo contrario, generamos uno por defecto
      const fileExtension = path.extname(file.originalname);
      const newFilename = customName ? `${pictureId}_${customName}${fileExtension}` : `${pictureId}_${path.basename(file.originalname, fileExtension)}${fileExtension}`;

      const userFolderPath = path.join('./images', 'users', userId.toString());

      if (!fs.existsSync(userFolderPath)) {
        fs.mkdirSync(userFolderPath, { recursive: true });
      }

      const oldPath = path.join('./images', file.filename);
      const newPath = path.join(userFolderPath, newFilename);

      fs.renameSync(oldPath, newPath);

      return pictureId;
    } catch (error) {
      console.error('Error creando la imagen:', error);
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
      console.error('Error estableciendo la imagen activa:', error);
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
      console.error('Error obteniendo la imagen activa:', error);
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
      console.error('Error eliminando la imagen:', error);
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
      console.error('Error obteniendo las imágenes del usuario:', error);
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
      console.error('Error actualizando la imagen:', error);
      throw error;
    }
  },
};
