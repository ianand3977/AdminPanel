module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    targetResource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    performedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: true,
    underscored: true,
  });

  return AuditLog;
};
