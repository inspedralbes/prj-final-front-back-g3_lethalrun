<<<<<<< HEAD
const Picture = (sequelize, DataTypes) => {
=======
/**
 * Modelo Picture para Sequelize.
 * Representa una imagen asociada a un usuario.
 *
 * @param {import('sequelize').Sequelize} sequelize - Instancia de Sequelize.
 * @param {import('sequelize').DataTypes} DataTypes - Tipos de datos de Sequelize.
 * @returns {import('sequelize').Model} Modelo Picture.
 *
 * @example
 * // Uso típico
 * const Picture = sequelize.define('Picture', { ... });
 * Picture.belongsTo(User, { foreignKey: 'user_id' });
 */
const Picture = (sequelize, DataTypes) => {
  /**
   * Definición del modelo Picture.
   * - id: Clave primaria autoincremental.
   * - is_active: Booleano para indicar si la imagen está activa.
   * - path: Ruta o nombre del archivo de la imagen.
   */
>>>>>>> origin/dev
  const Picture = sequelize.define('Picture', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(255),
      defaultValue: 'default.png',
    },
  });

<<<<<<< HEAD
=======
  /**
   * Asociación: Cada imagen pertenece a un usuario.
   * @param {Object} models - Modelos de Sequelize.
   */
>>>>>>> origin/dev
  Picture.associate = (models) => {
    Picture.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Picture;
};

export default Picture;
