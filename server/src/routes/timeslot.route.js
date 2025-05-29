const express = require("express");
const router = express.Router();
const controller = require("../controllers/timeslot.controller.js");
const authMiddleware = require("../middleware/auth.middleware");
/**
 * @swagger
 * /api/timeslot:
 *   get:
 *     summary: Lấy danh sách khung giờ làm việc của bác sĩ
 *     description: API này trả về danh sách các khung giờ bác sĩ có thể nhận lịch hẹn dựa trên khoảng thời gian yêu cầu.
 *     tags:
 *       - Timeslot
 *     parameters:
 *       - in: query
 *         name: drID
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã định danh của bác sĩ
 *       - in: query
 *         name: startTime
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Thời điểm bắt đầu tìm kiếm khung giờ (ISO 8601)
 *         example: "2025-03-24T07:00:00"
 *       - in: query
 *         name: endTime
 *         schema:
 *           type: string
 *           format: date-time
 *         required: true
 *         description: Thời điểm kết thúc tìm kiếm khung giờ (ISO 8601)
 *         example: "2025-03-25T20:00:00"
 *       - in: query
 *         name: isOnlMethod
 *         schema:
 *           type: boolean
 *         required: true
 *         description: Phương thức khám có phải là trực tuyến không
 *     responses:
 *       200:
 *         description: Danh sách khung giờ làm việc của bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thu:
 *                     type: string
 *                     description: Ngày trong tuần
 *                   ngay_lam_viec:
 *                     type: string
 *                     format: date
 *                     description: Ngày làm việc của bác sĩ
 *                   gio_hen:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           description: ID của khung giờ
 *                         thoi_diem_bat_dau:
 *                           type: string
 *                           description: Thời điểm bắt đầu của khung giờ
 *                           example: "16:45:00 24/3/2025"
 *                         thoi_diem_ket_thuc:
 *                           type: string
 *                           description: Thời điểm kết thúc của khung giờ
 *                           example: "17:00:00 24/3/2025"
 *       400:
 *         description: Thông tin đầu vào không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get("/", controller.getTimeslots);

module.exports = router;
