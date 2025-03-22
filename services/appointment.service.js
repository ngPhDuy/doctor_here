const {
  Appointment,
  Patient,
  Doctor,
  Timeslot,
  User,
  sequelize,
  WeeklyWork,
  ImageAppointment,
} = require("../models");
const { Op, or } = require("sequelize");

exports.getAllAppointments = async () => {
  //lấy tất cả và sx giảm dần theo id
  const appointments = await Appointment.findAll({
    order: [["id", "DESC"]], // Sắp xếp theo id giảm dần
  });
  return appointments;
};

exports.getAppointmentByID = async (appointmentID) => {
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
              exclude: ["id", "ten_dang_nhap", "email", "phan_loai"],
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
              exclude: ["id", "ten_dang_nhap", "email", "phan_loai"],
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

//Lấy thông tin các cuộc hẹn sắp diễn ra từ [ngày bắt đầu; ngày kết thúc] có trạng thái = "Đang chờ" và ma_bac_si = input
exports.getAppointmentSchedule = async (startDate, endDate, doctorID) => {
  //sắp xếp theo ngày làm việc và thời điểm bắt đầu
  const appointments = await Appointment.findAll({
    where: {
      trang_thai: "Đang chờ",
      ma_bac_si: doctorID,
    },
    attributes: ["id", "dia_chi_phong_kham", "thoi_diem_tao"],
    include: [
      {
        model: Timeslot,
        as: "Gio_hen",
        where: {
          ngay_lam_viec: {
            [Op.between]: [startDate, endDate],
          },
        },
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
  });
  return appointments;
};

exports.updateAppointmentStatus = async (appointmentID, newStatus) => {
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
    attributes: [],
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
        attributes: ["chuyen_khoa", "dia_chi_pk"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "avt_url"],
          },
        ],
      },
    ],
  });
  return appointments;
};
