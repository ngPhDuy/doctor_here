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
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Bạn cần đăng nhập!" });
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, secrectKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Token không hợp lệ!" });
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Bạn cần đăng nhập!" });
  }
};
