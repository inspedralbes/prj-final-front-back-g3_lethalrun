import bcrypt from 'bcrypt';
import pictureController from './pictureController.js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const createUserController = (models) => {
  const { User, Picture, sequelize } = models;
  const pictureService = pictureController({ Picture });

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

    let newUser;
    let defaultPicturePath;

    const t = await sequelize.transaction();
    try {
      // 1. Crear usuario
      newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        rol,
      }, { transaction: t });

      await t.commit();
    } catch (error) {
      await t.rollback();
      console.error('Error creando el usuario:', error);
      throw error;
    }

    // 2. Crear slots en microservicio (API externa)
    try {
      const slotResponse = await fetch(`${process.env.SLOTS_API_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!slotResponse.ok) {
        throw new Error(`Error al crear slots: ${slotResponse.statusText}`);
      }

      console.log('Slots creados correctamente para', email);
    } catch (error) {
      // Si falla, borrar el usuario para no dejar datos huérfanos
      await User.destroy({ where: { id: newUser.id } });
      throw error;
    }

    // 3. Crear imagen por defecto
    try {
      defaultPicturePath = await pictureService.createDefaultPicture(newUser.id);
    } catch (error) {
      await User.destroy({ where: { id: newUser.id } });
      throw error;
    }

    return newUser.id;
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
    },

    async deleteUser(id) {
      const t = await sequelize.transaction();
      try {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
    
        // Eliminar imágenes asociadas en la base de datos
        await Picture.destroy({ where: { user_id: id }, transaction: t });
    
        // Eliminar usuario en la base de datos
        await user.destroy({ transaction: t });
    
        // Llamada a la API de imágenes para eliminar su carpeta
        const imageApiUrl = process.env.IMAGES_API_URL || 'http://localhost:4000';
        await fetch(`${imageApiUrl}/delete-user/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ socketId: null })
        });
    
        await t.commit();
      } catch (error) {
        await t.rollback();
        console.error('Error deleting user:', error);
        throw error;
      }
    }
  };
};

export default createUserController;
