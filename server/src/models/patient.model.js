const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Patient",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        references: {
          model: "Nguoi_dung",
          key: "id",
        },
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
      cccd: {
        type: DataTypes.STRING(12),
        defaultValue: "",
      },
      dan_toc: {
        type: DataTypes.STRING,
      },
      nhom_mau: {
        type: DataTypes.STRING,
      },
      tien_su_benh: {
        type: DataTypes.STRING(500),
      },
      quoc_tich: {
        type: DataTypes.STRING(50),
      },
      dia_chi: {
        type: DataTypes.STRING,
      },
      ma_benh_nhan: {
        type: DataTypes.STRING(9),
        allowNull: false,
        unique: true,
      },
      chieu_cao: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      can_nang: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      dong_bo: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      chia_se_kq_cho_tat_ca: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Benh_nhan",
      timestamps: false,
    }
  );
};
