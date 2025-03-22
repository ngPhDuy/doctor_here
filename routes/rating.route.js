const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

/**
 * @swagger
 * /api/rating/doctor/{drID}:
 *   get:
 *     summary: Lấy danh sách đánh giá của bác sĩ
 *     description: API này trả về danh sách các đánh giá từ bệnh nhân cho một bác sĩ cụ thể.
 *     tags:
 *       - Rating
 *     parameters:
 *       - in: path
 *         name: drID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bác sĩ cần lấy danh sách đánh giá
 *         example: "BS0000001"
 *     responses:
 *       200:
 *         description: Trả về danh sách đánh giá của bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 5
 *                     description: ID của đánh giá
 *                   diem_danh_gia:
 *                     type: integer
 *                     example: 3
 *                     description: Điểm đánh giá (thang điểm từ 1-5)
 *                   noi_dung:
 *                     type: string
 *                     example: "Hello bác sĩ"
 *                     description: Nội dung đánh giá
 *                   thoi_diem:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-17T05:22:19.121Z"
 *                     description: Thời điểm đánh giá được tạo
 *                   id_cuoc_hen:
 *                     type: integer
 *                     example: 2
 *                     description: ID của cuộc hẹn liên quan đến đánh giá này
 *                   Benh_nhan:
 *                     type: object
 *                     properties:
 *                       ma_benh_nhan:
 *                         type: string
 *                         example: "BN0000006"
 *                         description: Mã bệnh nhân đã đưa ra đánh giá
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ho_va_ten:
 *                             type: string
 *                             example: "Nguyễn Thị Hiền"
 *                             description: Họ và tên bệnh nhân đánh giá
 *                           avt_url:
 *                             type: string
 *                             example: "https://imgur.com/avt.jpg"
 *       404:
 *         description: Không tìm thấy đánh giá nào cho bác sĩ này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/doctor/:drID", ratingController.getAllRatingsByDoctorID);

/**
 * @swagger
 * /api/rating:
 *   post:
 *     summary: Tạo mới một đánh giá cho bác sĩ
 *     description: API này cho phép bệnh nhân gửi đánh giá về cuộc hẹn với bác sĩ.
 *     tags:
 *       - Rating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               diem_danh_gia:
 *                 type: integer
 *                 example: 3
 *                 description: Điểm đánh giá (thang điểm từ 1-5)
 *               noi_dung:
 *                 type: string
 *                 example: "Hello bác sĩ"
 *                 description: Nội dung đánh giá của bệnh nhân
 *               id_cuoc_hen:
 *                 type: integer
 *                 example: 2
 *                 description: ID của cuộc hẹn liên quan đến đánh giá này
 *               ma_benh_nhan_danh_gia:
 *                 type: string
 *                 example: "BN0000006"
 *                 description: Mã bệnh nhân gửi đánh giá
 *     responses:
 *       200:
 *         description: Đánh giá được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                   description: ID của đánh giá vừa được tạo
 *                 diem_danh_gia:
 *                   type: integer
 *                   example: 3
 *                   description: Điểm đánh giá (thang điểm từ 1-5)
 *                 noi_dung:
 *                   type: string
 *                   example: "Hello bác sĩ"
 *                   description: Nội dung đánh giá
 *                 id_cuoc_hen:
 *                   type: integer
 *                   example: 2
 *                   description: ID của cuộc hẹn được đánh giá
 *                 ma_benh_nhan_danh_gia:
 *                   type: string
 *                   example: "BN0000006"
 *                   description: Mã bệnh nhân đã đánh giá
 *                 thoi_diem:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-17T05:22:19.121Z"
 *                   description: Thời điểm đánh giá được tạo
 *       400:
 *         description: Yêu cầu không hợp lệ (thiếu thông tin cần thiết hoặc dữ liệu không đúng định dạng)
 *       500:
 *         description: Lỗi máy chủ
 */
router.post("/", ratingController.createRating);

module.exports = router;
