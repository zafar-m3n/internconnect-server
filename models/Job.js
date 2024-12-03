const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Job = sequelize.define(
  "Job",
  {
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vacancy: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    linkedinLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    websiteLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    applicationDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    datePosted: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "jobs",
  }
);

module.exports = Job;
