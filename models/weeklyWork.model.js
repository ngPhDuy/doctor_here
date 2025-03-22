const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "WeeklyWork",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ma_bac_si: {
        type: DataTypes.STRING(9),
        allowNull: true,
        references: {
          model: "Bac_si",
          key: "ma_bac_si",
        },
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
      thu: {
        type: DataTypes.STRING(10), // Cập nhật chiều dài cột thu cho phù hợp
        allowNull: true,
      },
      gio_bat_dau: {
        type: DataTypes.TIME, // Thay đổi từ buoi_lam_viec thành gio_bat_dau kiểu TIME
        allowNull: true,
      },
      gio_ket_thuc: {
        type: DataTypes.TIME, // Thay đổi từ buoi_lam_viec thành gio_ket_thuc kiểu TIME
        allowNull: true,
      },
      lam_viec_onl: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      cap_nhat_luc: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      hieu_luc: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      het_hieu_luc: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      gia_tien: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },
    },
    {
      tableName: "Ca_lam_viec_trong_tuan", // Tên bảng trong cơ sở dữ liệu
      timestamps: false, // Không sử dụng cột createdAt và updatedAt
    }
  );
};
