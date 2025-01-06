const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('Account', {
    ten_dang_nhap: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    mat_khau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    thoi_diem_mo_tk: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    tableName: 'Tai_khoan',
    timestamps: false,
  });
};
