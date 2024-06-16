"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Data extends Model {
    static associate(models) {
      // https://sequelize.org/v5/manual/associations.html
    }
  }
  Data.init(
    {
      fileId: {
        type: DataTypes.STRING,
      },
      isRead: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
      message: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Data",
    }
  );
  return Data;
};
