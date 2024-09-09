const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Project = sequelize.define('Project', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    assignedTo: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: [],
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    timestamps: true,
    paranoid: true, // For soft deletes
    underscored: true,
  });

  Project.associate = (models) => {
    Project.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    Project.belongsToMany(models.User, { through: 'ProjectAssignments', foreignKey: 'projectId', as: 'assignedUsers' });
  };

  return Project;
};
