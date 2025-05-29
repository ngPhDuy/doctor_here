const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Medicine",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      ten_thuoc: {
        // Tên thuốc
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      mo_ta: {
        // Mô tả thuốc
        type: DataTypes.TEXT,
        allowNull: true,
      },
      don_vi: {
        // Đơn vị của thuốc
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      cong_dung: {
        // Công dụng của thuốc
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cach_dung: {
        // Cách dùng thuốc
        type: DataTypes.TEXT,
        allowNull: true,
      },
      chong_chi_dinh: {
        // Chống chỉ định của thuốc
        type: DataTypes.TEXT,
        allowNull: true,
      },
      url: {
        // URL hình ảnh của thuốc
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      bi_xoa: {
        // Trạng thái xóa của thuốc (0: chưa xóa, 1: đã xóa)
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      truoc_an: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Thuoc", // Tên bảng trong cơ sở dữ liệu
      timestamps: false, // Không sử dụng createdAt và updatedAt
    }
  );
};
