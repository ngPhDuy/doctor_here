const {
  sequelize,
  Rating,
  Appointment,
  Patient,
  User,
  Comment,
} = require("../models");

exports.getAllRatingsByDoctorID = async (doctorID) => {
  try {
    // Sử dụng Promise.all để chạy song song cả hai truy vấn
    const [ratings, averageRating] = await Promise.all([
      Rating.findAll({
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
          {
            model: Comment,
            as: "Binh_luan",
            attributes: ["noi_dung", "thoi_diem"],
          },
        ],
      }),

      // Truy vấn tính giá trị trung bình
      Rating.findOne({
        attributes: [
          [
            sequelize.fn("AVG", sequelize.col("diem_danh_gia")),
            "averageRating",
          ],
        ],
        where: { ma_bac_si: doctorID.toString() },
      }),
    ]);

    // Trả về kết quả
    return {
      averageRating: averageRating
        ? parseFloat(averageRating.dataValues.averageRating)
        : 0,
      ratings,
    };
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đánh giá:", error);
    throw error;
  }
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

  props = { ...props, thoi_diem: new Date(), ma_bac_si: appointment.ma_bac_si };

  const rating = await Rating.create(props);
  return rating;
};

exports.getRatingByAppointmentID = async (appID) => {
  const rating = await Rating.findOne({
    where: { id_cuoc_hen: appID },
    attributes: ["diem_danh_gia", "noi_dung", "thoi_diem"],
  });
  return rating;
};

/*props:
content
drID
ratingID
*/
exports.createComment = async (props) => {
  if (!props.content) {
    throw new Error("Thiếu nội dung bình luận");
  }

  props.ratingID = +props.ratingID;
  const rating = await Rating.findOne({
    where: { id: props.ratingID },
    attributes: ["id"],
  });

  if (!rating) {
    throw new Error("Đánh giá không tồn tại");
  }

  const comment = await Comment.create({
    noi_dung: props.content,
    thoi_diem: new Date(),
    id_danh_gia: props.ratingID,
    ma_bac_si_binh_luan: props.drID,
  });

  return comment;
};
