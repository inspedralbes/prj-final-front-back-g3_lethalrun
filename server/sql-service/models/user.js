/**
 * Modelo User para Sequelize.
 * Representa a un usuario de la aplicación, incluyendo sus datos de acceso,
 * experiencia, tiempo de juego y rol. Un usuario puede tener muchas imágenes asociadas.
 *
 * @param {import('sequelize').Sequelize} sequelize - Instancia de Sequelize.
 * @param {import('sequelize').DataTypes} DataTypes - Tipos de datos de Sequelize.
 * @returns {import('sequelize').Model} Modelo User.
 *
 * @example
 * // Uso típico
 * const User = sequelize.define('User', { ... });
 * User.hasMany(Picture, { foreignKey: 'user_id', onDelete: 'CASCADE' });
 */
const User = (sequelize, DataTypes) => {
  /**
   * Definición del modelo User.
   * - id: Clave primaria autoincremental.
   * - email: Email único y obligatorio.
   * - username: Nombre de usuario obligatorio.
   * - password: Contraseña hasheada.
   * - xp: Experiencia acumulada.
   * - play_time: Tiempo de juego acumulado.
   * - rol: Rol del usuario ('cliente' o 'admin').
   */
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    xp: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    play_time: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    rol: {
      type: DataTypes.ENUM('cliente', 'admin'),
      allowNull: false,
      defaultValue: 'cliente',
    },
  });

  /**
   * Asociación: Un usuario puede tener muchas imágenes (Picture).
   * Si el usuario se elimina, también se eliminan sus imágenes asociadas.
   * @param {Object} models - Modelos de Sequelize.
   */
  User.associate = (models) => {
    User.hasMany(models.Picture, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  return User;
};

export default User;
