const { LoveList, Doctor, User, Rating, Appointment, sequelize } = require("../models");

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

exports.addDoctorToLoveListByName = async (ptID, doctorName) => {
  try {
    const name = String(doctorName || "").trim();
    if (!ptID || !name) {
      return { ok: false, message: "Thiếu ptID hoặc doctorName" };
    }

    // 1) Tìm bác sĩ: ưu tiên khớp CHÍNH XÁC, fallback sang chứa
    let doctor = await Doctor.findOne({
      attributes: ["ma_bac_si"],
      include: [{
        model: User,
        as: "Nguoi_dung",
        attributes: ["ho_va_ten", "id", "avt_url"],
        where: { ho_va_ten: { [Op.iLike]: name } },
        required: true,
      }],
    });

    if (!doctor) {
      doctor = await Doctor.findOne({
        attributes: ["ma_bac_si"],
        include: [{
          model: User,
          as: "Nguoi_dung",
          attributes: ["ho_va_ten", "id", "avt_url"],
          where: { ho_va_ten: { [Op.iLike]: `%${name}%` } },
          required: true,
        }],
      });
    }

    if (!doctor) {
      return { ok: false, message: `Không tìm thấy bác sĩ có tên ${doctorName}.` };
    }

    const { ma_bac_si } = doctor;

    // 2) Kiểm tra đã từng có cuộc hẹn chưa
    const hadAppointment = await Appointment.findOne({
      where: { ma_benh_nhan_dat_hen: ptID, ma_bac_si },
      attributes: ["id"],
    });
    if (!hadAppointment) {
      return { ok: false, message: "Bác sĩ này chưa từng khám cho bạn." };
    }

    // 3) Kiểm tra đã có trong yêu thích chưa
    const existed = await LoveList.findOne({
      where: { ma_benh_nhan: ptID, ma_bac_si },
      attributes: ["ma_benh_nhan", "ma_bac_si"],
    });
    if (existed) {
      return { ok: false, message: "Bác sĩ đã có trong danh sách yêu thích." };
    }

    // 4) Thêm mới
    const created = await LoveList.create({ ma_benh_nhan: ptID, ma_bac_si });
    return { ok: true, data: created };
  } catch (err) {
    // Không throw, trả lỗi có message để map hiển thị
    return { ok: false, message: "Lỗi hệ thống khi thêm vào yêu thích.", detail: err.message };
  }
};

exports.deleteDoctorFromLoveListByName = async (ptID, doctorName) => {
  try {
    const name = String(doctorName || "").trim();
    if (!ptID || !name) {
      return { ok: false, message: "Thiếu ptID hoặc doctorName" };
    }

    // 1) Tìm bác sĩ (ưu tiên khớp chính xác, fallback qua chứa)
    let doctor = await Doctor.findOne({
      attributes: ["ma_bac_si"],
      include: [{
        model: User,
        as: "Nguoi_dung",
        attributes: ["ho_va_ten", "id", "avt_url"],
        where: { ho_va_ten: { [Op.iLike]: name } },
        required: true,
      }],
    });

    if (!doctor) {
      doctor = await Doctor.findOne({
        attributes: ["ma_bac_si"],
        include: [{
          model: User,
          as: "Nguoi_dung",
          attributes: ["ho_va_ten", "id", "avt_url"],
          where: { ho_va_ten: { [Op.iLike]: `%${name}%` } },
          required: true,
        }],
      });
    }

    if (!doctor) {
      return { ok: false, message: `Không tìm thấy bác sĩ có tên ${doctorName}.` };
    }

    const { ma_bac_si } = doctor;

    // 2) Kiểm tra tồn tại trong danh sách yêu thích
    const existed = await LoveList.findOne({
      where: { ma_benh_nhan: ptID, ma_bac_si },
      attributes: ["ma_benh_nhan", "ma_bac_si"],
    });

    if (!existed) {
      return { ok: false, message: "Bác sĩ này chưa có trong danh sách yêu thích." };
    }

    // 3) Xoá
    await LoveList.destroy({ where: { ma_benh_nhan: ptID, ma_bac_si } });

    return { ok: true, data: { ma_benh_nhan: ptID, ma_bac_si } };
  } catch (err) {
    return { ok: false, message: "Lỗi hệ thống khi xoá khỏi yêu thích.", detail: err.message };
  }
};

exports.removeDoctorFromLoveList = async (ptID, drID) => {
  return await LoveList.destroy({
    where: {
      ma_benh_nhan: ptID,
      ma_bac_si: drID,
    },
  });
};
