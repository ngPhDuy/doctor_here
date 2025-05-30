const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "BMI",
    {
      ma_benh_nhan: {
        type: DataTypes.STRING(9),
        allowNull: false,
        primaryKey: true,
        references: { model: "Benh_nhan", key: "ma_benh_nhan" },
        onUpdate: "NO ACTION",
        onDelete: "NO ACTION",
      },
      thoi_diem_ghi_nhan: {
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
      },
      can_nang: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      chieu_cao: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      // dong_bo: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      // },
    },
    {
      tableName: "BMI",
      timestamps: false,
    }
  );
};
