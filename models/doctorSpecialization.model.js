const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('DoctorSpecialization', {
    ma_bac_si: {
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Bac_si', // Tên bảng liên kết
        key: 'ma_bac_si',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
    chuyen_khoa: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'Bac_si_thuoc_chuyen_khoa',
    timestamps: false, // Không sử dụng cột createdAt và updatedAt
  });
};
