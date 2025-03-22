const { Account, User } = require("../models");
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

  return {
    ten_dang_nhap: account.ten_dang_nhap,
    phan_loai: user.phan_loai,
  };
};
