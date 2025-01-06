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

module.exports = router;