const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Distance",
    {
      ma_benh_nhan: {
        type: DataTypes.STRING(9),
        primaryKey: true,
        references: {
          model: "Benh_nhan",
          key: "ma_benh_nhan",
        },
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
      thoi_diem_ghi_nhan: {
        type: DataTypes.DATE,
        primaryKey: true,
      },
      gia_tri: {
        type: DataTypes.REAL,
        allowNull: false,
      },
    },
    {
      tableName: "Khoang_cach",
      timestamps: false,
    }
  );
};
