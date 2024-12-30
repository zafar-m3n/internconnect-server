const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const UserNotification = sequelize.define(
  "UserNotification",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    seenAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "user_notifications",
    timestamps: false,
  }
);

module.exports = UserNotification;
