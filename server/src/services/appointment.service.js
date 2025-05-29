const {
  Appointment,
  Patient,
  Doctor,
  Timeslot,
  User,
  sequelize,
  WeeklyWork,
  ImageAppointment,
  Rating,
  Diagnosis,
} = require("../models");
const { Op, or } = require("sequelize");

exports.getdrIDandptID = async (appointmentID) => {
  const appointment = await Appointment.findOne({
    where: {
      id: appointmentID,
    },
    attributes: ["ma_bac_si", "ma_benh_nhan_dat_hen"],
  });

  const result = {
    ma_bac_si: appointment.ma_bac_si,
    ma_benh_nhan: appointment.ma_benh_nhan_dat_hen,
  };

  return result;
};

exports.getAllAppointments = async () => {
  //lấy tất cả và sx giảm dần theo id
  const appointments = await Appointment.findAll({
    order: [["id", "DESC"]], // Sắp xếp theo id giảm dần
  });
  return appointments;
};

exports.getAppointmentByID = async (appointmentID) => {
  console.log("Service hit: getAppointmentByID");
  const appointment = await Appointment.findOne({
    where: {
      id: appointmentID,
    },
    attributes: {
      exclude: ["id_gio_hen"],
    },
    include: [
      {
        model: Patient,
        as: "Benh_nhan",
        attributes: {
          exclude: ["id", "ma_benh_nhan"],
        },
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: {
              exclude: ["id", "ten_dang_nhap", "phan_loai"],
            },
          },
        ],
      },
      {
        model: Doctor,
        as: "Bac_si",
        attributes: {
          exclude: ["id"],
        },
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: {
              exclude: ["id", "ten_dang_nhap", "phan_loai"],
            },
          },
        ],
      },
      {
        model: Timeslot,
        as: "Gio_hen",
        attributes: {
          exclude: ["id", "available", "id_ca_lam_viec"],
        },
        include: [
          {
            model: WeeklyWork,
            as: "Ca_lam_viec_trong_tuan",
            attributes: ["lam_viec_onl"],
          },
        ],
      },
      {
        model: ImageAppointment,
        as: "Hinh_anh_bo_sung_cuoc_hen",
        attributes: ["url"],
      },
      {
        model: Rating,
        as: "Danh_gia",
        attributes: ["diem_danh_gia", "noi_dung", "thoi_diem"],
      },
    ],
  });
  return appointment;
};

