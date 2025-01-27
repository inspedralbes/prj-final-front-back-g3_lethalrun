const createUserModel = (db, pictureModel) => ({
  async createUser(email, username, password, rol = 'cliente') {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Crear el usuario
      const query =
        'INSERT INTO Users (email, username, password, xp, play_time, rol) VALUES (?, ?, ?, 0, 0, ?)';
      const [result] = await connection.execute(query, [email, username, password, rol]);
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

export default createUserModel;
