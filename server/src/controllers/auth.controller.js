const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");
const secrectKey = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const rs = await authService.login(username, password);

    // Tạo token
    const token = jwt.sign({ username: username }, secrectKey, {
      expiresIn: "1h",
    });
    console.log(token);

    if (!rs) {
      return res.status(302).json({
        message: "Người dùng chưa có thông tin, chuyển hướng tạo mới",
      });
    }

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      role: rs.phan_loai,
      fullName: rs.ho_va_ten,
      avtUrl: rs.avt_url,
      id: rs.ma,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Không thể đăng xuất!" });
    }
    res.status(200).json({ message: "Đăng xuất thành công!" });
  });
};
