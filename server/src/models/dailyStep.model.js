const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "DailyStep",
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
      tong_so_buoc: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      // dong_bo: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      // },
    },
    {
      tableName: "So_buoc_di_trong_ngay",
      timestamps: false,
    }
  );
};
