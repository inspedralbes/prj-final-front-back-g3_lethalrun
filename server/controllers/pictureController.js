const createPictureModel = (db) => ({
    async createPicture(path, userId) {
      try {
        const query = 'INSERT INTO Pictures (path, user_id) VALUES (?, ?)';
        const [result] = await db.execute(query, [path, userId]);
        return result.insertId;
      } catch (error) {
        console.error('Error creating picture:', error);
        throw error;
      }
    },
  
    async getPicture(id) {
      try {
        const [rows] = await db.execute('SELECT * FROM Pictures WHERE id = ?', [id]);
        return rows[0];
      } catch (error) {
        console.error('Error getting picture:', error);
        throw error;
      }
    },
  
    async updatePicture(id, path, userId) {
      try {
        const query = 'UPDATE Pictures SET path = ?, user_id = ? WHERE id = ?';
        await db.execute(query, [path, userId, id]);
      } catch (error) {
        console.error('Error updating picture:', error);
        throw error;
      }
    },
  
    async deletePicture(id) {
      try {
        await db.execute('DELETE FROM Pictures WHERE id = ?', [id]);
      } catch (error) {
        console.error('Error deleting picture:', error);
        throw error;
      }
    }
  });
  
  export default createPictureModel;
  