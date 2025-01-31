import crypto from 'crypto';

const createTokenController = (db) => {
  const executeTransaction = async (queries) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const results = await Promise.all(queries.map(q => connection.execute(...q)));
      await connection.commit();
      return results;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  const generateVerificationToken = (email) => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const tokenBase = `${email}:${timestamp}:${randomBytes}`;
    return crypto.createHash('sha256').update(tokenBase).digest('hex');
  };

  return {
    async createToken(email, username, password) {
      try {
        const token = generateVerificationToken(email);
        const [result] = await db.execute(
          'INSERT INTO verification_tokens (email, username, password, token) VALUES (?, ?, ?, ?)',
          [email, username, password, token]
        );
        return token;
      } catch (error) {
        console.error('Error creating token:', error);
        throw error;
      }
    },

    async verifyToken(token) {
      try {
        const queries = [
          ['SELECT * FROM verification_tokens WHERE token = ? AND verified = FALSE AND expires_at > CURRENT_TIMESTAMP', [token]],
          ['UPDATE verification_tokens SET verified = TRUE WHERE token = ?', [token]]
        ];
        const [[rows], ] = await executeTransaction(queries);
        return rows.length > 0 ? rows[0] : null;
      } catch (error) {
        console.error('Error verifying token:', error);
        throw error;
      }
    },

    async getVerificationData(token) {
      try {
        const [rows] = await db.execute(
          'SELECT * FROM verification_tokens WHERE token = ?',
          [token]
        );
        return rows.length > 0 ? rows[0] : null;
      } catch (error) {
        console.error('Error getting verification data:', error);
        throw error;
      }
    },

    async deleteExpiredTokens() {
      try {
        await db.execute('DELETE FROM verification_tokens WHERE expires_at <= CURRENT_TIMESTAMP');
      } catch (error) {
        console.error('Error deleting expired tokens:', error);
        throw error;
      }
    }
  };
};

export default createTokenController;
