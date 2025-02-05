import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const createPictureController = (db) => {

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Configuración de multer
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
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Primero, insertamos en la base de datos para obtener el ID de la imagen
        const [result] = await connection.execute(
          'INSERT INTO Pictures (user_id, is_active) VALUES (?, TRUE)',
          [userId]
        );
        const pictureId = result.insertId;

        // Ahora generamos el nombre de archivo con el ID de la imagen
        const defaultImageName = 'default.png';
        const newImageName = `${pictureId}_${defaultImageName}`;

        // Rutas de las imágenes
        const defaultImagePath = path.join(__dirname, '..', 'images', 'default', defaultImageName);
        const newImagePath = path.join(__dirname, '..', 'images', 'users', newImageName);

        //crear carpeta de users si no existe
        if (!fs.existsSync(path.join(__dirname, '..', 'images', 'users'))) {
          fs.mkdirSync(path.join(__dirname, '..', 'images', 'users'));
        }

        // Duplicar y renombrar la imagen
        fs.copyFileSync(defaultImagePath, newImagePath);

        // Actualizar el path en la base de datos
        await connection.execute(
          'UPDATE Pictures SET path = ? WHERE id = ?',
          [newImageName, pictureId]
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
    
        // Crear el nuevo nombre de archivo
        const fileExtension = path.extname(file.originalname);
        const newFilename = `${insertId}_${path.basename(file.originalname, fileExtension)}${fileExtension}`;
        
        // Renombrar el archivo
        const oldPath = path.join('./images', file.filename);
        const newPath = path.join('./images', newFilename);
        fs.renameSync(oldPath, newPath);
    
        // Actualizar el nombre del archivo en la base de datos
        await connection.execute(
          'UPDATE Pictures SET path = ? WHERE id = ?',
          [newFilename, insertId]
        );
    
        await connection.commit();
        return insertId;
      } catch (error) {
        await connection.rollback();
        console.error('Error creating picture:', error);
        
        // Eliminar el archivo temporal si existe
        if (fs.existsSync(path.join('./images', file.filename))) {
          fs.unlinkSync(path.join('./images', file.filename));
        }
        
        throw error;
      } finally {
        connection.release();
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

    // Obtener todas las imágenes de un usuario
    async getUserPictures(userId) {
      try {
        const [rows] = await db.execute('SELECT * FROM Pictures WHERE user_id = ?', [userId]);
        return rows;
      } catch (error) {
        console.error('Error getting user pictures:', error);
        throw error;
      }
    },

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

    // Middleware para manejar la carga de archivos
    uploadMiddleware: upload.single('image'),

    // Método de prueba para crear una imagen
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
