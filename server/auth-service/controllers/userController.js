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
    },

    /**
     * Cambia el nombre de usuario de un usuario existente.
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
};

export default createUserController;
