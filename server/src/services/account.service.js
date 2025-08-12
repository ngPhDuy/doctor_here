const { Account } = require("../models");
const bcryptjs = require("bcryptjs");

const { generateRandomPassword } = require("../middleware/randomPassGen");
const { sendEmail } = require("./emailServices");

exports.changePassword = async (username, password, newPassword) => {
  const account = await Account.findOne({
    where: {
      ten_dang_nhap: username,
    },
  });
  if (!account) {
    return false;
  }
  const match = await bcryptjs.compare(password, account.mat_khau);
  if (!match) {
    return false;
  }
  newPassword = await bcryptjs.hash(newPassword, 10);
  account.mat_khau = newPassword;
  await account.save();
  return true;
};

exports.toggleActive = async (username) => {
  const account = await Account.findOne({
    where: {
      ten_dang_nhap: username,
    },
  });
  if (!account) {
    return false;
  }
  account.active = !account.active;
  await account.save();
  return {
    result: true,
    new_active: account.active,
  };
};

exports.changePasswordFromAdmin = async (username, newPassword) => {
  const account = await Account.findOne({
    where: {
      ten_dang_nhap: username,
    },
  });
  if (!account) {
    return false;
  }
  newPassword = await bcryptjs.hash(newPassword, 10);
  account.mat_khau = newPassword;
  await account.save();
  return true;
};

exports.resetPassword = async (username) => {
  const account = await Account.findOne({
    where: {
      ten_dang_nhap: username,
    },
  });
  if (!account) {
    return false;
  }
  //Tạo random password: 5 ký tự a-zA-z0-9
  const randomPassword = generateRandomPassword();
  const newPassword = await bcryptjs.hash(randomPassword, 10);
  account.mat_khau = newPassword;
  await account.save();
  sendEmail("tkshiha2003@gmail.com", username, randomPassword);
  return true;
};

exports.createOne = async (username, password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new Error("Mật khẩu không khớp");
  }

  const account = await Account.findOne({
    where: {
      ten_dang_nhap: username,
    },
  });

  if (account) {
    throw new Error("Tài khoản đã tồn tại");
  }

  const hashedPassword = await bcryptjs.hash(password, 10);

  const newAccount = await Account.create({
    ten_dang_nhap: username,
    mat_khau: hashedPassword,
    active: true,
    thoi_diem_mo_tk: new Date(),
  });

  return newAccount.id;
};
