const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Notification = sequelize.define(
  "Notification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isBatchNotification: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    batchCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "notifications",
    timestamps: true,
  }
);

Notification.associate = (models) => {
  Notification.belongsToMany(models.User, {
    through: models.UserNotification,
    foreignKey: "notificationId",
    as: "users",
  });
};

module.exports = Notification;
