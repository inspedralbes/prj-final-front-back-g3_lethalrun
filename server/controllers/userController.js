import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const createUserController = (db) => {
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return{

  async createUser(email, username, password) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      let rol = 'cliente'

      const listAdmins = [
        'a20davsalsos@inspedralbes.cat',
        'a23izadelesp@inspedralbes.cat',
        'a23brioropoy@inspedralbes.cat',
        'a23marrojgon@inspedralbes.cat'
      ]

      if(listAdmins.includes(email)) rol = 'admin'

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

  async getUser(id) {
    try {
      const [rows] = await db.execute('SELECT * FROM Users WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async getUserByEmail(email) {
    try {
      const [rows] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  },

  async changeUsername(user, newUsername) {
    try {
      await db.execute('UPDATE Users SET username = ? WHERE id = ?', [newUsername, user.id]);
      return true;
    } catch (error) {
      console.error('Error changing username:', error);
      throw error;
    }
  },

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

}

};

export default createUserController;
