const { LoveList, Doctor, User } = require("../models");

exports.getLoveListByPatient = async (ptID) => {
  return await LoveList.findAll({
    where: {
      ma_benh_nhan: ptID,
    },
    include: {
      model: Doctor,
      as: "Bac_si",
      attributes: {
        exclude: [
          "mo_ta",
          "trinh_do_hoc_van",
          "ma_bac_si",
          "id",
          "ngay_vao_nghe",
        ],
      },
      include: {
        model: User,
        as: "Nguoi_dung",
        attributes: ["ho_va_ten", "avt_url"],
      },
    },
  });
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
