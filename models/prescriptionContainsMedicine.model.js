const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('PrescriptionContainsMedicine', {
    id_thuoc: { // ID thuốc, liên kết tới bảng Medicine
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Thuoc', // Tên bảng liên kết
        key: 'id',
      },
    },
    id_don_thuoc: { // ID đơn thuốc
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
        references: {
            model: 'Don_thuoc', // Tên bảng liên kết
            key: 'id',
        },
    },
    tong_so: { // Tổng số thuốc
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'Don_chua_thuoc', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
  });
};
