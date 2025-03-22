const {DataTypes} = require('sequelize');
// CREATE TABLE "Duyet_yeu_cau_cap_nhat" (
//     "yeu_cau_cap_nhat" varchar(9) NOT NULL,
//     "ma_qtv" varchar(9),
//     "thoi_diem_duyet" TIMESTAMP,
//     PRIMARY KEY ("yeu_cau_cap_nhat")
//   );
module.exports = (sequelize) => {
    return sequelize.define("RequestHandle", {
        yeu_cau_cap_nhat: {
            type: DataTypes.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: { model: 'Yeu_cau_cap_nhat_thong_tin', key: 'ma_yeu_cau' },
            onUpdate: 'NO ACTION', 
            onDelete: 'NO ACTION'
        },
        ma_qtv: {
            type: DataTypes.STRING(9),
            allowNull: true,
            references: { model: 'Quan_tri_vien', key: 'ma_qtv' },
            onUpdate: 'NO ACTION', 
            onDelete: 'NO ACTION'
        },
        thoi_diem_duyet: {
            type: DataTypes.DATE,
            allowNull: true
        },
        ly_do: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {   
        tableName: "Duyet_yeu_cau_cap_nhat",
        timestamps: false
    });
}