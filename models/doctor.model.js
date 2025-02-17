const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Doctor', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            references: {
              model: 'Nguoi_dung', // Tên bảng trong CSDL
              key: 'id',
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        },
        ngay_vao_nghe: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        trinh_do_hoc_van: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        mo_ta: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        dia_chi_pk: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ma_bac_si: {
          type: DataTypes.STRING(9),
          allowNull: false,
          unique: true,
        },
        chuyen_khoa: {
          type: DataTypes.STRING(50),
          allowNull: true
        }
    }, 
    {
      tableName: 'Bac_si',
      timestamps: false,
    });
}