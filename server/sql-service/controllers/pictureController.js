// pictureController.js (formato ES Module)

// Cargar las variables de entorno desde .env
import 'dotenv/config';

// Crear una constante para la URL de la API
const API_URL = process.env.API_URL;

/**
 * Controlador Sequelize para el modelo Picture (solo lógica de base de datos).
 * @param {Object} models - Los modelos Sequelize, incluyendo Picture y sequelize.
 */
const pictureController = ({ Picture, sequelize }) => {
  return {
    async createDefaultPicture(userId, transaction = null) {
      try {
        // Llamada a la API para crear imagen por defecto
        const response = await fetch(`${API_URL}/create-default-picture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
          throw new Error(`Error al crear la imagen por defecto: ${response.statusText}`);
        }

        const data = await response.json();
        const pictureId = data.pictureId;

        // Crear registro en base de datos
        const picture = await Picture.create(
          { user_id: userId, is_active: true, picture_id: pictureId },
          { transaction }
        );

        return picture.id;

      } catch (error) {
        throw new Error(`Error en el proceso de creación de la imagen por defecto: ${error.message}`);
      }
    },

    async createPicture(userId) {
      const picture = await Picture.create({ user_id: userId, is_active: false });
      return picture.id;
    },

    async setActivePicture(pictureId, userId) {
      const t = await sequelize.transaction();
      try {
        await Picture.update({ is_active: false }, {
          where: { user_id: userId },
          transaction: t
        });

        await Picture.update({ is_active: true }, {
          where: { id: pictureId, user_id: userId },
          transaction: t
        });

        await t.commit();
      } catch (error) {
        await t.rollback();
        throw error;
      }
    },

    async getActivePicture(userId) {
      return await Picture.findOne({
        where: { user_id: userId, is_active: true }
      });
    },

    async deletePicture(id, userId) {
      const picture = await Picture.findOne({ where: { id, user_id: userId } });

      if (!picture) throw new Error('Picture not found');
      if (picture.is_active) throw new Error('Cannot delete an active picture');

      await picture.destroy();
    },

    async getUserPictures(userId) {
      return await Picture.findAll({ where: { user_id: userId } });
    },

    async updatePicturePath(id, userId, newPath) {
      const picture = await Picture.findOne({ where: { id, user_id: userId } });
      if (!picture) throw new Error('Picture not found or unauthorized');

      await picture.update({ path: newPath });
      return picture.id;
    }
  };
};

export default pictureController;
