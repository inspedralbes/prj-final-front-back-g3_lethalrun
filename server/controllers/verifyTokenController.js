import crypto from 'crypto';

const verifyTokenController = () => {
  const tokenStore = new Map();

  const generateVerificationToken = (email) => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const tokenBase = `${email}:${timestamp}:${randomBytes}`;
    return crypto.createHash('sha256').update(tokenBase).digest('hex');
  };

  const cleanupExpiredTokens = () => {
    const now = Date.now();
    for (const [token, data] of tokenStore.entries()) {
      if (now > data.expiresAt) {
        tokenStore.delete(token);
      }
    }
  };

  setInterval(cleanupExpiredTokens, 300000); // Limpieza cada 5 minutos

  return {
    async createToken(email, username, password) {
      const token = generateVerificationToken(email);
      const expiresAt = Date.now() + 600000; // 10 minutos
      tokenStore.set(token, { email, username, password, expiresAt });
      return token;
    },

    async verifyToken(token) {
      const tokenData = tokenStore.get(token);
      if (tokenData && Date.now() <= tokenData.expiresAt) {
        tokenStore.delete(token); // Eliminar el token después de la verificación
        return tokenData;
      }
      return null;
    },

    async getVerificationData(token) {
      return tokenStore.get(token) || null;
    },

    async deleteExpiredTokens() {
      cleanupExpiredTokens();
    }
  };
};

export default verifyTokenController;
