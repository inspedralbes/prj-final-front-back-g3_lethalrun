import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Controlador para gestionar las operaciones relacionadas con el usuario.
 * @param {Object} db - Objeto de conexión a la base de datos.
 * @returns {Object} - El controlador con los métodos para gestionar usuarios.
 */
const createUserController = (db) => {
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return {

    /**
     * Crea un nuevo usuario.
     * @param {string} email - El correo electrónico del usuario.
     * @param {string} username - El nombre de usuario.
     * @param {string} password - La contraseña del usuario.
     * @returns {Promise<number>} - El ID del usuario recién creado.
     * @throws {Error} - Lanza un error si no se puede crear el usuario.
     */
    async createUser(email, username, password) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        let rol = 'cliente';

        const listAdmins = [
          'a20davsalsos@inspedralbes.cat',
          'a23izadelesp@inspedralbes.cat',
          'a23brioropoy@inspedralbes.cat',
          'a23marrojgon@inspedralbes.cat'
        ];

        // Si el email está en la lista de administradores, asigna el rol 'admin'
        if(listAdmins.includes(email)) rol = 'admin';

        // Hashear la contraseña antes de guardarla en la base de datos
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el número de saltos

        // Crear el usuario con la contraseña hasheada
        const query =
          'INSERT INTO Users (email, username, password, xp, play_time, rol) VALUES (?, ?, ?, 0, 0, ?)';
        const [result] = await connection.execute(query, [email, username, hashedPassword, rol]);
        const userId = result.insertId;
        await connection.commit();
        return userId;

      } catch (error) {
        await connection.rollback();
        console.error('Error creating user:', error);
        throw error;
      } finally {
        connection.release();
      }
    },

    /**
     * Obtiene un usuario por su ID.
     * @param {number} id - El ID del usuario a obtener.
     * @returns {Promise<Object|null>} - El objeto del usuario o null si no se encuentra.
     * @throws {Error} - Lanza un error si no se puede obtener el usuario.
     */
    async getUser(id) {
      try {
        const [rows] = await db.execute('SELECT * FROM Users WHERE id = ?', [id]);
        return rows[0] || null;
      } catch (error) {
        console.error('Error getting user:', error);
        throw error;
      }
    },

    /**
     * Obtiene un usuario por su correo electrónico.
     * @param {string} email - El correo electrónico del usuario a obtener.
     * @returns {Promise<Object|null>} - El objeto del usuario o null si no se encuentra.
     * @throws {Error} - Lanza un error si no se puede obtener el usuario.
     */
    async getUserByEmail(email) {
      try {
        const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        return rows[0] || null;
      } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
      }
    },

    /**
     * Cambia el nombre de usuario de un usuario existente.
     * @param {Object} user - El objeto del usuario cuyo nombre se va a cambiar.
     * @param {string} newUsername - El nuevo nombre de usuario.
     * @returns {Promise<boolean>} - Devuelve true si el cambio fue exitoso.
     * @throws {Error} - Lanza un error si no se puede cambiar el nombre.
     */
    async changeUsername(user, newUsername) {
      try {
        await db.execute('UPDATE Users SET username = ? WHERE id = ?', [newUsername, user.id]);
        return true;
      } catch (error) {
        console.error('Error changing username:', error);
        throw error;
      }
    },

    /**
     * Elimina un usuario de la base de datos y su carpeta asociada.
     * @param {number} id - El ID del usuario a eliminar.
     * @returns {Promise<void>} - No devuelve valor.
     * @throws {Error} - Lanza un error si no se puede eliminar el usuario.
     */
    async deleteUser(id) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();
    
        // Eliminar al usuario de la base de datos
        await connection.execute('DELETE FROM Users WHERE id = ?', [id]);
    
        // Ruta de la carpeta del usuario
        const userFolderPath = path.join(__dirname, '..', 'images', 'users', id.toString());
    
        // Verificar si la carpeta existe y eliminarla
        try {
          await fs.rm(userFolderPath, { recursive: true, force: true });
          console.log(`Carpeta eliminada: ${userFolderPath}`);
        } catch (err) {
          console.warn(`No se pudo eliminar la carpeta ${userFolderPath} o no existe.`);
        }
    
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        console.error('Error deleting user:', error);
        throw error;
      } finally {
        connection.release();
      }
    },

    /**
     * Cambia la contraseña de un usuario.
     * @param {Object} user - El objeto del usuario cuyo password se va a cambiar.
     * @param {string} hashedPassword - La nueva contraseña hasheada.
     * @returns {Promise<boolean>} - Devuelve true si la contraseña fue actualizada exitosamente.
     * @throws {Error} - Lanza un error si no se puede actualizar la contraseña.
     */
    async changePassword(user, hashedPassword) {
      const connection = await db.getConnection();
      try {
        await connection.beginTransaction();

        // Actualizar la contraseña en la base de datos
        const query = 'UPDATE Users SET password = ? WHERE id = ?';
        await connection.execute(query, [hashedPassword, user.id]);

        await connection.commit();
        return true;
      } catch (error) {
        await connection.rollback();
        console.error('Error changing password:', error);
        throw error;
      } finally {
        connection.release();
      }
    }

  };

};

export default createUserController;
