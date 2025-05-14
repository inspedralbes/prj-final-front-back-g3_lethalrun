import crypto from 'crypto';

/**
 * Controlador para gestionar tokens de verificación y restablecimiento de contraseña.
 * 
 * Este controlador permite la generación, almacenamiento, verificación y limpieza de tokens
 * temporales en memoria, utilizados para procesos de verificación de cuenta y restablecimiento
 * de contraseña. Los tokens se almacenan en un Map en memoria y se eliminan automáticamente
 * después de su expiración para optimizar el uso de recursos.
 *
 * @returns {Object} - El controlador con los métodos para generar, verificar y gestionar tokens.
 */
const verifyTokenController = () => {
  // Almacén en memoria para los tokens y sus datos asociados
  const tokenStore = new Map();

  /**
   * Genera un token de verificación único.
   * 
   * El token se construye combinando el correo electrónico, un timestamp y una cadena aleatoria,
   * y luego se aplica un hash SHA-256 para obtener una cadena segura y única.
   *
   * @param {string} email - El correo electrónico del usuario para el que se genera el token.
   * @returns {string} - El token de verificación generado.
   */
  const generateVerificationToken = (email) => {
    const timestamp = Date.now().toString();
    const randomBytes = crypto.randomBytes(16).toString('hex');
    const tokenBase = `${email}:${timestamp}:${randomBytes}`;
    return crypto.createHash('sha256').update(tokenBase).digest('hex');
  };

  /**
   * Elimina los tokens expirados del almacén en memoria.
   * 
   * Recorre todos los tokens y elimina aquellos cuyo tiempo de expiración ya ha pasado.
   * Esta función se ejecuta automáticamente cada 5 minutos para mantener el almacén limpio.
   */
  const cleanupExpiredTokens = () => {
    const now = Date.now();
    for (const [token, data] of tokenStore.entries()) {
      if (now > data.expiresAt) {
        tokenStore.delete(token); // Eliminar token expirado
      }
    }
  };

  // Limpieza automática de tokens expirados cada 5 minutos (300000 ms)
  setInterval(cleanupExpiredTokens, 300000);

  return {
    /**
     * Crea y almacena un token de verificación para el usuario.
     * 
     * El token se asocia al correo, nombre de usuario y contraseña proporcionados,
     * y tiene una validez de 10 minutos. Se utiliza principalmente para procesos
     * de verificación de cuenta, como confirmación de registro.
     *
     * @param {string} email - El correo electrónico del usuario.
     * @param {string} username - El nombre de usuario del usuario.
     * @param {string} password - La contraseña del usuario.
     * @returns {Promise<string>} - El token generado.
     */
    async createToken(email, username, password) {
      const token = generateVerificationToken(email);
      const expiresAt = Date.now() + 600000; // 10 minutos
      tokenStore.set(token, { email, username, password, expiresAt });
      return token;
    },

    /**
     * Crea y almacena un token para restablecer la contraseña del usuario.
     * 
     * El token se asocia únicamente al correo electrónico y se marca como de tipo
     * 'passwordReset'. Tiene una validez de 1 hora y se utiliza para validar
     * solicitudes de restablecimiento de contraseña.
     *
     * @param {string} email - El correo electrónico del usuario.
     * @returns {Promise<string>} - El token de restablecimiento de contraseña generado.
     */
    async createPasswordResetToken(email) {
      const token = generateVerificationToken(email);
      const expiresAt = Date.now() + 3600000; // 1 hora
      tokenStore.set(token, { email, type: 'passwordReset', expiresAt });
      return token;
    },

    /**
     * Verifica si un token proporcionado es válido y no ha expirado.
     * 
     * Si el token es válido y está vigente, elimina el token del almacén para evitar
     * su reutilización y retorna los datos asociados. Si el token no existe o ha expirado,
     * retorna `null`.
     *
     * @param {string} token - El token que se desea verificar.
     * @returns {Promise<Object|null>} - Los datos del token si es válido, o `null` si no es válido o ha expirado.
     */
    async verifyToken(token) {
      const tokenData = tokenStore.get(token);
      if (tokenData && Date.now() <= tokenData.expiresAt) {
        tokenStore.delete(token); // Eliminar el token después de la verificación
        return tokenData;
      }
      return null;
    },

    /**
     * Obtiene los datos asociados a un token específico, si existe.
     * 
     * No elimina el token del almacén, solo retorna los datos si el token está presente.
     * Es útil para consultar información antes de realizar una acción definitiva.
     *
     * @param {string} token - El token del cual se desean obtener los datos.
     * @returns {Promise<Object|null>} - Los datos del token, o `null` si no existe.
     */
    async getVerificationData(token) {
      return tokenStore.get(token) || null;
    },

    /**
     * Elimina manualmente los tokens expirados del almacén en memoria.
     * 
     * Esta función puede ejecutarse en cualquier momento para forzar la limpieza
     * de tokens expirados, además de la limpieza automática periódica.
     *
     * @returns {Promise<void>} - No devuelve ningún valor.
     */
    async deleteExpiredTokens() {
      cleanupExpiredTokens();
    }
  };
};

export default verifyTokenController;
