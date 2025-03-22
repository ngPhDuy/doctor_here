const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointment.controller");
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
router.get("/", appointmentController.getAllAppointments);
/**
 * @swagger
 * /appointments/detail/{id}:
 *   get:
 *     summary: Lấy chi tiết cuộc hẹn theo ID
 *     description: API này trả về thông tin chi tiết của một cuộc hẹn, bao gồm thông tin bệnh nhân, bác sĩ, giờ hẹn và các hình ảnh bổ sung.
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cuộc hẹn cần lấy thông tin chi tiết
 *         example: 1
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết cuộc hẹn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: ID của cuộc hẹn
 *                 van_ban_bo_sung:
 *                   type: string
 *                   example: "Bệnh nhân bị đau đầu và chóng mặt"
 *                   description: Ghi chú thêm về cuộc hẹn
 *                 dia_chi_phong_kham:
 *                   type: string
 *                   example: "Phòng khám B, Quận 2"
 *                   description: Địa chỉ phòng khám
 *                 trang_thai:
 *                   type: string
 *                   example: "Hoàn thành"
 *                   description: Trạng thái cuộc hẹn (Đang chờ, Hoàn thành, Đã hủy)
 *                 thoi_diem_tao:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-01-01T03:00:00.000Z"
 *                   description: Thời điểm tạo cuộc hẹn
 *                 ma_bac_si:
 *                   type: string
 *                   example: "BS0000001"
 *                   description: Mã bác sĩ
 *                 ma_benh_nhan_dat_hen:
 *                   type: string
 *                   example: "BN0000006"
 *                   description: Mã bệnh nhân đặt hẹn
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
 *                     Nguoi_dung:
 *                       type: object
 *                       properties:
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
 *                         ho_va_ten:
 *                           type: string
 *                           example: "Nguyễn Thị Hiền"
 *                         avt_url:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                 Bac_si:
 *                   type: object
 *                   properties:
 *                     ngay_vao_nghe:
 *                       type: string
 *                       format: date
 *                       example: "2010-09-22"
 *                     trinh_do_hoc_van:
 *                       type: string
 *                       example: "trình độ mới 5"
 *                     mo_ta:
 *                       type: string
 *                       example: "Được bệnh nhân đánh giá cao"
 *                     dia_chi_pk:
 *                       type: string
 *                       example: "địa chỉ mới 5"
 *                     ma_bac_si:
 *                       type: string
 *                       example: "BS0000001"
 *                     chuyen_khoa:
 *                       type: string
 *                       example: "Nội tổng quát"
 *                     Nguoi_dung:
 *                       type: object
 *                       properties:
 *                         sdt:
 *                           type: string
 *                           example: "0123456785"
 *                         ngay_sinh:
 *                           type: string
 *                           format: date
 *                           example: "1985-01-05"
 *                         gioi_tinh:
 *                           type: string
 *                           example: "Nữ"
 *                         ho_va_ten:
 *                           type: string
 *                           example: "Nguyễn Trung Hiếu"
 *                         avt_url:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                 Gio_hen:
 *                   type: object
 *                   properties:
 *                     thoi_diem_bat_dau:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-02T02:15:00.000Z"
 *                     thoi_diem_ket_thuc:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-02T02:30:00.000Z"
 *                     ngay_lam_viec:
 *                       type: string
 *                       format: date
 *                       example: "2025-01-02"
 *                     Ca_lam_viec_trong_tuan:
 *                       type: object
 *                       properties:
 *                         lam_viec_onl:
 *                           type: boolean
 *                           example: false
 *                 Hinh_anh_bo_sung_cuoc_hen:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: "https://res.cloudinary.com/dpquv4bcu/image/upload/v1741016174/uploads/smearerqnrwuutrks12l.png"
 *       404:
 *         description: Không tìm thấy cuộc hẹn với ID này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/detail/:id", appointmentController.getAllAppointmentByID);
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
router.get(
  "/countAppointmentByMethod",
  appointmentController.countAppointmentByMethod
);
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
router.get(
  "/getAppointmentSchedule",
  appointmentController.getAppointmentSchedule
);
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
 *                     example: "Phòng khám B, Quận 2"
 *                   trang_thai:
 *                     type: string
 *                     description: Tình trạng cuộc hẹn (Đang chờ, Đã xác nhận, v.v.)
 *                   thoi_diem_tao:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian tạo cuộc hẹn
 *                     example: "2025-01-01T03:00:00.000Z"
 *                   ma_bac_si:
 *                     type: string
 *                     description: Mã bác sĩ
 *                     example: "BS0000001"
 *                   ma_benh_nhan_dat_hen:
 *                     type: string
 *                     description: Mã bệnh nhân đã đặt hẹn
 *                     example: "BN0000006"
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       thoi_diem_bat_dau:
 *                         type: string
 *                         format: date-time
 *                         description: Thời điểm bắt đầu cuộc hẹn
 *                         example: "2025-01-02T02:15:00.000Z"
 *                       thoi_diem_ket_thuc:
 *                         type: string
 *                         format: date-time
 *                         description: Thời điểm kết thúc cuộc hẹn
 *                         example: "2025-01-02T02:30:00.000Z"
 *                       ngay_lam_viec:
 *                         type: string
 *                         format: date
 *                         description: Ngày làm việc
 *                         example: "2025-01-02"
 *                       available:
 *                         type: boolean
 *                         description: Tình trạng có sẵn của bác sĩ
 *                         example: true
 *                       id_ca_lam_viec:
 *                         type: integer
 *                         description: ID ca làm việc
 *                         example: 10
 *                       Ca_lam_viec_trong_tuan:
 *                         type: object
 *                         properties:
 *                           lam_viec_onl:
 *                             type: boolean
 *                             description: Thông tin bác sĩ làm việc online hay không
 *                             example: false
 *                   Benh_nhan:
 *                     type: object
 *                     properties:
 *                       ma_benh_nhan:
 *                         type: string
 *                         description: Mã bệnh nhân
 *                         example: "BN0000006"
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ho_va_ten:
 *                             type: string
 *                             description: Họ và tên bệnh nhân
 *                             example: "Nguyễn Thị Hiền"
 *                           gioi_tinh:
 *                             type: string
 *                             description: Giới tính của bệnh nhân
 *                             example: "Nữ"
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
router.get("/getAllByDoctorID", appointmentController.getAllByDoctorID);
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
 *                     example: "Bệnh nhân bị đau đầu và chóng mặt"
 *                   dia_chi_phong_kham:
 *                     type: string
 *                     description: Địa chỉ phòng khám
 *                     example: "Phòng khám B, Quận 2"
 *                   trang_thai:
 *                     type: string
 *                     description: Tình trạng cuộc hẹn
 *                     example: "Đang chờ"
 *                   thoi_diem_tao:
 *                     type: string
 *                     format: date-time
 *                     description: Thời gian tạo cuộc hẹn
 *                     example: "2025-01-01T03:00:00.000Z"
 *                   ma_bac_si:
 *                     type: string
 *                     description: Mã bác sĩ
 *                     example: "BS0000001"
 *                   ma_benh_nhan_dat_hen:
 *                     type: string
 *                     description: Mã bệnh nhân đã đặt hẹn
 *                     example: "BN0000006"
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       thoi_diem_bat_dau:
 *                         type: string
 *                         format: date-time
 *                         description: Thời điểm bắt đầu cuộc hẹn
 *                         example: "2025-01-02T02:15:00.000Z"
 *                       thoi_diem_ket_thuc:
 *                         type: string
 *                         format: date-time
 *                         description: Thời điểm kết thúc cuộc hẹn
 *                         example: "2025-01-02T02:30:00.000Z"
 *                       ngay_lam_viec:
 *                         type: string
 *                         format: date
 *                         description: Ngày làm việc
 *                         example: "2025-01-02"
 *                       available:
 *                         type: boolean
 *                         description: Tình trạng có sẵn của bác sĩ
 *                         example: true
 *                       id_ca_lam_viec:
 *                         type: integer
 *                         description: ID ca làm việc
 *                         example: 10
 *                       Ca_lam_viec_trong_tuan:
 *                         type: object
 *                         properties:
 *                           lam_viec_onl:
 *                             type: boolean
 *                             description: Thông tin bác sĩ làm việc online hay không
 *                             example: false
 *                   Benh_nhan:
 *                     type: object
 *                     properties:
 *                       ma_benh_nhan:
 *                         type: string
 *                         description: Mã bệnh nhân
 *                         example: "BN0000006"
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ho_va_ten:
 *                             type: string
 *                             description: Họ và tên bệnh nhân
 *                             example: "Nguyễn Thị Hiền"
 *                           gioi_tinh:
 *                             type: string
 *                             description: Giới tính của bệnh nhân
 *                             example: "Nữ"
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
router.get(
  "/getAllByPatientAndDoctor",
  appointmentController.getAllByPatientAndDoctor
);
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
router.post("/updateStatus", appointmentController.updateAppointmentStatus);
/**
 * @swagger
 * /api/appointment/patient/{ptID}/status/{status}:
 *   get:
 *     summary: Lấy danh sách cuộc hẹn của bệnh nhân theo trạng thái
 *     description: API này trả về danh sách các cuộc hẹn của một bệnh nhân cụ thể dựa trên trạng thái cuộc hẹn.
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân cần lấy danh sách cuộc hẹn
 *         example: "BN0000006"
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *         description: Trạng thái cuộc hẹn (1 - Đang chờ, 2 - Hoàn thành, 3 - Đã hủy)
 *         example: 1
 *     responses:
 *       200:
 *         description: Trả về danh sách cuộc hẹn theo trạng thái
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       thoi_diem_bat_dau:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-02T02:15:00.000Z"
 *                         description: Thời điểm bắt đầu cuộc hẹn
 *                       thoi_diem_ket_thuc:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-02T02:30:00.000Z"
 *                         description: Thời điểm kết thúc cuộc hẹn
 *                       ngay_lam_viec:
 *                         type: string
 *                         format: date
 *                         example: "2025-01-02"
 *                         description: Ngày làm việc
 *                       Ca_lam_viec_trong_tuan:
 *                         type: object
 *                         properties:
 *                           lam_viec_onl:
 *                             type: boolean
 *                             example: false
 *                             description: Cuộc hẹn có phải làm việc online không
 *                   Bac_si:
 *                     type: object
 *                     properties:
 *                       chuyen_khoa:
 *                         type: string
 *                         example: "Nội tổng quát"
 *                         description: Chuyên khoa của bác sĩ
 *                       dia_chi_pk:
 *                         type: string
 *                         example: "địa chỉ mới 5"
 *                         description: Địa chỉ phòng khám của bác sĩ
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ho_va_ten:
 *                             type: string
 *                             example: "Nguyễn Trung Hiếu"
 *                             description: Họ và tên bác sĩ
 *                           avt_url:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                             description: URL ảnh đại diện bác sĩ (có thể null)
 *       404:
 *         description: Không tìm thấy cuộc hẹn cho bệnh nhân với trạng thái này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/patient/:ptID/status/:status",
  appointmentController.getAllByStatusAndPtID
);
module.exports = router;
