const {
  Patient,
  User,
  Doctor,
  Appointment,
  sequelize,
  Account,
  Insurance,
} = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const secrectKey = process.env.SECRET_KEY;

exports.getAllPatient = async () => {
  const patient = await Patient.findAll({
    include: {
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
    order: [["ma_benh_nhan", "ASC"]],
  });
  return patient;
};

exports.getPatientInfo = async (patientID) => {
  const patient = await Patient.findOne({
    where: {
      ma_benh_nhan: patientID,
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
        model: Insurance,
        as: "Bao_hiem_y_te",
        attributes: {
          exclude: ["ma_benh_nhan"],
        },
      },
    ],
  });
  return patient;
};

exports.getPatientInfoByName = async (patientName) => {
  const patient = await Patient.findOne({
    include: [
      {
        model: User,
        as: "Nguoi_dung",
        where: {
          ho_va_ten: {
            [Op.iLike]: `%${patientName}%`,
          },
        },
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
        model: Insurance,
        as: "Bao_hiem_y_te",
        attributes: {
          exclude: ["ma_benh_nhan"],
        },
      },
    ],
  });

  return patient;
};

exports.getAllByDoctorID = async (doctorID) => {
  const query = sequelize.query(
    `select distinct nd.*, bn.*, bh.*
        from "Benh_nhan" bn join "Nguoi_dung" nd on bn."id" = nd.id 
        join "Cuoc_hen" ch on bn."ma_benh_nhan" = ch."ma_benh_nhan_dat_hen"
        join "Bao_hiem_y_te" bh on bn."ma_benh_nhan" = bh."ma_benh_nhan"
        where ch."ma_bac_si" = :doctorID
        order by bn."ma_benh_nhan" asc;`,
    {
      replacements: { doctorID },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return query;
};

/* props:
username
fullname
address
phone
birthday
gender
avt_url
*/
exports.createOne = async (props) => {
  const checkUsername = await User.findOne({
    where: { ten_dang_nhap: props.username },
  });

  if (checkUsername) {
    throw new Error("Tên đăng nhập đã tồn tại!");
  }

  const checkPhone = await User.findOne({
    where: { sdt: props.phone },
  });

  if (checkPhone) {
    throw new Error("Số điện thoại đã được sử dụng");
  }

  const user = await User.create({
    ten_dang_nhap: props.username,
    ho_va_ten: props.fullname,
    ngay_sinh: props.birthday,
    sdt: props.phone,
    gioi_tinh: props.gender,
    phan_loai: "bn",
    email: "",
    avt_url: props.avt_url ? props.avt_url : null,
  });

  console.log("Tao thanh cong user");

  const userID = user.id;

  //tạo ra mã bệnh nhân có định dạng 9 ký tự BN + (id dạng 7 kí số)
  const patientID = "BN" + userID.toString().padStart(7, "0");

  //trả về
  const patient = await Patient.create({
    id: userID,
    dia_chi: props.address,
    ma_benh_nhan: patientID,
  });

  console.log("Tao thanh cong patient");

  const token = jwt.sign({ username: props.username }, secrectKey, {
    expiresIn: "1h",
  });

  return {
    token: token,
    ten_dang_nhap: user.ten_dang_nhap,
    phan_loai: user.phan_loai,
    ho_va_ten: user.ho_va_ten,
    avt_url: user.avt_url,
    ma: patient.ma_benh_nhan,
  };
};

exports.getUserDetail = async (ptID) => {
  const userDetail = await Patient.findOne({
    where: { ma_benh_nhan: ptID },
    attributes: {
      exclude: ["tien_su_benh", "nhom_mau", "ma_benh_nhan"],
    },
    include: {
      model: User,
      as: "Nguoi_dung",
      attributes: ["email", "sdt", "ngay_sinh", "gioi_tinh", "ho_va_ten"],
    },
  });

  if (userDetail && userDetail.Nguoi_dung) {
    // Flat the Nguoi_dung object
    const flatUserDetail = {
      ...userDetail.get(), // Get the patient data as an object
      ...userDetail.Nguoi_dung.get(), // Merge user fields with patient fields
    };

    // Remove the Nguoi_dung object as it is now flat
    delete flatUserDetail.Nguoi_dung;

    return flatUserDetail;
  }

  return false;
};

exports.getInsuranceInfo = async (ptID) => {
  const insuranceInfo = await Patient.findOne({
    where: { ma_benh_nhan: ptID },
    attributes: ["tien_su_benh", "nhom_mau"],
    include: {
      model: Insurance,
      as: "Bao_hiem_y_te",
      attributes: {
        exclude: ["ma_benh_nhan"],
      },
    },
  });

  if (insuranceInfo && insuranceInfo.Bao_hiem_y_te) {
    // Flat the Nguoi_dung object
    const flatInsuranceInfo = {
      ...insuranceInfo.get(), // Get the patient data as an object
      ...insuranceInfo.Bao_hiem_y_te.get(), // Merge user fields with patient fields
    };

    // Remove the Nguoi_dung object as it is now flat
    delete flatInsuranceInfo.Bao_hiem_y_te;

    return flatInsuranceInfo;
  }

  return false;
};

exports.updateUserDetail = async (ptID, props) => {
  //update cccd, dan_toc, quoc_tich, dia_chi bên Patient model
  //update email, sdt, ngay_sinh, gioi_tinh, avt_url, ho_va_ten bên User model
  const patient = await Patient.findOne({
    where: { ma_benh_nhan: ptID },
  });

  if (!patient) {
    throw new Error("Không tìm thấy bệnh nhân!");
  }

  const user = await User.findOne({
    where: { id: patient.id },
  });

  if (!user) {
    throw new Error("Không tìm thấy người dùng!");
  }

  // Cập nhật user nếu có dữ liệu mới
  if (props.email) user.email = props.email;
  if (props.sdt) user.sdt = props.sdt;
  if (props.ngay_sinh) user.ngay_sinh = props.ngay_sinh;
  if (props.gioi_tinh) user.gioi_tinh = props.gioi_tinh;
  if (props.avt_url) user.avt_url = props.avt_url;
  if (props.ho_va_ten) user.ho_va_ten = props.ho_va_ten;

  // Cập nhật patient nếu có dữ liệu mới
  if (props.dia_chi) patient.dia_chi = props.dia_chi;
  if (props.dan_toc) patient.dan_toc = props.dan_toc;
  if (props.quoc_tich) patient.quoc_tich = props.quoc_tich;
  if (props.cccd) patient.cccd = props.cccd;

  //save user and patient with promise.all
  await Promise.all([user.save(), patient.save()]);
  return true;
};

exports.updateInsuranceInfo = async (ptID, props) => {
  const patient = await Patient.findOne({
    where: { ma_benh_nhan: ptID },
  });

  if (!patient) {
    throw new Error("Không tìm thấy bệnh nhân!");
  }

  const insurance = await Insurance.findOne({
    where: { ma_benh_nhan: ptID },
  });

  if (!insurance) {
    if (!props.ma_bhyt) {
      throw new Error("Tạo mới cần nhập mã BHYT!");
    }
    // Nếu không tìm thấy bảo hiểm, tạo mới
    const newInsurance = await Insurance.create({
      ma_benh_nhan: ptID,
      ma_bhyt: props.ma_bhyt,
      bv_dang_ky: props.bv_dang_ky,
      ngay_cap: props.ngay_cap,
      ngay_het_han: props.ngay_het_han,
    });
  } else {
    if (props.bv_dang_ky) insurance.so_the_bhyt = props.bv_dang_ky;
    if (props.ngay_cap) insurance.ngay_cap = props.ngay_cap;
    if (props.ngay_het_han) insurance.ngay_het_han = props.ngay_het_han;

    await insurance.save();
  }

  //update patient info
  if (props.tien_su_benh) patient.tien_su_benh = props.tien_su_benh;
  if (props.nhom_mau) patient.nhom_mau = props.nhom_mau;

  await patient.save();
  return true;
};
