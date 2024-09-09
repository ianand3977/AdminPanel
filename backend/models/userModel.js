const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    timestamps: true,
    underscored: true,
  });

  User.associate = (models) => {
    User.belongsTo(models.Role, { foreignKey: 'roleId', as: 'role' });
    User.hasMany(models.Project, { foreignKey: 'createdBy', as: 'createdProjects' });
    User.belongsToMany(models.Project, { through: 'ProjectAssignments', foreignKey: 'userId', as: 'assignedProjects' });
  };

  return User;
};
