const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('MedicineInSingleDose', {
    gio: { // Thời gian uống thuốc
        type: DataTypes.TIME,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Lan_uong',
            key: 'gio',
        },
    },
    ngay: { // Ngày uống thuốc
        type: DataTypes.DATE,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Lan_uong',
            key: 'ngay',
        },
    },
    don_thuoc: { // Đơn thuốc, liên kết tới Lan_uong
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Lan_uong',
            key: 'don_thuoc',
        },
    },
    thuoc: { // ID thuốc
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Thuoc',
            key: 'id',
        },
    },
    so_luong: { // Số lượng thuốc
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }, {
    tableName: 'Thuoc_trong_mot_lan_uong', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
  });
};
