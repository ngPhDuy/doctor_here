const { WeeklyWork, sequelize } = require("../models");
const { Op } = require("sequelize");
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

exports.deleteOneAI = async (scheduleData) => {
  try {
    const result = await WeeklyWork.update(
      { het_hieu_luc: true, cap_nhat_luc: new Date() },
      {
        where: {
          thu: scheduleData.thu,
          gio_bat_dau: scheduleData.gio_bat_dau,
          gio_ket_thuc: scheduleData.gio_ket_thuc,
          ma_bac_si: scheduleData.ma_bac_si,
        },
      }
    );

    // Nếu không có bản ghi nào bị cập nhật, trả về null
    if (result[0] === 0) {
      return null;
    }

    // Trả về thông tin đã xóa (từ scheduleData)
    return {
      thu: scheduleData.thu,
      gio_bat_dau: scheduleData.gio_bat_dau,
      gio_ket_thuc: scheduleData.gio_ket_thuc,
      ma_bac_si: scheduleData.ma_bac_si,
    };
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

exports.updateOneAI = async (props) => {
  try {
    // Tìm tất cả các lịch làm việc của bác sĩ có cùng ngày và giờ bắt đầu
    const existingSchedules = await WeeklyWork.findAll({
      where: {
        ma_bac_si: props.ma_bac_si,
        thu: props.thu,
        gio_bat_dau: props.gio_bat_dau, // Kiểm tra nếu giờ bắt đầu trùng
        het_hieu_luc: false, // Chỉ lấy các lịch chưa hết hiệu lực
      },
    });

    if (existingSchedules.length > 0) {
      // Nếu có các lịch trùng, cập nhật giờ kết thúc cho tất cả các lịch trùng
      await WeeklyWork.update(
        {
          gio_ket_thuc: props.gio_ket_thuc, // Cập nhật giờ kết thúc
          cap_nhat_luc: new Date(),
        },
        {
          where: {
            id: {
              [Op.in]: existingSchedules.map((schedule) => schedule.id), // Cập nhật tất cả các lịch
            },
          },
        }
      );

      // Trả về các lịch đã được cập nhật
      const updatedSchedules = await WeeklyWork.findAll({
        where: {
          id: {
            [Op.in]: existingSchedules.map((schedule) => schedule.id),
          },
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

      return updatedSchedules;
    } else {
      // Nếu không tìm thấy lịch làm việc trùng, tạo lịch làm việc mới
      const newWorkSchedule = await WeeklyWork.create({
        ma_bac_si: props.ma_bac_si,
        thu: props.thu,
        gio_bat_dau: props.gio_bat_dau,
        gio_ket_thuc: props.gio_ket_thuc,
        lam_viec_onl: props.lam_viec_onl,
        cap_nhat_luc: new Date(),
        hieu_luc: true, // Đặt trạng thái chưa áp dụng
      });

      // Trả về lịch làm việc mới đã được tạo
      return newWorkSchedule;
    }
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
