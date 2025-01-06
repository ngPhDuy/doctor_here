const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên đăng nhập của người dùng.
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 description: Mật khẩu của người dùng.
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Đăng nhập thành công!
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: johndoe
 *       400:
 *         description: Đăng nhập thất bại.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sai tên đăng nhập hoặc mật khẩu.
 */

router.post('/login', authController.login);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
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

router.post('/logout', authController.logout);
router.get('/protected', authMiddleware.protect, (req, res) => {
    res.status(200).json({ message: 'Bạn đã truy cập vào route được bảo vệ!', user: req.session.user });
});

module.exports = router;