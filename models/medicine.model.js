const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Medicine', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    ten_thuoc: { // Tên thuốc
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mo_ta: { // Mô tả thuốc
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    don_vi: { // Đơn vị của thuốc
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  }, {
    tableName: 'Thuoc', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
  });
};
