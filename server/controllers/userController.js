const createUserModel = (db) => ({
    async createUser(email, username, password, rol = 'cliente') {
        try {
          const query = 'INSERT INTO Users (email, username, password, xp, play_time, rol) VALUES (?, ?, ?, 0, 0, ?)';
          const [result] = await db.execute(query, [email, username, password, rol]);
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
  
    async updateUser(id, email, username, xp, playTime, rol) {
      try {
        const query = 'UPDATE Users SET email = ?, username = ?, xp = ?, play_time = ?, rol = ? WHERE id = ?';
        await db.execute(query, [email, username, xp, playTime, rol, id]);
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    },
  
    async updateEmail(id, email) {
      try {
        await db.execute('UPDATE Users SET email = ? WHERE id = ?', [email, id]);
      } catch (error) {
        console.error('Error updating user email:', error);
        throw error;
      }
    },
  
    async updateUsername(id, username) {
      try {
        await db.execute('UPDATE Users SET username = ? WHERE id = ?', [username, id]);
      } catch (error) {
        console.error('Error updating username:', error);
        throw error;
      }
    },
  
    async updatePassword(id, newPassword) {
      try {
        await db.execute('UPDATE Users SET password = ? WHERE id = ?', [newPassword, id]);
      } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
      }
    },
  
    async updateXp(id, xp) {
      try {
        await db.execute('UPDATE Users SET xp = ? WHERE id = ?', [xp, id]);
      } catch (error) {
        console.error('Error updating user XP:', error);
        throw error;
      }
    },
  
    async updatePlayTime(id, playTime) {
      try {
        await db.execute('UPDATE Users SET play_time = ? WHERE id = ?', [playTime, id]);
      } catch (error) {
        console.error('Error updating user play time:', error);
        throw error;
      }
    },
  
    async updateRol(id, rol) {
      try {
        await db.execute('UPDATE Users SET rol = ? WHERE id = ?', [rol, id]);
      } catch (error) {
        console.error('Error updating user role:', error);
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
  