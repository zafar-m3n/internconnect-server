const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
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
  },
  profilePic: {
    type: DataTypes.STRING,
    defaultValue: '/images/profile.png',
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isLecturer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  notifications: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  seenNotifications: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
}, {
  tableName: 'users',
  createdAt: 'createdAt', 
  updatedAt: 'updatedAt', 
});

module.exports = User;
