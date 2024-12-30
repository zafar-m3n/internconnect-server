const { Sequelize } = require("sequelize");
const { sequelize } = require("../config/db");

const User = require("./User");
const Notification = require("./Notifications");
const UserNotification = require("./UserNotification");
const CV = require("./CV");
const Job = require("./Job");

User.associate = (models) => {
  User.belongsToMany(models.Notification, {
    through: models.UserNotification,
    foreignKey: "userId",
    as: "notifications",
  });

  User.hasMany(models.CV, {
    foreignKey: "userId",
    as: "cvs",
  });
};

Notification.associate = (models) => {
  Notification.belongsToMany(models.User, {
    through: models.UserNotification,
    foreignKey: "notificationId",
    as: "users",
  });
};

UserNotification.associate = (models) => {
  UserNotification.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
  UserNotification.belongsTo(models.Notification, {
    foreignKey: "notificationId",
    as: "notification",
  });
};

CV.associate = (models) => {
  CV.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

const models = {
  User,
  Notification,
  UserNotification,
  CV,
  Job,
};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;
