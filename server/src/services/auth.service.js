const { Account, User, Admin, Doctor, Patient } = require("../models");
const bcryptjs = require("bcryptjs");

exports.login = async (username, password) => {
  const account = await Account.findOne({
    where: { ten_dang_nhap: `${username}` },
  });

  if (!account) {
    throw new Error("Tài khoản hoặc mật khẩu không đúng");
  }

  const match = await bcryptjs.compare(password, account.mat_khau);
  if (!match) {
    throw new Error("Tài khoản hoặc mật khẩu không đúng");
  }

  if (account.active === false) {
    throw new Error("Tài khoản đã bị khóa");
  }

  const user = await User.findOne({
    where: { ten_dang_nhap: `${username}` },
  });

  if (!user) {
    return null;
  }

  let temp_id = null;

  if (user.phan_loai === "qtv") {
    const qtv = await Admin.findOne({
      where: { id: `${user.id}` },
    });

    temp_id = qtv.ma_qtv;
  } else if (user.phan_loai === "bs") {
    const bs = await Doctor.findOne({
      where: { id: `${user.id}` },
    });

    temp_id = bs.ma_bac_si;
  } else {
    const bn = await Patient.findOne({
      where: { id: `${user.id}` },
    });

    temp_id = bn.ma_benh_nhan;
  }

  return {
    ten_dang_nhap: account.ten_dang_nhap,
    phan_loai: user.phan_loai,
    ho_va_ten: user.ho_va_ten,
    avt_url: user.avt_url,
    ma: temp_id,
  };
};
