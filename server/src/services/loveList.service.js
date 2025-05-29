const { LoveList, Doctor, User, Rating, sequelize } = require("../models");

const { Op } = require("sequelize");

exports.getLoveListByPatient = async (ptID) => {
  const query = sequelize.query(
    `SELECT 
    "Bac_si"."ma_bac_si",
    "Bac_si"."dia_chi_pk",
    "Bac_si"."chuyen_khoa",
    "Bac_si"."ngay_vao_nghe",
    "Bac_si"."mo_ta",
    "Nguoi_dung"."ho_va_ten",
    "Nguoi_dung"."avt_url",
    COALESCE(AVG("Danh_gia"."diem_danh_gia"), 0) AS "diem_danh_gia_trung_binh", -- Tính điểm trung bình
    COUNT("Danh_gia"."id") AS "tong_so_danh_gia" -- Tính tổng số đánh giá
FROM 
    "Yeu_thich_bac_si" AS "LoveList"
JOIN 
    "Bac_si" ON "LoveList"."ma_bac_si" = "Bac_si"."ma_bac_si"
JOIN 
    "Nguoi_dung" ON "Bac_si"."id" = "Nguoi_dung"."id"
LEFT JOIN 
    "Danh_gia" ON "Bac_si"."ma_bac_si" = "Danh_gia"."ma_bac_si"
WHERE 
    "LoveList"."ma_benh_nhan" = :ptID
GROUP BY 
    "Bac_si"."ma_bac_si", 
    "Bac_si"."dia_chi_pk", 
    "Bac_si"."chuyen_khoa", 
    "Bac_si"."ngay_vao_nghe",
    "Bac_si"."mo_ta",
    "Nguoi_dung"."ho_va_ten", 
    "Nguoi_dung"."avt_url";
`,
    {
      replacements: { ptID },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  console.log("Query result:", query); // Log the query result for debugging

  return query;
};

exports.addDoctorToLoveList = async (ptID, drID) => {
  const check = await LoveList.findOne({
    where: {
      ma_benh_nhan: ptID,
      ma_bac_si: drID,
    },
  });

  if (check) {
    throw new Error("Bác sĩ đã có trong danh sách yêu thích");
  }

  return await LoveList.create({
    ma_benh_nhan: ptID,
    ma_bac_si: drID,
  });
};

exports.removeDoctorFromLoveList = async (ptID, drID) => {
  return await LoveList.destroy({
    where: {
      ma_benh_nhan: ptID,
      ma_bac_si: drID,
    },
  });
};
