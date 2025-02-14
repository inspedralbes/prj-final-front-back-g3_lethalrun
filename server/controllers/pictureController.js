import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

/**
 * Crea un controlador para manejar las operaciones relacionadas con las imágenes.
 * @param {Object} db - La instancia de la base de datos.
 * @returns {Object} - El controlador de imágenes con métodos para gestionar imágenes de usuario.
 */
const createPictureController = (db) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Configuración de multer para gestionar la carga de archivos.
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './images/'); // Asegúrate de que esta carpeta exista
    },
    filename: function (req, file, cb) {
      // Usamos un nombre temporal
      cb(null, 'temp-' + Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });

  /**
   * Ejecuta una transacción en la base de datos.
   * @param {Array} queries - Un array de consultas SQL que se ejecutarán en la transacción.
   * @returns {Array} - Los resultados de las consultas ejecutadas.
   * @throws {Error} - Si ocurre un error durante la transacción.
   */
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
    /**
     * Crea una imagen por defecto cuando se crea un nuevo usuario.
     * @param {number} userId - El ID del usuario al que se le asignará la imagen.
     * @returns {number} - El ID de la imagen creada.
     * @throws {Error} - Si ocurre un error al crear la imagen.
     */
    async createDefaultPicture(userId) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Insertar en la base de datos para obtener el ID de la imagen
        const [result] = await connection.execute(
          'INSERT INTO Pictures (user_id, is_active) VALUES (?, TRUE)',
          [userId]
        );
        const pictureId = result.insertId;

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

        // Actualizar el path en la base de datos
        await connection.execute(
          'UPDATE Pictures SET path = ? WHERE id = ?',
          [path.join('users', userId.toString(), newImageName), pictureId]
        );

        await connection.commit();
        return pictureId;
      } catch (error) {
        await connection.rollback();
        console.error('Error creating default picture:', error);
        throw error;
      } finally {
        connection.release();
      }
    },

    /**
     * Crea una nueva imagen asociada a un usuario.
     * @param {Object} file - El archivo de imagen subido.
     * @param {number} userId - El ID del usuario al que se le asociará la imagen.
     * @returns {number} - El ID de la imagen creada.
     * @throws {Error} - Si ocurre un error al crear la imagen.
     */
    async createPicture(file, userId) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Insertar en la base de datos
        const [result] = await connection.execute(
          'INSERT INTO Pictures (user_id, is_active) VALUES (?, FALSE)',
          [userId]
        );
        const insertId = result.insertId;

        // Obtener la extensión del archivo
        const fileExtension = path.extname(file.originalname);
        const newFilename = `${insertId}_${path.basename(file.originalname, fileExtension)}${fileExtension}`;

        // Ruta de la carpeta del usuario
        const userFolderPath = path.join('./images', 'users', userId.toString());

        // Crear carpeta si no existe
        if (!fs.existsSync(userFolderPath)) {
          fs.mkdirSync(userFolderPath, { recursive: true });
        }

        // Rutas de archivos
        const oldPath = path.join('./images', file.filename);
        const newPath = path.join(userFolderPath, newFilename);

        // Mover el archivo a la carpeta del usuario
        fs.renameSync(oldPath, newPath);

        // Actualizar la ruta en la base de datos
        const relativePath = path.join('users', userId.toString(), newFilename);
        await connection.execute(
          'UPDATE Pictures SET path = ? WHERE id = ?',
          [relativePath, insertId]
        );

        await connection.commit();
        return insertId;
      } catch (error) {
        await connection.rollback();
        console.error('Error creating picture:', error);

        // Eliminar el archivo temporal si existe
        const tempFilePath = path.join('./images', file.filename);
        if (fs.existsSync(tempFilePath)) {
          fs.unlinkSync(tempFilePath);
        }

        throw error;
      } finally {
        connection.release();
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

    /**
     * Obtiene la imagen activa de un usuario.
     * @param {number} userId - El ID del usuario.
     * @returns {Object|null} - La imagen activa del usuario, o null si no existe.
     * @throws {Error} - Si ocurre un error al obtener la imagen activa.
     */
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

    /**
     * Elimina una imagen si no está activa.
     * @param {number} id - El ID de la imagen a eliminar.
     * @param {number} userId - El ID del usuario dueño de la imagen.
     * @throws {Error} - Si ocurre un error al eliminar la imagen.
     */
    async deletePicture(id, userId) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Verificar si la imagen está activa
        const [rows] = await connection.execute(
          'SELECT is_active, path FROM Pictures WHERE id = ? AND user_id = ?',
          [id, userId]
        );
        if (rows[0]?.is_active) {
          throw new Error('Cannot delete the active picture');
        }

        // Eliminar el archivo
        if (rows[0]?.path) {
          const filePath = path.join('./images', rows[0].path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }

        // Eliminar la entrada de la base de datos
        await connection.execute('DELETE FROM Pictures WHERE id = ? AND user_id = ?', [id, userId]);

        await connection.commit();
      } catch (error) {
        await connection.rollback();
        console.error('Error deleting picture:', error);
        throw error;
      } finally {
        connection.release();
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
        const [rows] = await db.execute('SELECT * FROM Pictures WHERE user_id = ?', [userId]);
        return rows;
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
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Verificar si la imagen existe y pertenece al usuario
        const [rows] = await connection.execute(
          'SELECT path FROM Pictures WHERE id = ? AND user_id = ?',
          [id, userId]
        );

        if (rows.length === 0) {
          throw new Error('Picture not found or does not belong to the user');
        }

        const oldPath = path.join('./images', rows[0].path);

        // Crear el nuevo nombre de archivo
        const fileExtension = path.extname(newFile.originalname);
        const newFilename = `${id}_${path.basename(newFile.originalname, fileExtension)}${fileExtension}`;
        const newPath = path.join('./images', newFilename);

        // Eliminar el archivo antiguo si existe
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }

        // Mover y renombrar el nuevo archivo
        fs.renameSync(newFile.path, newPath);

        // Actualizar el path en la base de datos
        await connection.execute(
          'UPDATE Pictures SET path = ? WHERE id = ?',
          [newFilename, id]
        );

        await connection.commit();
        return id;
      } catch (error) {
        await connection.rollback();
        console.error('Error updating picture:', error);
        throw error;
      } finally {
        connection.release();
      }
    },

    /**
     * Middleware para manejar la carga de archivos de imagen.
     * @param {Object} req - La solicitud HTTP.
     * @param {Object} res - La respuesta HTTP.
     * @param {function} next - La función de siguiente middleware.
     */
    uploadMiddleware: upload.single('image'),

    /**
     * Método de prueba para crear una imagen.
     * @param {Object} file - El archivo de imagen subido.
     * @param {number} userId - El ID del usuario.
     * @param {string} email - El correo electrónico del usuario.
     * @returns {Object} - Un objeto con información sobre la imagen creada.
     * @throws {Error} - Si ocurre un error al crear la imagen.
     */
    async testCreatePicture(file, userId, email) {
      try {
        const pictureId = await this.createPicture(file, userId);
        return {
          id: pictureId,
          message: 'Imagen de prueba creada exitosamente',
          fileName: `${pictureId}_${file.originalname}`,
          fileSize: file.size,
          userId: userId,
          email: email
        };
      } catch (error) {
        console.error('Error en test de creación de imagen:', error);
        throw error;
      }
    }
  };
};

export default createPictureController;
