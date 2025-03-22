const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ten_dang_nhap: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Tai_khoan", // Tên bảng trong CSDL
          key: "ten_dang_nhap",
        },
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sdt: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ngay_sinh: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      gioi_tinh: {
        type: DataTypes.STRING(3),
        allowNull: false,
      },
      phan_loai: {
        type: DataTypes.STRING(3),
        allowNull: true,
      },
      ho_va_ten: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avt_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: "Nguoi_dung",
      timestamps: false,
    }
  );
};
