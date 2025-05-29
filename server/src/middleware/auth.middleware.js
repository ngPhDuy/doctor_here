const jwt = require("jsonwebtoken");
const secrectKey = process.env.SECRET_KEY;

exports.protect = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Bạn cần đăng nhập!" });
  }
  next();
};

exports.authenticated = (req, res, next) => {
  //Lấy token từ header
  const token = req.headers.authorization.split(" ")[1];

  console.log("Received token:", token); // Log token nhận được từ client

  if (!token) {
    return res.status(401).json({ message: "Bạn cần đăng nhập!" });
  }

  try {
    const decoded = jwt.verify(token, secrectKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};
