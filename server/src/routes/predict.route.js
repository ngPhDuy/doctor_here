const express = require("express");
const router = express.Router();
const controller = require("../controllers/predict.controller");

/**
 * @swagger
 * /api/predict/diabetes/{ptID}:
 *   post:
 *     summary: Dự đoán nguy cơ mắc bệnh tiểu đường dựa trên dữ liệu cá nhân.
 *     tags:
 *       - Predict
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000007
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - smoking_history
 *               - HbA1c_level
 *             properties:
 *               smoking_history:
 *                 type: string
 *                 enum: [never, former, current, ever, not current, No Info]
 *                 description: Tiền sử hút thuốc của bệnh nhân
 *               HbA1c_level:
 *                 type: number
 *                 format: float
 *                 description: Chỉ số HbA1c
 *             example:
 *               smoking_history: "current"
 *               HbA1c_level: 6.6
 *     responses:
 *       200:
 *         description: Kết quả dự đoán thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *               enum: [0, 1]
 *               description: 0 = Không mắc tiểu đường, 1 = Có nguy cơ mắc tiểu đường
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi hệ thống khi xử lý yêu cầu
 */
router.post("/diabetes/:ptID", controller.predictDiabetes);

module.exports = router;
