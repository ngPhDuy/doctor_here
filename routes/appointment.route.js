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
 *                 id_gio_hen:
 *                   type: integer
 *                   example: 50
 *                 Benh_nhan:
 *                   type: object
 *                   properties:
 *                     cccd:
 *                       type: string
 *                       example: "0123456706"
 *                     dan_toc:
 *                       type: string
 *                       example: "Tày"
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
 *                     Nguoi_dung:
 *                       type: object
 *                       properties:
 *                         ten_dang_nhap:
 *                           type: string
 *                           example: "nguoidung1"
 *                         email:
 *                           type: string
 *                           example: "nguoidung1@example.com"
 *                         sdt:
 *                           type: string
 *                           example: "0123456888"
 *                         ngay_sinh:
 *                           type: string
 *                           format: date
 *                           example: "1995-01-15"
 *                         gioi_tinh:
 *                           type: string
 *                           example: "Nữ"
 *                         phan_loai:
 *                           type: string
 *                           example: "bn"
 *                         ho_va_ten:
 *                           type: string
 *                           example: "Nguyễn Thị Hiền"
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
 *                     chuyen_khoa:
 *                       type: string
 *                       example: "Nhi khoa"
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
/**
 * @swagger
 * /api/appointment/getAllByDoctorID:
 *   get:
 *     summary: Lấy tất cả các cuộc hẹn của bác sĩ theo mã bác sĩ
 *     description: API này trả về tất cả các cuộc hẹn của bác sĩ, bao gồm thông tin bệnh nhân, giờ hẹn, và tình trạng làm việc online của bác sĩ.
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: query
 *         name: doctorID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bác sĩ cần lấy cuộc hẹn
 *         example: 'BS0000001'
 *     responses:
 *       200:
 *         description: Danh sách các cuộc hẹn của bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Mã cuộc hẹn
 *                   van_ban_bo_sung:
 *                     type: string
 *                     description: Thông tin bổ sung của bệnh nhân
 *                   dia_chi_phong_kham:
 *                     type: string
 *                     description: Địa chỉ phòng khám
 *                   trang_thai:
 *                     type: string
 *                     description: Tình trạng cuộc hẹn (Đang chờ, Đã xác nhận, v.v.)
 *                   thoi_diem_tao:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian tạo cuộc hẹn
 *                   ma_bac_si:
 *                     type: string
 *                     description: Mã bác sĩ
 *                   ma_benh_nhan_dat_hen:
 *                     type: string
 *                     description: Mã bệnh nhân đã đặt hẹn
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Mã giờ hẹn
 *                       Ca_lam_viec_trong_tuan:
 *                         type: object
 *                         properties:
 *                           lam_viec_onl:
 *                             type: boolean
 *                             description: Thông tin bác sĩ làm việc online hay không
 *                             example: true
 *                   Benh_nhan:
 *                     type: object
 *                     properties:
 *                       ma_benh_nhan:
 *                         type: string
 *                         description: Mã bệnh nhân
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ho_va_ten:
 *                             type: string
 *                             description: Họ và tên bệnh nhân
 *                             example: 'Nguyễn Thị Hiền'
 *                           gioi_tinh:
 *                             type: string
 *                             description: Giới tính của bệnh nhân
 *                             example: 'Nữ'
 *       500:
 *         description: Lỗi khi lấy danh sách cuộc hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra: <lỗi cụ thể>"
 */
router.get('/getAllByDoctorID', appointmentController.getAllByDoctorID);
/**
 * @swagger
 * /api/appointment/getAllByPatientAndDoctor:
 *   get:
 *     summary: Lấy tất cả các cuộc hẹn của bệnh nhân với bác sĩ
 *     description: API này trả về danh sách tất cả các cuộc hẹn giữa bệnh nhân và bác sĩ, bao gồm thông tin chi tiết cuộc hẹn và giờ hẹn làm việc online.
 *     tags:
 *       - Appointment
 *     parameters:
 *       - name: patientID
 *         in: query
 *         required: true
 *         description: Mã bệnh nhân
 *         schema:
 *           type: string
 *         example: 'BN0000006'
 *       - name: doctorID
 *         in: query
 *         required: true
 *         description: Mã bác sĩ
 *         schema:
 *           type: string
 *         example: 'BS0000001'
 *     responses:
 *       200:
 *         description: Danh sách các cuộc hẹn của bệnh nhân với bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: Mã cuộc hẹn
 *                   van_ban_bo_sung:
 *                     type: string
 *                     description: Thông tin bổ sung về bệnh nhân
 *                   dia_chi_phong_kham:
 *                     type: string
 *                     description: Địa chỉ phòng khám
 *                   trang_thai:
 *                     type: string
 *                     description: Tình trạng cuộc hẹn
 *                   thoi_diem_tao:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian tạo cuộc hẹn
 *                   ma_bac_si:
 *                     type: string
 *                     description: Mã bác sĩ
 *                   ma_benh_nhan_dat_hen:
 *                     type: string
 *                     description: Mã bệnh nhân đã đặt hẹn
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: Mã giờ hẹn
 *                       Ca_lam_viec_trong_tuan:
 *                         type: object
 *                         properties:
 *                           lam_viec_onl:
 *                             type: boolean
 *                             description: Thông tin bác sĩ làm việc online hay không
 *                             example: true
 *       500:
 *         description: Lỗi khi lấy danh sách cuộc hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra: <lỗi cụ thể>"
 */
router.get('/getAllByPatientAndDoctor', appointmentController.getAllByPatientAndDoctor);
/**
 * @swagger
 * /updateStatus:
 *   post:
 *     summary: Cập nhật trạng thái cuộc hẹn
 *     description: API này cho phép cập nhật trạng thái của cuộc hẹn. Trạng thái bao gồm Đang chờ, Hoàn thành, Đã hủy.
 *     tags:
 *       - Appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appointmentID:
 *                 type: integer
 *                 description: ID của cuộc hẹn cần cập nhật
 *                 example: 1
 *               status:
 *                 type: string
 *                 description: Trạng thái mới của cuộc hẹn.
 *                 example: "Đang chờ"
 *             required:
 *              - appointmentID
 *              - status
 *     responses:
 *       200:
 *         description: Trạng thái cuộc hẹn đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật thành công 1 với Đang chờ"
 *       500:
 *         description: Lỗi khi cập nhật trạng thái cuộc hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra: <lỗi cụ thể>"
 */
router.post('/updateStatus', appointmentController.updateAppointmentStatus);
module.exports = router;