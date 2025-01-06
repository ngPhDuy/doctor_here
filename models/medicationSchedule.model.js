const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('MedicationSchedule', {
    gio: { // Giờ uống thuốc
      type: DataTypes.TIME,
      allowNull: false,
      primaryKey: true,
    },
    ngay: { // Ngày uống thuốc
      type: DataTypes.DATE,
      allowNull: false,
      primaryKey: true,
    },
    don_thuoc: { // Đơn thuốc, liên kết tới bảng Don_thuoc
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
        references: {
            model: 'Don_thuoc',
            key: 'id',
        },
    },
    nhac_nho: { // Có nhắc nhở hay không
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    thoi_diem_da_uong: { // Thời điểm đã uống thuốc
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'Lan_uong', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
    uniqueKeys: { // Đảm bảo UNIQUE trên khóa chính
      unique_lan_uong: {
        fields: ['gio', 'ngay', 'don_thuoc'],
      },
    },
  });
};
