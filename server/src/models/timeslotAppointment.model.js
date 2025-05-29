const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  return sequelize.define('TimeslotAppointment', {
    id_gio_hen: { // ID giờ hẹn, khóa ngoại liên kết với bảng Gio_hen
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Gio_hen', // Tên bảng Gio_hen
            key: 'id', // Khóa chính của bảng Gio_hen
      },
    },
    id_cuoc_hen: { // ID cuộc hẹn, khóa ngoại liên kết với bảng Cuoc_hen
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'Cuoc_hen', // Tên bảng Cuoc_hen
            key: 'id', // Khóa chính của bảng Cuoc_hen
        },
    },
  }, {
    tableName: 'Gio_hen_trong_cuoc_hen', // Tên bảng trong cơ sở dữ liệu
    timestamps: false, // Không sử dụng createdAt và updatedAt
  });
};
