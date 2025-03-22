const jwt = require("jsonwebtoken");
const authService = require("../services/auth.service");
const secrectKey = process.env.SECRET_KEY;

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username, password);
    const rs = await authService.login(username, password);
    let role = rs.phan_loai;

    // Tạo token
    const token = jwt.sign({ username: rs.ten_dang_nhap }, secrectKey, {
      expiresIn: "1h",
    });
    console.log(token);

    res.status(200).json({
      message: "Đăng nhập thành công!",
      token: token,
      role: role,
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
