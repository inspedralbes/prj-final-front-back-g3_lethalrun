<<<<<<< HEAD
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
=======
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.USER_API_URL;

/**
 * Controlador para operaciones de usuario utilizando una API externa.
 * Proporciona métodos para crear, obtener, actualizar y eliminar usuarios
 * a través de peticiones HTTP hacia un servicio RESTful.
 *
 * @returns {Object} Métodos para la manipulación de usuarios.
 */
const createUserController = () => {
  return {

    /**
     * Crea un nuevo usuario en la API externa.
     * 
     * Este método envía una petición HTTP POST al endpoint `/users` de la API
     * con los datos del usuario (email, username y password) en el cuerpo de la petición.
     * Si la operación es exitosa, retorna el ID del usuario recién creado.
     * Si ocurre un error, lanza una excepción con el mensaje de error recibido de la API.
     *
     * @param {string} email - Correo electrónico del usuario.
     * @param {string} username - Nombre de usuario.
     * @param {string} password - Contraseña del usuario.
     * @returns {Promise<string>} El ID del usuario creado.
     * @throws {Error} Si la creación falla, lanza un error con el mensaje recibido de la API.
     */
    async createUser(email, username, password) {
      const res = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password })
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(`Error creando usuario: ${err}`);
      }

      const data = await res.json();
      return data.userId;
    },

    /**
     * Obtiene los datos de un usuario por su ID.
     * 
     * Realiza una petición HTTP GET al endpoint `/users/{id}` para recuperar
     * la información del usuario correspondiente. Si el usuario existe,
     * retorna un objeto con sus datos. Si la petición falla, lanza una excepción.
     *
     * @param {string} id - ID del usuario a consultar.
     * @returns {Promise<Object>} Objeto con los datos del usuario.
     * @throws {Error} Si la obtención falla, lanza un error indicando el ID consultado.
     */
    async getUser(id) {
      const res = await fetch(`${API_URL}/users/${id}`);
      if (!res.ok) throw new Error(`Error obteniendo usuario con id ${id}`);
      return await res.json();
    },

    /**
     * Busca un usuario por su correo electrónico.
     * 
     * Envía una petición HTTP GET al endpoint `/users/by-email/{email}`.
     * Si el usuario existe, retorna su información. Si no existe (HTTP 404),
     * retorna `null`. Si ocurre otro error, lanza una excepción.
     *
     * @param {string} email - Correo electrónico del usuario a buscar.
     * @returns {Promise<Object|null>} Objeto con los datos del usuario o `null` si no existe.
     * @throws {Error} Si ocurre un error distinto a "usuario no encontrado".
     */
    async getUserByEmail(email) {
      const res = await fetch(`${API_URL}/users/by-email/${encodeURIComponent(email)}`);
      
      if (res.status === 404) {
        return null; // Usuario no encontrado, es válido
      }
    
      if (!res.ok) {
        throw new Error(`Error obteniendo usuario con email ${email}`);
      }
    
      return await res.json();
>>>>>>> origin/dev
    },

    /**
     * Cambia el nombre de usuario de un usuario existente.
<<<<<<< HEAD
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

=======
     * 
     * Realiza una petición HTTP PUT al endpoint `/users/{id}/username`
     * con el nuevo nombre de usuario en el cuerpo de la petición.
     * Si la operación es exitosa, retorna `true`. Si falla, lanza una excepción.
     *
     * @param {Object} user - Objeto usuario (debe contener la propiedad `id`).
     * @param {string} newUsername - Nuevo nombre de usuario.
     * @returns {Promise<boolean>} `true` si la operación fue exitosa.
     * @throws {Error} Si la actualización falla.
     */
    async changeUsername(user, newUsername) {
      const res = await fetch(`${API_URL}/users/${user.id}/username`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: newUsername })
      });

      if (!res.ok) throw new Error('Error cambiando nombre de usuario');
      return true;
    },

    /**
     * Cambia la contraseña de un usuario existente.
     * 
     * Envía una petición HTTP PUT al endpoint `/users/{id}/password`
     * con la nueva contraseña (sin encriptar) en el cuerpo de la petición.
     * La API externa se encarga del hash de la contraseña.
     * Si la operación es exitosa, retorna `true`. Si falla, lanza una excepción.
     *
     * @param {Object} user - Objeto usuario (debe contener la propiedad `id`).
     * @param {string} newPassword - Nueva contraseña (en texto plano).
     * @returns {Promise<boolean>} `true` si la operación fue exitosa.
     * @throws {Error} Si la actualización falla.
     */
    async changePassword(user, newPassword) {
      const res = await fetch(`${API_URL}/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }) // sin hash, lo hace la otra API
      });

      if (!res.ok) throw new Error('Error cambiando contraseña');
      return true;
    },

    /**
     * Elimina un usuario por su ID.
     * 
     * Realiza una petición HTTP DELETE al endpoint `/users/{id}` para eliminar
     * al usuario correspondiente. Si la operación es exitosa, retorna `true`.
     * Si falla, lanza una excepción.
     *
     * @param {string} id - ID del usuario a eliminar.
     * @returns {Promise<boolean>} `true` si la operación fue exitosa.
     * @throws {Error} Si la eliminación falla.
     */
    async deleteUser(id) {
      const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Error eliminando usuario');
      return true;
    }
  };
>>>>>>> origin/dev
};

export default createUserController;
