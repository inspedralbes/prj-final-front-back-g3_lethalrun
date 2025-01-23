const createUserModel = (db) => ({
    async createUser(email, username, password) {
      try {
        const query = 'INSERT INTO Users (email, username, password, xp, play_time) VALUES (?, ?, ?, 0, 0)';
        const [result] = await db.execute(query, [email, username, password]);
        return result.insertId;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    },
  
    async getUser(id) {
      try {
        const [rows] = await db.execute('SELECT * FROM Users WHERE id = ?', [id]);
        return rows[0];
      } catch (error) {
        console.error('Error getting user:', error);
        throw error;
      }
    },
  
    async updateUser(id, email, username, xp, playTime) {
      try {
        const query = 'UPDATE Users SET email = ?, username = ?, xp = ?, play_time = ? WHERE id = ?';
        await db.execute(query, [email, username, xp, playTime, id]);
      } catch (error) {
        console.error('Error updating user:', error);
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
  