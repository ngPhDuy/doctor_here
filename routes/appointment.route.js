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
 * /api/appointment/detail:
 *   get:
 *     summary: Lấy thông tin chi tiết về cuộc hẹn
 *     tags: [Appointment]
 *     parameters:
 *       - name: appointmentID
 *         in: query
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
router.get('/detail', appointmentController.getAllAppointmentByID);
/**
 * @swagger
 * /api/appointment/countAppointmentByMethod:
 *   get:
 *     summary: Lấy số lượng cuộc hẹn theo trạng thái
 *     tags: [Appointment]
 *     parameters:
 *       - name: onlMethod
 *         in: query
 *         required: true
 *         description: Phương thức hẹn trực tuyến hay không
 *         schema:
 *           type: boolean
 *       - name: doctorID
 *         in: query
 *         required: true
 *         description: Mã bác sĩ
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Số lượng cuộc hẹn theo trạng thái
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  count:
 *                      type: integer
 *                      example: 10
 *       500:
 *        description: Lỗi máy chủ
 *        content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                      type: string
 *                      example: "Internal server error"
 */
router.get('/countAppointmentByMethod', appointmentController.countAppointmentByMethod);
/**
 * @swagger
 * /api/appointment/getAppointmentSchedule:
 *   get:
 *     summary: Lấy thông tin các lịch hẹn sắp diễn ra trong tuần
 *     tags: [Appointment]
 *     parameters:
 *       - name: startDate
 *         in: query
 *         required: true
 *         description: Ngày bắt đầu trong tuần
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         required: true
 *         description: Ngày kết thúc trong tuần
 *         schema:
 *           type: string
 *           format: date
 *       - name: doctorID
 *         in: query
 *         required: true
 *         description: Mã bác sĩ
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách các lịch hẹn sắp diễn ra trong tuần
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
 *                   dia_chi_phong_kham:
 *                     type: string
 *                     example: "Phòng khám B, Quận 2"
 *                   thoi_diem_tao:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-01-01T03:00:00.000Z"
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       thoi_diem_bat_dau:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-02T02:15:00.000Z"
 *                       thoi_diem_ket_thuc:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-02T02:30:00.000Z"
 *                       ngay_lam_viec:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-02"
 *                   Benh_nhan:
 *                     type: object
 *                     properties:
 *                       ma_benh_nhan:
 *                         type: string
 *                         example: "BN0000006"
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           gioi_tinh:
 *                             type: string
 *                             example: "Nữ"
 *                           ho_va_ten:
 *                             type: string
 *                             example: "Nguyễn Thị Hiền"
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
router.get('/getAppointmentSchedule', appointmentController.getAppointmentSchedule);

module.exports = router;