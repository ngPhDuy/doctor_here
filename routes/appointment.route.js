const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');
/**
 * @swagger
 * /api/appointment:
 *   get:
 *     summary: Lấy danh sách tất cả các cuộc hẹn
 *     tags: [Appointment]
 *     responses:
 *       200:
 *         description: Danh sách tất cả các cuộc hẹn
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
 *                   van_ban_bo_sung:
 *                     type: string
 *                     example: "Bệnh nhân bị đau đầu và chóng mặt"
 *                   dia_chi_phong_kham:
 *                     type: string
 *                     example: "Phòng khám B, Quận 2"
 *                   trang_thai:
 *                     type: string
 *                     example: "Đang chờ"
 *                   thoi_diem_tao:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T03:00:00.000Z"
 *                   ma_bac_si:
 *                     type: string
 *                     example: "BS0000001"
 *                   ma_benh_nhan_dat_hen:
 *                     type: string
 *                     example: "BN0000006"
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
router.get('/', appointmentController.getAllAppointments);	
/**
 * @swagger
 * /api/appointment/{appointmentID}:
 *   get:
 *     summary: Lấy thông tin chi tiết về cuộc hẹn
 *     tags: [Appointment]
 *     parameters:
 *       - name: appointmentID
 *         in: path
 *         required: true
 *         description: ID của cuộc hẹn
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Thông tin chi tiết về cuộc hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 van_ban_bo_sung:
 *                   type: string
 *                   example: "Bệnh nhân bị đau đầu và chóng mặt"
 *                 dia_chi_phong_kham:
 *                   type: string
 *                   example: "Phòng khám B, Quận 2"
 *                 trang_thai:
 *                   type: string
 *                   example: "Đang chờ"
 *                 thoi_diem_tao:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T03:00:00.000Z"
 *                 ma_bac_si:
 *                   type: string
 *                   example: "BS0000001"
 *                 ma_benh_nhan_dat_hen:
 *                   type: string
 *                   example: "BN0000006"
 *                 Benh_nhan:
 *                   type: object
 *                   properties:
 *                     cccd:
 *                       type: string
 *                       example: "0123456706"
 *                     dan_toc:
 *                       type: string
 *                       example: "Tày"
 *                     diem_he_thong:
 *                       type: integer
 *                       example: 39
 *                     nhom_mau:
 *                       type: string
 *                       example: "AB"
 *                     tien_su_benh:
 *                       type: string
 *                       example: "Tiền sử tiểu đường tuýp 2"
 *                     quoc_tich:
 *                       type: string
 *                       example: "Việt Nam"
 *                     dia_chi:
 *                       type: string
 *                       example: "Số 20, Đường B, Quận 2, TP HCM"
 *                     ma_benh_nhan:
 *                       type: string
 *                       example: "BN0000006"
 *                 Bac_si:
 *                   type: object
 *                   properties:
 *                     ngay_vao_nghe:
 *                       type: string
 *                       format: date
 *                       example: "2010-09-22"
 *                     trinh_do_hoc_van:
 *                       type: string
 *                       example: "Thạc sĩ Y học"
 *                     mo_ta:
 *                       type: string
 *                       example: "Được bệnh nhân đánh giá cao"
 *                     dia_chi_pk:
 *                       type: string
 *                       example: "Phòng khám B, Quận 2"
 *                     ma_bac_si:
 *                       type: string
 *                       example: "BS0000001"
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
router.get('/:appointmentID', appointmentController.getAllAppointmentByID);

module.exports = router;