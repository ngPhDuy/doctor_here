const { sequelize, Rating, Appointment, Patient, User } = require("../models");

exports.getAllRatingsByDoctorID = async (doctorID) => {
  const ratings = await Rating.findAll({
    attributes: { exclude: ["ma_benh_nhan_danh_gia"] },
    include: [
      {
        model: Appointment,
        as: "Cuoc_hen",
        where: {
          ma_bac_si: doctorID.toString(),
        },
        attributes: [],
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
  });
  return ratings;
};

/*props:
diem_danh_gia: integer
noi_dung: string
id_cuoc_hen
ma_benh_nhan_danh_gia
*/
exports.createRating = async (props) => {
  props = { ...props, thoi_diem: new Date() };

  if (!props.diem_danh_gia) {
    throw new Error("Thiếu điểm đánh giá");
  }

  if (props.diem_danh_gia < 0 || props.diem_danh_gia > 5) {
    throw new Error("Điểm đánh giá không hợp lệ");
  }

  const appointment = await Appointment.findOne({
    where: { id: props.id_cuoc_hen },
  });

  if (!appointment) {
    throw new Error("Cuộc hẹn không tồn tại");
  }

  if (appointment.ma_benh_nhan_dat_hen !== props.ma_benh_nhan_danh_gia) {
    throw new Error("Bạn không thể đánh giá cuộc hẹn này");
  }

  if (appointment.trang_thai !== "Hoàn thành") {
    throw new Error("Cuộc hẹn chưa kết thúc");
  }

  props = { ...props, thoi_diem: new Date() };

  const rating = await Rating.create(props);
  return rating;
};
