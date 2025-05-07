import crypto from 'crypto';  // Para generar un número aleatorio
import fetch from 'node-fetch'; // Asegúrate de tener instalada esta librería para hacer solicitudes HTTP

const pictureController = ({ Picture, sequelize }) => {
  return {
    // Método para crear una imagen por defecto para un usuario
    async createDefaultPicture(userId, customName = null, transaction = null) {
      try {
        // Llamada a la API para crear la imagen por defecto
        const response = await fetch(`${process.env.API_URL}/create-default-picture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, customName }) // Enviamos customName si se proporciona
        });

        if (!response.ok) {
          throw new Error(`Error al crear la imagen por defecto: ${response.statusText}`);
        }

        const data = await response.json();
        const pictureId = data.pictureId;

        // Generar un nombre único para el path de la imagen si no se proporciona customName
        const picturePath = customName || `${userId}_${crypto.randomBytes(16).toString('hex')}`;

        // Crear el registro en la base de datos con el path generado
        const picture = await Picture.create(
          { 
            user_id: userId, 
            is_active: true, 
            picture_id: pictureId,
            path: picturePath  // Guardamos el path generado
          },
          { transaction }
        );

        return picture.id;
      } catch (error) {
        throw new Error(`Error en el proceso de creación de la imagen por defecto: ${error.message}`);
      }
    },

    // Método para crear una imagen asociada a un usuario
    async createPicture(userId, customName = null) {
      try {
        const picture = await Picture.create({ 
          user_id: userId, 
          is_active: false, 
          path: customName || `${userId}_${crypto.randomBytes(16).toString('hex')}` // Si no se pasa customName, generamos uno
        });
        return picture.id;
      } catch (error) {
        throw new Error(`Error creando la imagen: ${error.message}`);
      }
    },

    // Método para establecer una imagen activa para un usuario
    async setActivePicture(pictureId, userId) {
      const t = await sequelize.transaction();
      try {
        // Desactivar todas las imágenes activas del usuario
        await Picture.update({ is_active: false }, {
          where: { user_id: userId },
          transaction: t
        });

        // Activar la imagen seleccionada
        await Picture.update({ is_active: true }, {
          where: { id: pictureId, user_id: userId },
          transaction: t
        });

        await t.commit();
      } catch (error) {
        await t.rollback();
        throw new Error(`Error al establecer imagen activa: ${error.message}`);
      }
    },

    // Método para obtener la imagen activa de un usuario
    async getActivePicture(userId) {
      try {
        return await Picture.findOne({
          where: { user_id: userId, is_active: true }
        });
      } catch (error) {
        throw new Error(`Error obteniendo la imagen activa: ${error.message}`);
      }
    },

    // Método para eliminar una imagen de un usuario
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

    // Método para obtener todas las imágenes de un usuario
    async getUserPictures(userId) {
      try {
        return await Picture.findAll({ where: { user_id: userId } });
      } catch (error) {
        throw new Error(`Error obteniendo las imágenes del usuario: ${error.message}`);
      }
    },

    // Método para actualizar el path de una imagen existente
    async updatePicturePath(id, userId, newPath) {
      try {
        const picture = await Picture.findOne({ where: { id, user_id: userId } });
        if (!picture) throw new Error('Imagen no encontrada o no autorizado');

        await picture.update({ path: newPath });
        return picture.id;
      } catch (error) {
        throw new Error(`Error actualizando la ruta de la imagen: ${error.message}`);
      }
    }
  };
};

export default pictureController;
