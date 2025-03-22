const { generateRandomPassword } = require("../middleware/randomPassGen");
const {
  sequelize,
  Doctor,
  User,
  Account,
  Specialization,
  Appointment,
  Rating,
} = require("../models");
const bcryptjs = require("bcryptjs");
const { sendEmail } = require("./emailServices");

exports.getAllDoctor = async () => {
  const { fn, col } = sequelize;

  const doctors = await Doctor.findAll({
    attributes: {
      // Lấy tất cả các trường của Doctor, đồng thời tính thêm trường trung bình điểm và tổng số đánh giá
      include: [
        [
          fn("COALESCE", fn("AVG", col("Cuoc_hen.Danh_gia.diem_danh_gia")), 0),
          "danh_gia_trung_binh",
        ],
        [
          fn("COALESCE", fn("COUNT", col("Cuoc_hen.Danh_gia.id")), 0),
          "tong_so_danh_gia",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "Nguoi_dung",
        attributes: {
          exclude: ["id"],
        },
        include: {
          model: Account,
          as: "Tai_khoan",
          attributes: {
            exclude: ["mat_khau"],
          },
        },
      },
      {
        // Quan hệ từ Doctor → CuocHen
        model: Appointment,
        as: "Cuoc_hen", // chú ý alias phải đúng với cách bạn định nghĩa trong model
        attributes: [], // không cần lấy trường của CuocHen, vì ta chỉ dùng để JOIN
        include: [
          {
            // Quan hệ từ CuocHen → DanhGia
            model: Rating,
            as: "Danh_gia", // alias đúng với define trong model
            attributes: [],
          },
        ],
      },
    ],
    group: [
      "Doctor.id",
      "Nguoi_dung.id",
      "Nguoi_dung->Tai_khoan.ten_dang_nhap",
    ],
    order: [["ma_bac_si", "ASC"]],
  });

  return doctors;
};

exports.getDoctorInfo = async (doctorID) => {
  const { fn, col } = sequelize;

  const doctor = await Doctor.findOne({
    where: {
      ma_bac_si: doctorID,
    },
    attributes: {
      // Lấy tất cả các trường của Doctor, đồng thời tính thêm trường trung bình điểm và tổng số đánh giá
      include: [
        [
          fn("COALESCE", fn("AVG", col("Cuoc_hen.Danh_gia.diem_danh_gia")), 0),
          "danh_gia_trung_binh",
        ],
        [
          fn("COALESCE", fn("COUNT", col("Cuoc_hen.Danh_gia.id")), 0),
          "tong_so_danh_gia",
        ],
      ],
    },
    include: [
      {
        model: User,
        as: "Nguoi_dung",
        attributes: {
          exclude: ["id"],
        },
        include: {
          model: Account,
          as: "Tai_khoan",
          attributes: {
            exclude: ["mat_khau"],
          },
        },
      },
      {
        // Quan hệ từ Doctor → CuocHen
        model: Appointment,
        as: "Cuoc_hen", // chú ý alias phải đúng với cách bạn định nghĩa trong model
        attributes: [], // không cần lấy trường của CuocHen, vì ta chỉ dùng để JOIN
        include: [
          {
            // Quan hệ từ CuocHen → DanhGia
            model: Rating,
            as: "Danh_gia", // alias đúng với define trong model
            attributes: [],
          },
        ],
      },
    ],
    group: [
      "Doctor.id",
      "Nguoi_dung.id",
      "Nguoi_dung->Tai_khoan.ten_dang_nhap",
    ],
    order: [["ma_bac_si", "ASC"]],
  });

  return doctor;
};
/*
props:
doctorID:
email
fullName
phoneNumber
birthDay: yyyy-mm-dd
gender
description
*/
exports.changeInfo = async (props) => {
  const userID = +props.doctorID.substring(2);
  const user = await User.findOne({
    where: {
      id: userID,
    },
  });
  const doctor = await Doctor.findOne({
    where: {
      ma_bac_si: props.doctorID,
    },
  });

  if (!user || !doctor) {
    throw new Error("User or Doctor not found");
  }

  user["email"] = props.email;
  user["ho_va_ten"] = props.fullName;
  user["sdt"] = props.phoneNumber;
  user["ngay_sinh"] = new Date(props.birthDay);
  user["gioi_tinh"] = props.gender;
  doctor["mo_ta"] = props.description;

  const userChangedColumns = user.changed() || [];
  const doctorChangedColumns = doctor.changed() || [];

  await user.save();
  await doctor.save();

  return {
    userUpdated: userChangedColumns.length > 0,
    doctorUpdated: doctorChangedColumns.length > 0,
    userChangedColumns,
    doctorChangedColumns,
  };
};

/*
props:
email
matKhau
tenDangNhap
hoVaTen
sdt
gioiTinh
thoiDiemVaoNghe: dd/mm/yyyy
moTa
diaChiPhongKham
ngaySinh: dd/mm/yyyy
trinhDoHocVan
chuyenKhoa
*/
exports.insertDoctor = async (props) => {
  try {
    const randomPassword = generateRandomPassword();
    const hashedPassword = await bcryptjs.hash(randomPassword, 10);

    await sequelize.query(
      `CALL insert_doctor(
                :in_ten_dang_nhap,
                :in_mat_khau,
                :in_email,
                :in_sdt,
                :in_ngay_sinh,
                :in_gioi_tinh,
                :in_ho_va_ten,
                :in_ngay_vao_nghe,
                :in_trinh_do_hoc_van,
                :in_mo_ta,
                :in_dia_chi_pk,
                :in_chuyen_khoa
            )`,
      {
        replacements: {
          in_ten_dang_nhap: props.tenDangNhap,
          in_mat_khau: hashedPassword,
          in_email: props.email,
          in_sdt: props.sdt,
          in_ngay_sinh: new Date(props.ngaySinh),
          in_gioi_tinh: props.gioiTinh,
          in_ho_va_ten: props.hoVaTen,
          in_ngay_vao_nghe: new Date(props.thoiDiemVaoNghe),
          in_trinh_do_hoc_van: props.trinhDoHocVan,
          in_mo_ta: props.moTa,
          in_dia_chi_pk: props.diaChiPhongKham,
          in_chuyen_khoa: props.chuyenKhoa,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    sendEmail("tkshiha2003@gmail.com", props.tenDangNhap, randomPassword);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

/* Input pros:
- doctorID
- date
- workTime
- onlMethod
- price
*/
exports.insertWeeklyWork = async (props) => {
  try {
    //chuyển workTime thành mảng Varchar trong postgre
    const workTimeArray = `{${props.workTime.join(",")}}`;

    const result = await sequelize.query(
      `CALL insert_weekly_work(
                :doctorID,
                :date,
                :workTime,
                :onlMethod,
                :createdTime,
                :price
            )`,
      {
        replacements: {
          doctorID: props.doctorID,
          date: props.date,
          workTime: workTimeArray,
          onlMethod: props.onlMethod,
          createdTime: new Date(),
          price: props.price,
        },
        type: sequelize.QueryTypes.RAW,
      }
    );

    return true;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getAllSpecialization = async () => {
  const result = await Specialization.findAll({
    order: [["ten_chuyen_khoa", "ASC"]],
  });

  return result;
};
