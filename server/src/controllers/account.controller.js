const accountService = require("../services/account.service");

exports.changePassword = async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  console.log(username, oldPassword, newPassword);
  let result = await accountService.changePassword(
    username,
    oldPassword,
    newPassword
  );
  if (result) {
    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } else {
    res.status(400).json({ message: "Đổi mật khẩu thất bại!" });
  }
};

exports.toggleActive = async (req, res) => {
  const { username } = req.body;
  let result = await accountService.toggleActive(username);
  if (result.result) {
    res.status(200).json({
      message: "Thay đổi trạng thái thành công!",
      new_active: result.new_active,
    });
  } else {
    res.status(400).json({ message: "Thay đổi trạng thái thất bại!" });
  }
};

exports.changePasswordFromAdmin = async (req, res) => {
  const { username, newPassword } = req.body;
  let result = await accountService.changePasswordFromAdmin(
    username,
    newPassword
  );
  if (result) {
    res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } else {
    res.status(400).json({ message: "Đổi mật khẩu thất bại!" });
  }
};

exports.resetPassword = async (req, res) => {
  const { username } = req.body;
  console.log(username);
  try {
    let result = await accountService.resetPassword(username);
    if (result) {
      res.status(200).json({ message: "Reset mật khẩu thành công!" });
    } else {
      res.status(400).json({ message: "Reset mật khẩu thất bại!" });
    }
  } catch (e) {
    res.status(400).json({ message: "Reset mật khẩu thất bại!" });
  }
};

exports.createOne = async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  try {
    const userId = await accountService.createOne(username, password, confirmPassword);
    res.status(200).json({
      message: "Tạo tài khoản thành công!",
      userId: userId
    });
  } catch (e) {
    res.status(400).json({ message: e.message || "Tạo tài khoản thất bại!" });
  }
};
