const express = require("express");
const router = express.Router();
const accountController = require("../controllers/account.controller");

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
router.post("/change_password", accountController.changePassword);
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
router.post("/toggle_active", accountController.toggleActive);
/**
 * @swagger
 * /api/account/change_password_from_admin:
 *   post:
 *     summary: Đổi mật khẩu tài khoản từ admin
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
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *       400:
 *         description: Đổi mật khẩu thất bại
 */
router.post(
  "/change_password_from_admin",
  accountController.changePasswordFromAdmin
);
/**
 * @swagger
 * /api/account/create:
 *   post:
 *     summary: Tạo tài khoản mới
 *     description: Tạo tài khoản mới với tên đăng nhập và mật khẩu.
 *     tags:
 *       - Account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username for the new account
 *                 example: john_doe
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the new account
 *                 example: strongPassword123
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Password confirmation (must match password)
 *                 example: strongPassword123
 *     responses:
 *       200:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo tài khoản thành công!
 *       400:
 *         description: Failed to create account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tạo tài khoản thất bại!
 */
router.post("/create", accountController.createOne);
router.post("/reset_password", accountController.resetPassword);
module.exports = router;
