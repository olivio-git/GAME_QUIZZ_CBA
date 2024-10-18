const { types } = require("pg");
const { DataTypes, UUIDV4 } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define("Stage", {
    IdStage: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    fase: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
  });
};
