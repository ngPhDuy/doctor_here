const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Specialization",
    {
      ten_chuyen_khoa: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      img_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "Chuyen_khoa",
      timestamps: false,
    }
  );
};
