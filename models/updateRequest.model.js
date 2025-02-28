const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UpdateRequest', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        trang_thai: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        thoi_diem_yeu_cau: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        ma_yeu_cau: {
            type: DataTypes.STRING(9),
            unique: true,
            allowNull: false,
        },
        trinh_do_hoc_van_cu: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        trinh_do_hoc_van_moi: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dia_chi_pk_cu: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dia_chi_pk_moi: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        chuyen_khoa_cu: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        chuyen_khoa_moi: {
            type: DataTypes.STRING,
            allowNull: true,
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
        thoi_diem_thu_hoi: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        tableName: 'Yeu_cau_cap_nhat_thong_tin',
        timestamps: false, 
    });
}
   