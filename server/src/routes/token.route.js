const express = require("express");
const router = express.Router();
const controller = require("../controllers/token.controller.js");

/**
 * @swagger
 * /api/token/user/{userID}/device/{deviceID}:
 *   get:
 *     summary: Lấy token thông báo của người dùng theo thiết bị
 *     tags:
 *       - Notification Token
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *           example: BN0000007
 *       - in: path
 *         name: deviceID
 *         required: true
 *         schema:
 *           type: string
 *           example: "iphone1"
 *         description: Tên hoặc ID của thiết bị
 *     responses:
 *       200:
 *         description: Lấy token thành công
 *         content:
 *           application/json:
 *             example:
 *               id: 4
 *               token: "10"
 *               thiet_bi: "iphone1"
 *               id_nguoi_dung: 7
 *       404:
 *         description: Không tìm thấy token tương ứng với người dùng và thiết bị
 *       500:
 *         description: Lỗi server
 */

router.get("/user/:userID", controller.getTokenByUserAndDevice);

/**
 * @swagger
 * /api/token/user/{userID}:
 *   post:
 *     summary: Lưu token thông báo đẩy cho thiết bị của người dùng
 *     tags:
 *       - Notification Token
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *           example: BN0000007
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: "10"
 *                 description: Mã token dùng cho thông báo đẩy (push notification)
 *     responses:
 *       200:
 *         description: Token đã được lưu thành công
 *         content:
 *           application/json:
 *             example:
 *               id: 4
 *               token: "10"
 *               thiet_bi: "iphone1"
 *               id_nguoi_dung: 7
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ hoặc thiếu token
 *       500:
 *         description: Lỗi server
 */
router.post("/user/:userID", controller.createTokenByUserAndDevice);

module.exports = router;
