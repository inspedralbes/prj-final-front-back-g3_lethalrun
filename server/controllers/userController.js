import bcrypt from 'bcrypt';

const createUserController = (db) => ({
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

  async deleteUser(id) {
    try {
      await db.execute('DELETE FROM Users WHERE id = ?', [id]);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
});

export default createUserController;
