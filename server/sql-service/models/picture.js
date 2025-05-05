const Picture = (sequelize, DataTypes) => {
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

  Picture.associate = (models) => {
    Picture.belongsTo(models.User, { foreignKey: 'user_id' });
  };

  return Picture;
};

export default Picture;
