const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating.controller');

/**
 * @swagger
 * /api/rating/getAllByDoctorID:
 *   get:
 *     summary: Lấy danh sách đánh giá của bác sĩ
 *     tags: [Rating]
 *     parameters:
 *       - name: doctorID
 *         in: query
 *         required: true
 *         description: Mã bác sĩ cần lấy danh sách đánh giá
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách đánh giá của bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   diem_danh_gia:
 *                     type: string
 *                     example: "5"
 *                   noi_dung:
 *                     type: string
 *                     example: "Bác sĩ rất tận tâm và nhiệt tình."
 *                   thoi_diem:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-16T10:30:00.000Z"
 *                   id_cuoc_hen:
 *                     type: integer
 *                     example: 12
 *                   ma_benh_nhan_danh_gia:
 *                     type: string
 *                     example: "BN000001"
 *                   Cuoc_hen:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                   Benh_nhan:
 *                     type: object
 *                     properties:
 *                       ma_benh_nhan:
 *                          type: string
 *                          example: "BN000001"
 *                   Nguoi_dung:
 *                     type: object
 *                     properties:
 *                      ho_va_ten:
 *                          type: string
 *                          example: "Nguyễn Văn A"
 *       400:
 *         description: Thiếu tham số doctorID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thiếu tham số doctorID"
 *       500:
 *         description: Lỗi máy chủ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get('/getAllByDoctorID', ratingController.getAllRatingsByDoctorID);

module.exports = router;