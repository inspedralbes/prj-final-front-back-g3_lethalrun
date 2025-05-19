import bcrypt from 'bcrypt';
<<<<<<< HEAD
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pictureController from './pictureController.js';

/**
 * Controlador para gestionar usuarios usando Sequelize.
 * @param {Object} models - Objeto con los modelos Sequelize (debe incluir User y Picture).
 */
const createUserController = (models) => {
  const { User, Picture, sequelize } = models;
  const pictureService = pictureController({ Picture, sequelize });

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  return {

=======
import pictureController from './pictureController.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

/**
 * @typedef {Object} UserController
 * @property {Function} createUser - Crea usuario con rol, slots e imagen por defecto
 * @property {Function} getUser - Obtiene usuario por ID
 * @property {Function} getUserByEmail - Busca usuario por email
 * @property {Function} changeUsername - Actualiza nombre de usuario
 * @property {Function} changePassword - Cambia contraseña de usuario
 * @property {Function} deleteUser - Elimina usuario y datos relacionados
 */

/**
 * Factory function para crear el controlador de usuarios
 * @param {Object} models - Modelos de Sequelize (User, Picture)
 * @returns {UserController} Objeto con métodos del controlador
 */
const createUserController = (models) => {
  const { User, Picture, sequelize } = models;
  const pictureService = pictureController({ Picture });

  return {
    /**
     * Crea un nuevo usuario con transacción atómica y sincronización con servicios externos
     * @async
     * @param {string} email - Email único del usuario
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña en texto plano
     * @returns {Promise<string>} ID del usuario creado
     * @throws {Error} Si falla creación en DB, slots o imagen por defecto
     */
>>>>>>> origin/dev
    async createUser(email, username, password) {
      const listAdmins = [
        'a20davsalsos@inspedralbes.cat',
        'a23izadelesp@inspedralbes.cat',
        'a23brioropoy@inspedralbes.cat',
        'a23marrojgon@inspedralbes.cat'
      ];

      const rol = listAdmins.includes(email) ? 'admin' : 'cliente';
      const hashedPassword = await bcrypt.hash(password, 10);

<<<<<<< HEAD
      const t = await sequelize.transaction();
      try {
        const newUser = await User.create({
=======
      let newUser;
      let defaultPicturePath;

      const t = await sequelize.transaction();
      try {
        newUser = await User.create({
>>>>>>> origin/dev
          email,
          username,
          password: hashedPassword,
          rol,
        }, { transaction: t });
<<<<<<< HEAD

        await pictureService.createDefaultPicture(newUser.id, t); // Asociar imagen

        await t.commit();
        return newUser.id;
      } catch (error) {
        await t.rollback();
        console.error('Error creating user:', error);
        throw error;
      }
    },

=======
        await t.commit();
      } catch (error) {
        await t.rollback();
        throw new Error(`Error creando usuario: ${error.message}`);
      }

      try {
        const slotResponse = await fetch(`${process.env.SLOTS_API_URL}/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (!slotResponse.ok) {
          throw new Error(`Error al crear slots: ${slotResponse.statusText}`);
        }
      } catch (error) {
        await User.destroy({ where: { id: newUser.id } });
        throw error;
      }

      try {
        defaultPicturePath = await pictureService.createDefaultPicture(newUser.id);
      } catch (error) {
        await User.destroy({ where: { id: newUser.id } });
        throw error;
      }

      return newUser.id;
    },

    /**
     * Obtiene un usuario por su ID
     * @async
     * @param {string} id - ID del usuario
     * @returns {Promise<Object|null>} Objeto usuario o null si no existe
     * @throws {Error} Si falla la consulta a la base de datos
     */
>>>>>>> origin/dev
    async getUser(id) {
      try {
        const user = await User.findByPk(id);
        return user ? user.toJSON() : null;
      } catch (error) {
<<<<<<< HEAD
        console.error('Error getting user:', error);
        throw error;
      }
    },

=======
        throw new Error(`Error obteniendo usuario: ${error.message}`);
      }
    },

    /**
     * Busca un usuario por su email
     * @async
     * @param {string} email - Email del usuario
     * @returns {Promise<Object|null>} Objeto usuario o null si no existe
     * @throws {Error} Si falla la consulta a la base de datos
     */
>>>>>>> origin/dev
    async getUserByEmail(email) {
      try {
        const user = await User.findOne({ where: { email } });
        return user ? user.toJSON() : null;
      } catch (error) {
<<<<<<< HEAD
        console.error('Error getting user by email:', error);
        throw error;
      }
    },

=======
        throw new Error(`Error buscando usuario por email: ${error.message}`);
      }
    },

    /**
     * Actualiza el nombre de usuario
     * @async
     * @param {Object} user - Instancia del modelo User
     * @param {string} newUsername - Nuevo nombre de usuario
     * @returns {Promise<boolean>} true si la actualización fue exitosa
     * @throws {Error} Si falla la operación de guardado
     */
>>>>>>> origin/dev
    async changeUsername(user, newUsername) {
      try {
        user.username = newUsername;
        await user.save();
        return true;
      } catch (error) {
<<<<<<< HEAD
        console.error('Error changing username:', error);
        throw error;
      }
    },

    async deleteUser(id) {
      const t = await sequelize.transaction();
      try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        await user.destroy({ transaction: t });

        const userFolderPath = path.join(__dirname, '..', 'images', 'users', id.toString());
        try {
          await fs.rm(userFolderPath, { recursive: true, force: true });
          console.log(`Carpeta eliminada: ${userFolderPath}`);
        } catch (err) {
          console.warn(`No se pudo eliminar la carpeta ${userFolderPath} o no existe.`);
        }

        await t.commit();
      } catch (error) {
        await t.rollback();
        console.error('Error deleting user:', error);
        throw error;
      }
    },

=======
        throw new Error(`Error actualizando nombre de usuario: ${error.message}`);
      }
    },

    /**
     * Cambia la contraseña del usuario con transacción atómica
     * @async
     * @param {Object} user - Instancia del modelo User
     * @param {string} hashedPassword - Nueva contraseña hasheada
     * @returns {Promise<boolean>} true si la actualización fue exitosa
     * @throws {Error} Si falla la operación de guardado
     */
>>>>>>> origin/dev
    async changePassword(user, hashedPassword) {
      const t = await sequelize.transaction();
      try {
        user.password = hashedPassword;
        await user.save({ transaction: t });
        await t.commit();
        return true;
      } catch (error) {
        await t.rollback();
<<<<<<< HEAD
        console.error('Error changing password:', error);
        throw error;
      }
    }

=======
        throw new Error(`Error cambiando contraseña: ${error.message}`);
      }
    },

    /**
     * Elimina un usuario y todos sus datos relacionados (transacción atómica)
     * @async
     * @param {string} id - ID del usuario a eliminar
     * @returns {Promise<void>}
     * @throws {Error} Si el usuario no existe o falla alguna operación
     */
    async deleteUser(id) {
      const t = await sequelize.transaction();
      try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('Usuario no encontrado');
    
        await Picture.destroy({ where: { user_id: id }, transaction: t });
        await user.destroy({ transaction: t });

        const imageApiUrl = process.env.IMAGES_API_URL || 'http://localhost:4000';
        await fetch(`${imageApiUrl}/delete-user/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ socketId: null })
        });
    
        await t.commit();
      } catch (error) {
        await t.rollback();
        throw new Error(`Error eliminando usuario: ${error.message}`);
      }
    }
>>>>>>> origin/dev
  };
};

export default createUserController;
