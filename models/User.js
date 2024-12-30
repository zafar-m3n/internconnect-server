const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    microsoftId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    profilePic: {
      type: DataTypes.STRING,
      defaultValue: "/images/profile.png",
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isLecturer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    batchCode: {
      type: DataTypes.STRING,
      defaultValue: "CBXXXXXX",
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

User.associate = (models) => {
  User.belongsToMany(models.Notification, {
    through: models.UserNotification,
    foreignKey: "userId",
    as: "notifications",
  });
};

module.exports = User;