exports.countAppointmentByMethod = async (onlMethod, doctorID) => {
  console.log("Service hit: countAppointmentByStatus");
  console.log("Received parameters:", onlMethod, doctorID);

  const query = sequelize.query(
    `
        select count(*) as count
        from "Cuoc_hen" ch join "Gio_hen" gh on ch."id_gio_hen" = gh."id"
        join "Ca_lam_viec_trong_tuan" clv on gh."id_ca_lam_viec" = clv."id"
        where clv."lam_viec_onl" = :onlMethod and ch."ma_bac_si" = :doctorID
    `,
    {
      replacements: {
        onlMethod,
        doctorID,
      },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return query;
};

exports.countAppointmentByStatus = async (status, doctorID) => {
  if (status === "1") {
    status = "Đang chờ";
  } else if (status === "2") {
    status = "Hoàn thành";
  } else if (status === "3") {
    status = "Đã hủy";
  } else {
    throw new Error("Trạng thái không hợp lệ");
  }

  const query = sequelize.query(
    `
        select count(*) as count
        from "Cuoc_hen" ch join "Gio_hen" gh on ch."id_gio_hen" = gh."id"
        join "Ca_lam_viec_trong_tuan" clv on gh."id_ca_lam_viec" = clv."id"
        where ch."ma_bac_si" = :doctorID and ch."trang_thai" = :status
    `,
    {
      replacements: {
        status,
        doctorID,
      },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return query;
};

//Lấy thông tin các cuộc hẹn sắp diễn ra từ [ngày bắt đầu; ngày kết thúc] có trạng thái = "Đang chờ" hoặc "Hoàn thành" và ma_bac_si = input
exports.getAppointmentSchedule = async (startDate, endDate, doctorID) => {
  //sắp xếp theo ngày làm việc và thời điểm bắt đầu
  const appointments = await Appointment.findAll({
    where: {
      trang_thai: {
        [Op.or]: ["Đang chờ", "Hoàn thành"],
      },
      ma_bac_si: doctorID,
    },
    attributes: ["id", "dia_chi_phong_kham", "thoi_diem_tao", "trang_thai"],
    include: [
      {
        model: Timeslot,
        as: "Gio_hen",
        where: {
          ngay_lam_viec: {
            [Op.gte]: startDate,
            [Op.lt]: endDate, // nếu endDate là ngày đầu tiên của tháng sau
          },
        },
        include: [
          {
            model: WeeklyWork,
            as: "Ca_lam_viec_trong_tuan",
            attributes: ["lam_viec_onl"],
          },
        ],
      },
      {
        model: Patient,
        as: "Benh_nhan",
        attributes: ["ma_benh_nhan"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["gioi_tinh", "ho_va_ten"],
          },
        ],
      },
    ],
    order: [
      [{ model: Timeslot, as: "Gio_hen" }, "ngay_lam_viec", "ASC"],
      [{ model: Timeslot, as: "Gio_hen" }, "thoi_diem_bat_dau", "ASC"],
    ],
  });
  return appointments;
};

exports.getAllByDoctorID = async (doctorID) => {
  const appointments = await Appointment.findAll({
    where: {
      ma_bac_si: doctorID,
    },
    include: [
      {
        model: Timeslot,
        as: "Gio_hen",
        attributes: {
          exclude: ["id"],
        },
        include: [
          {
            model: WeeklyWork,
            as: "Ca_lam_viec_trong_tuan",
            attributes: ["lam_viec_onl"],
          },
        ],
      },
      {
        model: Patient,
        as: "Benh_nhan",
        attributes: ["ma_benh_nhan"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "gioi_tinh"],
          },
        ],
      },
    ],
    //Sắp xếp theo Gio_hen.thoi_diem_bat_dau
    order: [["Gio_hen", "thoi_diem_bat_dau", "DESC"]],
  });
  return appointments;
};

exports.updateAppointmentStatus = async (appointmentID, newStatus) => {
  console.log("Service hit: updateAppointmentStatus");
  console.log("Received parameters:", appointmentID, newStatus);
  const appointment = await Appointment.update(
    {
      trang_thai: newStatus,
    },
    {
      where: {
        id: appointmentID,
      },
    }
  );
  return appointment;
};

exports.getAllByPatientAndDoctor = async (patientID, doctorID) => {
  const appointments = await Appointment.findAll({
    where: {
      ma_bac_si: doctorID,
      ma_benh_nhan_dat_hen: patientID,
    },
    include: [
      {
        model: Timeslot,
        as: "Gio_hen",
        attributes: {
          exclude: ["id"],
        },
        include: [
          {
            model: WeeklyWork,
            as: "Ca_lam_viec_trong_tuan",
            attributes: ["lam_viec_onl"],
          },
        ],
      },
    ],
    order: [["ma_benh_nhan_dat_hen", "ASC"]],
  });
  return appointments;
};

exports.getAllByStatusAndPtID = async (status, ptID) => {
  const appointments = await Appointment.findAll({
    where: {
      trang_thai: status,
      ma_benh_nhan_dat_hen: ptID,
    },
    attributes: ["id"],
    include: [
      {
        model: Timeslot,
        as: "Gio_hen",
        attributes: {
          exclude: ["id", "id_ca_lam_viec", "available"],
        },
        include: [
          {
            model: WeeklyWork,
            as: "Ca_lam_viec_trong_tuan",
            attributes: ["lam_viec_onl"],
          },
        ],
      },
      {
        model: Doctor,
        as: "Bac_si",
        attributes: ["ma_bac_si", "chuyen_khoa", "dia_chi_pk"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "avt_url"],
          },
        ],
      },
      {
        model: Rating,
        as: "Danh_gia",
        attributes: ["diem_danh_gia", "noi_dung", "thoi_diem"],
      },
    ],
    // Sắp xếp theo thoi_diem_bat_dau giảm dần
    order: [["Gio_hen", "thoi_diem_bat_dau", "DESC"]],
  });
  return appointments;
};

exports.getAllByStatusAndDrID = async (status, drID) => {
  const appointments = await Appointment.findAll({
    where: {
      trang_thai: status,
      ma_bac_si: drID,
    },
    attributes: ["id"],
    include: [
      {
        model: Timeslot,
        as: "Gio_hen",
        attributes: {
          exclude: ["id", "id_ca_lam_viec", "available"],
        },
        include: [
          {
            model: WeeklyWork,
            as: "Ca_lam_viec_trong_tuan",
            attributes: ["lam_viec_onl"],
          },
        ],
      },
      {
        model: Patient,
        as: "Benh_nhan",
        attributes: ["ma_benh_nhan"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "avt_url"],
          },
        ],
      },
    ],
    order: [["id", "DESC"]],
  });
  return appointments;
};

