const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ImageRequest', {
    ma_yeu_cau: {
        type: DataTypes.STRING(9),
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Yeu_cau_cap_nhat_thong_tin',
            key: 'ma_yeu_cau',
        },
    },
    url: { 
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'Hinh_anh_minh_chung', 
    timestamps: false, 
  });
};
