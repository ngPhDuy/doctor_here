const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    noi_dung: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    thoi_diem: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ma_bac_si_binh_luan: {
      type: DataTypes.STRING(9),
      allowNull: true,
      references: {
        model: 'Bac_si',
        key: 'ma_bac_si',
      },
    },
    id_danh_gia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Danh_gia', // Tên bảng liên kết
        key: 'id',
      },
    },
  }, {
    tableName: 'Binh_luan',
    timestamps: false, // Không sử dụng cột createdAt và updatedAt
  });
};