/*props:
textContent
ptID
drID
timeslotID
urls
*/
exports.createAppointment = async (appointmentData) => {
  const { textContent, ptID, drID, timeslotID, urls } = appointmentData;

  const t = await sequelize.transaction(); // Bắt đầu transaction

  try {
    // Kiểm tra xem thời gian có còn sẵn hay không
    const timeSlot = await Timeslot.findOne({
      where: {
        id: timeslotID,
      },
      transaction: t, // Gắn transaction vào các query
    });

    if (timeSlot.available === false) {
      throw new Error("Thời gian đã được đặt");
    }

    // Gọi thủ tục tạo cuộc hẹn
    const newAppointment = await sequelize.query(
      `CALL create_appointment(:textContent, :drID, :ptID, :timeslotID)`,
      {
        replacements: {
          textContent,
          ptID,
          drID,
          timeslotID,
        },
        type: sequelize.QueryTypes.RAW,
        transaction: t, // Gắn transaction vào các query
      }
    );

    // Đánh dấu thời gian đã được đặt
    timeSlot.available = false;
    await timeSlot.save({ transaction: t }); // Gắn transaction vào các thay đổi

    // Tìm cuộc hẹn đã tạo
    const thisAppointment = await Appointment.findOne({
      where: {
        ma_bac_si: drID,
        ma_benh_nhan_dat_hen: ptID,
        id_gio_hen: timeslotID,
      },
      transaction: t, // Gắn transaction vào các query
    });

    // Insert image URLs vào bảng ImageAppointment
    const imagePromises = urls.map((url) => {
      return ImageAppointment.create(
        {
          id_cuoc_hen: thisAppointment.id,
          url: url,
        },
        { transaction: t }
      ); // Gắn transaction vào các thay đổi
    });

    // Chờ tất cả các hình ảnh được chèn
    await Promise.all(imagePromises);

    // Commit transaction nếu không có lỗi
    await t.commit();

    return true;
  } catch (error) {
    // Rollback nếu có lỗi
    await t.rollback();
    throw error; // Ném lỗi để xử lý tiếp ở nơi gọi
  }
};

exports.cancelAppointment = async (appointmentID) => {
  const appointment = await Appointment.findOne({
    where: {
      id: appointmentID,
    },
  });

  if (!appointment) {
    throw new Error("Cuộc hẹn không tồn tại");
  }

  appointment.trang_thai = "Đã hủy";
  await appointment.save();

  const timeSlot = await Timeslot.findOne({
    where: {
      id: appointment.id_gio_hen,
    },
  });

  timeSlot.available = true;
  timeSlot.save();

  return appointment;
};

exports.finishAppointment = async (appointmentID) => {
  const callProcedure = await sequelize.query(
    `CALL Ket_thuc_cuoc_hen(:appointmentID)`,
    {
      replacements: {
        appointmentID,
      },
      type: sequelize.QueryTypes.RAW,
    }
  );

  return true;
};

exports.getStatisticsByMonth = async (drID, year) => {
  console.log(drID, year);
  const callFunc = await sequelize.query(
    `SELECT * FROM thong_ke_cuoc_hen_theo_thang(?, ?)`, // <--- dùng ? thay vì :name
    {
      replacements: [drID, year], // array thứ tự đúng với dấu ?
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return callFunc;
};

exports.getStatisticsByYear = async (drID) => {
  const callFunc = await sequelize.query(
    `SELECT * FROM thong_ke_cuoc_hen_theo_nam(?)`,
    {
      replacements: [drID],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return callFunc;
};

exports.getMethodByMonth = async (drID, month, year) => {
  const callFunc = await sequelize.query(
    `SELECT * FROM thong_ke_hinh_thuc_theo_thang(?, ?, ?)`,
    {
      replacements: [drID, month, year],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return callFunc;
};

exports.getMethodByYear = async (drID, year) => {
  const callFunc = await sequelize.query(
    `SELECT * FROM thong_ke_hinh_thuc_theo_nam(?, ?)`,
    {
      replacements: [drID, year],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return callFunc;
};

// Helper function for push notification
exports.updatePushState = async (appointmentIds, newState) => {
  const updatedRows = await Appointment.update(
    { nhac_nho: newState },
    {
      where: {
        id: {
          [Op.in]: appointmentIds,
        },
      },
    }
  );
  return updatedRows;
};
