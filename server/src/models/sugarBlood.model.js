const { DataTypes } = require("sequelize");
// CREATE TABLE "Duong_huyet"(
//     "ma_benh_nhan" varchar(9),
//     "thoi_diem_ghi_nhan" TIMESTAMP,
//     "gia_tri" real,
//     PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
//     FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
//   );
module.exports = (sequelize) => {
  return sequelize.define(
    "SugarBlood",
    {
      ma_benh_nhan: {
        type: DataTypes.STRING(9),
        primaryKey: true,
        references: {
          model: "Benh_nhan",
          key: "ma_benh_nhan",
        },
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
      thoi_diem_ghi_nhan: {
        type: DataTypes.DATE,
        primaryKey: true,
      },
      gia_tri: {
        type: DataTypes.REAL,
        allowNull: false,
      },
      // dong_bo: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      // },
    },
    {
      tableName: "Duong_huyet",
      timestamps: false,
    }
  );
};
