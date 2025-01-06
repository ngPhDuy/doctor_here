const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Insurance', {
    ma_bhyt: { // Mã bảo hiểm y tế
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    bv_dang_ky: { // Bệnh viện đăng ký
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ngay_cap: { // Ngày cấp bảo hiểm
      type: DataTypes.DATE,
      allowNull: true,
    },
    ngay_het_han: { // Ngày hết hạn bảo hiểm
      type: DataTypes.DATE,
      allowNull: true,
    },
    ma_benh_nhan: { // Mã bệnh nhân, khóa ngoại liên kết với bảng Benh_nhan
      type: DataTypes.STRING(9),
      allowNull: true,
      references: {
        model: 'Benh_nhan',
        key: 'ma_benh_nhan',
      },
    },
  }, {
    tableName: 'Bao_hiem_y_te', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
  });
};
