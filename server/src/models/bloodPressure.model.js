// CREATE TABLE "Huyet_ap"(
//     "ma_benh_nhan" varchar(9),
//     "thoi_diem_ghi_nhan" TIMESTAMP,
//     "huyet_ap_tam_thu" real,
//     "huyet_ap_tam_truong" real,
//     PRIMARY KEY ("ma_benh_nhan", "thoi_diem_ghi_nhan"),
//     FOREIGN KEY ("ma_benh_nhan") REFERENCES "Benh_nhan" ("ma_benh_nhan") ON DELETE NO ACTION ON UPDATE NO ACTION
//   );
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "BloodPressure",
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
      huyet_ap_tam_thu: {
        type: DataTypes.REAL,
      },
      huyet_ap_tam_truong: {
        type: DataTypes.REAL,
      },
      // dong_bo: {
      //   type: DataTypes.BOOLEAN,
      //   defaultValue: false,
      // },
    },
    {
      tableName: "Huyet_ap",
      timestamps: false,
    }
  );
};
