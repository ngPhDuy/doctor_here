const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('ImageAppointment', {
    id_cuoc_hen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
        references: {
            model: 'Cuoc_hen',
            key: 'id',
        },
    },
    url: { 
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
    },
  }, {
    tableName: 'Hinh_anh_bo_sung_cuoc_hen', 
    timestamps: false, 
  });
};
