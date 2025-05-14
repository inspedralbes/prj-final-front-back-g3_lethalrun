import fetch from 'node-fetch';
import crypto from 'crypto';

/**
 * @typedef {Object} PictureController
 * @property {Function} createDefaultPicture - Crea imagen por defecto física y en DB
 * @property {Function} createPicture - Crea registro de imagen personalizada en DB
 * @property {Function} setActivePicture - Establece imagen activa para un usuario
 * @property {Function} getActivePicture - Obtiene la imagen activa del usuario
 * @property {Function} deletePicture - Elimina imagen no activa
 * @property {Function} getUserPictures - Obtiene todas las imágenes del usuario
 */

/**
 * Factory function para crear el controlador de imágenes
 * @param {Object} Picture - Modelo Sequelize de imágenes
 * @returns {PictureController} Objeto con métodos del controlador
 */
const pictureController = ({ Picture }) => {
  return {
    /**
     * Crea imagen por defecto física y registro en base de datos
     * @async
     * @param {string} userId - ID del usuario
     * @returns {Promise<string>} Nombre del archivo generado
     * @throws {Error} Si falla la creación física o el registro en DB
     */
    async createDefaultPicture(userId) {
      try {
        const randomString = crypto.randomBytes(8).toString('hex');
        const generatedName = `${userId}_${randomString}.png`;

        // Llamada al microservicio de imágenes
        const response = await fetch(
          `${process.env.IMAGES_API_URL}/create-default-picture/${encodeURIComponent(userId)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customName: generatedName })
          }
        );

        if (!response.ok) {
          let errorMsg = response.statusText;
          try {
            const data = await response.json();
            errorMsg = data.error || errorMsg;
          } catch {}
          throw new Error(`Error al crear la imagen por defecto: ${errorMsg}`);
        }

        // Guardar en base de datos
        const picture = await Picture.create({
          user_id: userId,
          is_active: true,
          path: generatedName
        });

        return picture.path;
      } catch (error) {
        throw new Error(`Error en la creación de la imagen por defecto: ${error.message}`);
      }
    },

    /**
     * Crea registro de imagen personalizada en base de datos
     * @async
     * @param {string} userId - ID del usuario
     * @param {string} customName - Nombre personalizado del archivo
     * @returns {Promise<number>} ID de la imagen creada
     * @throws {Error} Si falla la operación en DB
     */
    async createPicture(userId, customName) {
      try {
        const picture = await Picture.create({
          user_id: userId,
          is_active: false,
          path: customName
        });

        return picture.id;
      } catch (error) {
        throw new Error(`Error creando la imagen: ${error.message}`);
      }
    },

    /**
     * Establece una imagen como activa para el usuario
     * @async
     * @param {number} pictureId - ID de la imagen a activar
     * @param {string} userId - ID del usuario
     * @throws {Error} Si fallan las actualizaciones en DB
     */
    async setActivePicture(pictureId, userId) {
      try {
        await Picture.update({ is_active: false }, {
          where: { user_id: userId }
        });

        await Picture.update({ is_active: true }, {
          where: { id: pictureId, user_id: userId }
        });
      } catch (error) {
        throw new Error(`Error al establecer imagen activa: ${error.message}`);
      }
    },

    /**
     * Obtiene la imagen activa del usuario
     * @async
     * @param {string} userId - ID del usuario
     * @returns {Promise<Object|null>} Objeto con datos de la imagen activa
     * @throws {Error} Si falla la consulta en DB
     */
    async getActivePicture(userId) {
      try {
        return await Picture.findOne({
          where: { user_id: userId, is_active: true }
        });
      } catch (error) {
        throw new Error(`Error obteniendo la imagen activa: ${error.message}`);
      }
    },

    /**
     * Elimina una imagen (solo si no está activa)
     * @async
     * @param {number} id - ID de la imagen a eliminar
     * @param {string} userId - ID del usuario
     * @throws {Error} Si la imagen está activa, no existe o falla la operación
     */
    async deletePicture(id, userId) {
      try {
        const picture = await Picture.findOne({ where: { id, user_id: userId } });

        if (!picture) throw new Error('Imagen no encontrada');
        if (picture.is_active) throw new Error('No se puede eliminar una imagen activa');

        await picture.destroy();
      } catch (error) {
        throw new Error(`Error eliminando la imagen: ${error.message}`);
      }
    },

    /**
     * Obtiene todas las imágenes del usuario
     * @async
     * @param {string} userId - ID del usuario
     * @returns {Promise<Array>} Lista de imágenes del usuario
     * @throws {Error} Si falla la consulta en DB
     */
    async getUserPictures(userId) {
      try {
        return await Picture.findAll({ where: { user_id: userId } });
      } catch (error) {
        throw new Error(`Error obteniendo las imágenes del usuario: ${error.message}`);
      }
    }
  };
};

export default pictureController;
