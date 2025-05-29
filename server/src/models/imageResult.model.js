const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ImageResult', {
    id_ket_qua: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
        references: {
            model: 'Ket_qua_kham_benh',
            key: 'id',
        },
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'Hinh_anh_ket_qua', 
    timestamps: false, 
  });
};
