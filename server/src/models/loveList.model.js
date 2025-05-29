const {DataTypes} = require('sequelize');

// CREATE TABLE "Yeu_thich_bac_si" (
//     "ma_benh_nhan" varchar(9),
//     "ma_bac_si" varchar(9),
//     PRIMARY KEY ("ma_benh_nhan", "ma_bac_si")
//   );
module.exports = (sequelize) => {
    return sequelize.define('LoveList', {
        ma_benh_nhan: {
            type: DataTypes.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: {
                model: "Benh_nhan",
                key: "ma_benh_nhan"
            },
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        },
        ma_bac_si: {
            type: DataTypes.STRING(9),
            allowNull: false,
            primaryKey: true,
            references: {
                model: "Bac_si",
                key: "ma_bac_si"
            },
            onDelete: "NO ACTION",
            onUpdate: "NO ACTION"
        },
    }, {
        tableName: 'Yeu_thich_bac_si',
        timestamps: false
    });
}