const createPictureModel = (db) => {
  const executeTransaction = async (queries) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const results = await Promise.all(queries.map(q => connection.execute(...q)));
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  return {
    // Crear una imagen por defecto al crear un usuario
    async createDefaultPicture(userId) {
      try {
        const [result] = await db.execute(
          'INSERT INTO Pictures (path, user_id, is_active) VALUES (?, ?, TRUE)',
          ['default.png', userId]
        );
        return result.insertId;
      } catch (error) {
        console.error('Error creating default picture:', error);
        throw error;
      }
    },

    // Crear una nueva imagen (inactiva por defecto)
    async createPicture(path, userId) {
      try {
        const [result] = await db.execute(
          'INSERT INTO Pictures (path, user_id, is_active) VALUES (?, ?, FALSE)',
          [path, userId]
        );
        return result.insertId;
      } catch (error) {
        console.error('Error creating picture:', error);
        throw error;
      }
    },

    // Obtener una imagen específica por su ID
    async getPicture(id) {
      try {
        const [rows] = await db.execute('SELECT * FROM Pictures WHERE id = ?', [id]);
        return rows[0] || null;
      } catch (error) {
        console.error('Error getting picture:', error);
        throw error;
      }
    },

    // Establecer una imagen activa para un usuario
    async setActivePicture(pictureId, userId) {
      try {
        const queries = [
          ['UPDATE Pictures SET is_active = FALSE WHERE user_id = ?', [userId]],
          ['UPDATE Pictures SET is_active = TRUE WHERE id = ? AND user_id = ?', [pictureId, userId]]
        ];
        await executeTransaction(queries);
      } catch (error) {
        console.error('Error setting active picture:', error);
        throw error;
      }
    },

    // Obtener la imagen activa de un usuario
    async getActivePicture(userId) {
      try {
        const [rows] = await db.execute(
          'SELECT * FROM Pictures WHERE user_id = ? AND is_active = TRUE',
          [userId]
        );
        return rows[0] || null;
      } catch (error) {
        console.error('Error getting active picture:', error);
        throw error;
      }
    },

    // Eliminar una imagen (solo si no está activa)
    async deletePicture(id, userId) {
      try {
        // Verificar si la imagen está activa
        const [rows] = await db.execute(
          'SELECT is_active FROM Pictures WHERE id = ? AND user_id = ?',
          [id, userId]
        );
        if (rows[0]?.is_active) {
          throw new Error('Cannot delete the active picture');
        }

        // Eliminar la imagen
        await db.execute('DELETE FROM Pictures WHERE id = ? AND user_id = ?', [id, userId]);
      } catch (error) {
        console.error('Error deleting picture:', error);
        throw error;
      }
    },

    // Obtener todas las imágenes de un usuario
    async getUserPictures(userId) {
      try {
        const [rows] = await db.execute('SELECT * FROM Pictures WHERE user_id = ?', [userId]);
        return rows;
      } catch (error) {
        console.error('Error getting user pictures:', error);
        throw error;
      }
    }
  };
};

export default createPictureModel;
