const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Prescription",
    {
      id: {
        // ID đơn thuốc
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      id_ket_qua: {
        // Liên kết tới bảng Ket_qua
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "Ket_qua_kham_benh",
          key: "id",
        },
      },
      ngay_bat_dau: {
        // Ngày bắt đầu
        type: DataTypes.DATE,
        allowNull: true,
      },
      ngay_ket_thuc: {
        // Ngày kết thúc
        type: DataTypes.DATE,
        allowNull: true,
      },
      trang_thai: {
        // Trạng thái đơn thuốc
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ghi_chu: {
        // Ghi chú thêm
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ten_don_thuoc: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ma_benh_nhan: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      tableName: "Don_thuoc", // Tên bảng trong cơ sở dữ liệu
      timestamps: false, // Không sử dụng createdAt và updatedAt
    }
  );
};
