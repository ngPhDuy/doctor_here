const { WeeklyWork, sequelize } = require("../models");

//Trạng thái các lịch làm việc (het_hieu_luc, hieu_luc):
// true, _ : đã xóa
// false, true: đang hiệu lực
// false, false: đã cập nhật nhưng chưa hiệu lực

/*
props:
ma_bac_si
thu
gio_bat_dau
gio_ket_thuc
lam_viec_onl
*/
exports.createOne = async (props) => {
  try {
    props = { ...props, cap_nhat_luc: new Date() };
    const doctorSchedule = await WeeklyWork.create(props);
    //lọc ra các trường cần thiết
    return await WeeklyWork.findOne({
      where: {
        id: doctorSchedule.id,
      },
      attributes: [
        "id",
        "thu",
        "gio_bat_dau",
        "gio_ket_thuc",
        "lam_viec_onl",
        "hieu_luc",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.deleteOne = async (id) => {
  try {
    const doctorSchedule = await WeeklyWork.update(
      { het_hieu_luc: true, cap_nhat_luc: new Date() },
      {
        where: {
          id: id,
        },
      }
    );
    return doctorSchedule;
  } catch (error) {
    throw error;
  }
};

/* props:
id
gio_bat_dau
gio_ket_thuc
lam_viec_onl
*/
exports.updateOne = async (props) => {
  try {
    props = { ...props, cap_nhat_luc: new Date(), hieu_luc: false };
    const doctorSchedule = await WeeklyWork.update(props, {
      where: {
        id: props.id,
      },
    });
    return await WeeklyWork.findOne({
      where: {
        id: props.id,
      },
      attributes: [
        "id",
        "thu",
        "gio_bat_dau",
        "gio_ket_thuc",
        "lam_viec_onl",
        "hieu_luc",
      ],
    });
  } catch (error) {
    throw error;
  }
};

exports.getAll = async (drID) => {
  try {
    const schedules = WeeklyWork.findAll({
      where: {
        ma_bac_si: drID,
        het_hieu_luc: false,
      },
      attributes: [
        "id",
        "thu",
        "gio_bat_dau",
        "gio_ket_thuc",
        "lam_viec_onl",
        "hieu_luc",
      ],
    });
    return schedules;
  } catch (error) {
    throw error;
  }
};
