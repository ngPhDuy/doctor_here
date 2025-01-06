const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Relatives', {
    ma_benh_nhan_1: { // Mã bệnh nhân 1, khóa ngoại liên kết với Benh_nhan
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Benh_nhan',
        key: 'ma_benh_nhan',
      },
    },
    ma_benh_nhan_2: { // Mã bệnh nhân 2, khóa ngoại liên kết với Benh_nhan
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Benh_nhan',
        key: 'ma_benh_nhan',
      },
    },
    than_phan: { // Thân phận của người thân
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    da_xac_nhan: { // Trạng thái đã xác nhận hay chưa
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  }, {
    tableName: 'Nguoi_than', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
  });
};
