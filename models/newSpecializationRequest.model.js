const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('NewSpecializationRequest', {
    ma_yeu_cau: { // Khóa ngoại, liên kết với bảng chứa mã yêu cầu
      type: DataTypes.STRING(9),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Yeu_cau_cap_nhat_thong_tin',
        key: 'ma_yeu_cau',
      },
      onDelete: 'NO ACTION',
      onUpdate: 'NO ACTION',
    },
    chuyen_khoa: { // Chuyên khoa cũ của yêu cầu
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'Chuyen_khoa_moi_yeu_cau', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
  });
};
