const User = (sequelize, DataTypes) => {
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

  User.associate = (models) => {
    User.hasMany(models.Picture, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  };

  return User;
};

export default User;
