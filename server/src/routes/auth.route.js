const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập vào hệ thống
 *     description: API cho phép người dùng đăng nhập vào hệ thống bằng tên đăng nhập và mật khẩu
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên đăng nhập của người dùng
 *                 example: nguoidung1
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mật khẩu của người dùng
 *                 example: mat_khau_123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo kết quả
 *                   example: Đăng nhập thành công!
 *                 token:
 *                   type: string
 *                   description: JWT token để xác thực người dùng trong các yêu cầu tiếp theo
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5ndW9pZHVuZzEiLCJpYXQiOjE3NDM3ODAwMTEsImV4cCI6MTc0Mzc4MzYxMX0.vBekXRyLjT0UNb276rJebugHaSPcrtSu6uJRdnqTvoM
 *                 role:
 *                   type: string
 *                   description: Phân loại người dùng (bn - bệnh nhân, bs - bác sĩ, qtv - quản trị viên)
 *                   example: bn
 *                 fullName:
 *                   type: string
 *                   description: Họ và tên đầy đủ của người dùng
 *                   example: Nguyễn Thị Hiền
 *                 avtUrl:
 *                   type: string
 *                   nullable: true
 *                   description: Đường dẫn đến ảnh đại diện (có thể null)
 *                   example: null
 *                 id:
 *                   type: string
 *                   description: Mã định danh của người dùng
 *                   example: BN0000006
 *       400:
 *         description: Đăng nhập thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: Tên đăng nhập hoặc mật khẩu không chính xác!
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: Đã xảy ra lỗi trong quá trình đăng nhập!
 */
router.post("/login", authController.login);
/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng xuất thành công!
 *       500:
 *         description: Đăng xuất không thành công do lỗi server.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Không thể đăng xuất!
 */
router.get("/logout", authController.logout);
router.get("/protected", authMiddleware.protect, (req, res) => {
  res.status(200).json({
    message: "Bạn đã truy cập vào route được bảo vệ!",
    user: req.session.user,
  });
});

module.exports = router;
