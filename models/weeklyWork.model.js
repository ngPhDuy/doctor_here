const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('WeeklyWork', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        ma_bac_si: {
            type: DataTypes.STRING(9),
            allowNull: true,
            references: {
                model: 'Bac_si',
                key: 'ma_bac_si',
            },
            onDelete: 'NO ACTION',
            onUpdate: 'NO ACTION',
        },
        thu: {
            type: DataTypes.STRING(2),
            allowNull: true,
        },
        buoi_lam_viec: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lam_viec_onl: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        cap_nhat_luc: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        hieu_luc: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        gia_tien: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        tableName: 'Ca_lam_viec_trong_tuan',
        timestamps: false, // Không sử dụng cột createdAt và updatedAt
    });
}