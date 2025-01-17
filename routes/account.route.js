const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

//swagger comment
/**
 * @swagger
 * /api/account/change_password:
 *   post:
 *     summary: Đổi mật khẩu tài khoản
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "user123"
 *               oldPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *        description: Đổi mật khẩu thất bại
 */
router.post('/change_password', accountController.changePassword);
/**
 * @swagger
 * /api/account/toggle_active:
 *   post:
 *     summary: Thay đổi trạng thái kích hoạt tài khoản
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên đăng nhập của tài khoản cần thay đổi trạng thái.
 *                 example: "user123"
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thay đổi trạng thái thành công!"
 *                 new_active:
 *                   type: boolean
 *                   description: Trạng thái kích hoạt mới của tài khoản.
 *                   example: true
 *       400:
 *         description: Thay đổi trạng thái thất bại (tài khoản không tồn tại hoặc lỗi xảy ra).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thay đổi trạng thái thất bại!"
 */

router.post('/toggle_active', accountController.toggleActive);
module.exports = router;