const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/rating.controller");

/**
 * @swagger
 * /api/rating/doctor/{drID}:
 *   get:
 *     summary: Lấy danh sách đánh giá của bác sĩ
 *     description: API này trả về danh sách các đánh giá từ bệnh nhân cho một bác sĩ cụ thể, kèm theo điểm trung bình.
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
 *         description: Trả về danh sách đánh giá của bác sĩ và điểm trung bình
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 averageRating:
 *                   type: number
 *                   format: float
 *                   example: 4.56
 *                   description: Điểm đánh giá trung bình của bác sĩ
 *                 ratings:
 *                   type: array
 *                   description: Danh sách các đánh giá
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 11
 *                         description: ID của đánh giá
 *                       diem_danh_gia:
 *                         type: integer
 *                         example: 4
 *                         description: Điểm đánh giá (thang điểm từ 1-5)
 *                       noi_dung:
 *                         type: string
 *                         example: "Đã khám nhiều lần ở đây"
 *                         description: Nội dung đánh giá
 *                       thoi_diem:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-31T07:19:06.614Z"
 *                         description: Thời điểm đánh giá được tạo
 *                       id_cuoc_hen:
 *                         type: integer
 *                         example: 19
 *                         description: ID của cuộc hẹn liên quan đến đánh giá này
 *                       ma_bac_si:
 *                         type: string
 *                         example: "BS0000001"
 *                         description: Mã bác sĩ được đánh giá
 *                       Benh_nhan:
 *                         type: object
 *                         description: Thông tin bệnh nhân đã đánh giá
 *                         properties:
 *                           ma_benh_nhan:
 *                             type: string
 *                             example: "BN0000009"
 *                             description: Mã bệnh nhân đã đánh giá
 *                           Nguoi_dung:
 *                             type: object
 *                             properties:
 *                               ho_va_ten:
 *                                 type: string
 *                                 example: "Nguyễn Dũng Dinh"
 *                                 description: Họ và tên bệnh nhân
 *                               avt_url:
 *                                 type: string
 *                                 example: "https://res.cloudinary.com/dpquv4bcu/image/upload/v1743839969/nd4_uhqcag.jpg"
 *                                 description: Ảnh đại diện bệnh nhân
 *                       Binh_luan:
 *                         type: array
 *                         description: Danh sách phản hồi từ bác sĩ cho đánh giá này
 *                         items:
 *                           type: object
 *                           properties:
 *                             noi_dung:
 *                               type: string
 *                               example: "Cảm ơn bạn đã phản hồi!"
 *                               description: Nội dung phản hồi của bác sĩ
 *                             thoi_diem:
 *                               type: string
 *                               format: date-time
 *                               example: "2025-04-13T14:31:02.635Z"
 *                               description: Thời điểm phản hồi được tạo
 *       404:
 *         description: Không tìm thấy đánh giá nào cho bác sĩ này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/doctor/:drID", ratingController.getAllRatingsByDoctorID);

router.get("/appointment/:appID", ratingController.getRatingByAppointmentID);

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

/**
 * @swagger
 * /api/comment:
 *   post:
 *     summary: Bác sĩ tạo bình luận cho đánh giá của bệnh nhân
 *     tags:
 *       - Rating
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: Cảm ơn bạn đã phản hồi. Tôi sẽ cố gắng cải thiện hơn nữa.
 *               drID:
 *                 type: integer
 *                 example: 123
 *               ratingID:
 *                 type: integer
 *                 example: 456
 *     responses:
 *       200:
 *         description: Bình luận đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 789
 *                 noi_dung:
 *                   type: string
 *                   example: Cảm ơn bạn đã phản hồi. Tôi sẽ cố gắng cải thiện hơn nữa.
 *                 thoi_diem:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-04-13T10:15:30.000Z
 *                 id_danh_gia:
 *                   type: integer
 *                   example: 456
 *                 ma_bac_si_binh_luan:
 *                   type: integer
 *                   example: 123
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       500:
 *         description: Lỗi khi tạo bình luận
 */
router.post("/comment", ratingController.createComment);

module.exports = router;
