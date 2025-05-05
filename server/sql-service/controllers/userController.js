import bcrypt from 'bcrypt';
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

    async createUser(email, username, password) {
      const listAdmins = [
        'a20davsalsos@inspedralbes.cat',
        'a23izadelesp@inspedralbes.cat',
        'a23brioropoy@inspedralbes.cat',
        'a23marrojgon@inspedralbes.cat'
      ];

      const rol = listAdmins.includes(email) ? 'admin' : 'cliente';
      const hashedPassword = await bcrypt.hash(password, 10);

      const t = await sequelize.transaction();
      try {
        const newUser = await User.create({
          email,
          username,
          password: hashedPassword,
          rol,
        }, { transaction: t });

        await pictureService.createDefaultPicture(newUser.id, t); // Asociar imagen

        await t.commit();
        return newUser.id;
      } catch (error) {
        await t.rollback();
        console.error('Error creating user:', error);
        throw error;
      }
    },

    async getUser(id) {
      try {
        const user = await User.findByPk(id);
        return user ? user.toJSON() : null;
      } catch (error) {
        console.error('Error getting user:', error);
        throw error;
      }
    },

    async getUserByEmail(email) {
      try {
        const user = await User.findOne({ where: { email } });
        return user ? user.toJSON() : null;
      } catch (error) {
        console.error('Error getting user by email:', error);
        throw error;
      }
    },

    async changeUsername(user, newUsername) {
      try {
        user.username = newUsername;
        await user.save();
        return true;
      } catch (error) {
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

    async changePassword(user, hashedPassword) {
      const t = await sequelize.transaction();
      try {
        user.password = hashedPassword;
        await user.save({ transaction: t });
        await t.commit();
        return true;
      } catch (error) {
        await t.rollback();
        console.error('Error changing password:', error);
        throw error;
      }
    }

  };
};

export default createUserController;
