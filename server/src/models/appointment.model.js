const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Appointment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      van_ban_bo_sung: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      dia_chi_phong_kham: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trang_thai: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      thoi_diem_tao: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      ma_bac_si: {
        type: DataTypes.STRING(9),
        allowNull: false,
        references: {
          model: "Bac_si",
          key: "ma_bac_si",
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION",
        },
      },
      ma_benh_nhan_dat_hen: {
        type: DataTypes.STRING(9),
        allowNull: false,
        references: {
          model: "Benh_nhan",
          key: "ma_benh_nhan",
          onDelete: "NO ACTION",
          onUpdate: "NO ACTION",
        },
      },
      nhac_nho: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      tableName: "Cuoc_hen",
      timestamps: false,
    }
  );
};
