import fetch from 'node-fetch';
import crypto from 'crypto';

const pictureController = ({ Picture }) => {
  return {
    // Crea la imagen física por defecto y guarda el registro en la base de datos
    async createDefaultPicture(userId) {
      try {
        const randomString = crypto.randomBytes(8).toString('hex');
        const generatedName = `${userId}_${randomString}.png`;

        // Llamada al microservicio de imágenes para crear el archivo físico (fuera de transacción)
        const response = await fetch(
          `${process.env.IMAGES_API_URL}/create-default-picture/${encodeURIComponent(userId)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ customName: generatedName })
          }
        );

        if (!response.ok) {
          // Intentamos obtener un mensaje de error detallado
          let errorMsg = response.statusText;
          try {
            const data = await response.json();
            errorMsg = data.error || errorMsg;
          } catch {}
          throw new Error(`Error al crear la imagen por defecto: ${errorMsg}`);
        }

        // Guardar en la base de datos el path generado
        const picture = await Picture.create({
          user_id: userId,
          is_active: true,
          path: generatedName
        });

        return picture.path; // Devolvemos el nombre de archivo
      } catch (error) {
        throw new Error(`Error en la creación de la imagen por defecto: ${error.message}`);
      }
    },

    // Crea un registro de imagen personalizada en la base de datos
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

    // Establece una imagen como activa para un usuario
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

    // Obtiene la imagen activa de un usuario
    async getActivePicture(userId) {
      try {
        return await Picture.findOne({
          where: { user_id: userId, is_active: true }
        });
      } catch (error) {
        throw new Error(`Error obteniendo la imagen activa: ${error.message}`);
      }
    },

    // Elimina una imagen (solo si no es la activa)
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

    // Obtiene todas las imágenes de un usuario
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
