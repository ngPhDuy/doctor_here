const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('Admin', {
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
        que_quan: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cccd: {
          type: DataTypes.STRING(12),
          allowNull: true,
        },
        dan_toc: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        tam_tru: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        ma_qtv: {
          type: DataTypes.STRING(9),
          allowNull: false,
          unique: true,
        }
    }, {
        tableName: 'Quan_tri_vien',
        timestamps: false,
    });
}