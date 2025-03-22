const { Relatives, sequelize } = require("../models");
const { Op } = require("sequelize");

exports.createRelative = async (patientId1, patientId2, relationship) => {
  if (patientId1 === patientId2) {
    throw new Error("Two patients must be different");
  }

  const relative = new Relatives({
    ma_benh_nhan_1: patientId1,
    ma_benh_nhan_2: patientId2,
    than_phan: relationship,
    da_xac_nhan: false,
  });

  try {
    await relative.save();
    return relative;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getAllRelatives = async (patientID) => {
  //     SELECT nd.*
  // FROM "Nguoi_than" nt
  // JOIN "Benh_nhan" bn
  //   ON bn."ma_benh_nhan" = CASE
  //                             WHEN nt."ma_benh_nhan_1" = 'patientID' THEN nt."ma_benh_nhan_2"
  //                             ELSE nt."ma_benh_nhan_1"
  //                          END
  // JOIN "Nguoi_dung" nd ON nd."id" = bn."id"
  // WHERE ('patientID' IN (nt."ma_benh_nhan_1", nt."ma_benh_nhan_2"))
  //   AND nt."da_xac_nhan" = true;
  try {
    console.log(patientID); // Kiểm tra kiểu dữ liệu của patientID

    const query = await sequelize.query(
      `
        SELECT nd.*
        FROM "Nguoi_than" nt
        JOIN "Benh_nhan" bn
          ON bn."ma_benh_nhan" = CASE
                                    WHEN nt."ma_benh_nhan_1" = :patientID THEN nt."ma_benh_nhan_2"
                                    ELSE nt."ma_benh_nhan_1"
                                 END
        JOIN "Nguoi_dung" nd ON nd."id" = bn."id"
        WHERE :patientID IN (nt."ma_benh_nhan_1", nt."ma_benh_nhan_2")
          AND nt."da_xac_nhan" = true;
   `,
      {
        replacements: { patientID },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return query;
  } catch (error) {
    throw new Error(error);
  }
};
