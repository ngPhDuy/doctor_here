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
 * /api/appointment/detail/{id}:
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
 *         example: 4
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
 *                   example: 4
 *                 van_ban_bo_sung:
 *                   type: string
 *                   example: "Tôi bị đau đầu mỗi sáng thức dậy và chiều tối"
 *                 dia_chi_phong_kham:
 *                   type: string
 *                   example: "18 Hùng Vương, TP.HCM"
 *                 trang_thai:
 *                   type: string
 *                   example: "Đang chờ"
 *                 thoi_diem_tao:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-31T07:04:44.164Z"
 *                 ma_bac_si:
 *                   type: string
 *                   example: "BS0000001"
 *                 ma_benh_nhan_dat_hen:
 *                   type: string
 *                   example: "BN0000007"
 *                 Benh_nhan:
 *                   type: object
 *                   properties:
 *                     cccd:
 *                       type: string
 *                       example: "0123456707"
 *                     dan_toc:
 *                       type: string
 *                       example: "Kinh"
 *                     nhom_mau:
 *                       type: string
 *                       example: "O"
 *                     tien_su_benh:
 *                       type: string
 *                       example: "Dị ứng thuốc nhẹ"
 *                     quoc_tich:
 *                       type: string
 *                       example: "Việt Nam"
 *                     dia_chi:
 *                       type: string
 *                       example: "Số 10, Đường A, Quận 1, TP HCM"
 *                     Nguoi_dung:
 *                       type: object
 *                       properties:
 *                         sdt:
 *                           type: string
 *                           example: "0123456889"
 *                         ngay_sinh:
 *                           type: string
 *                           format: date
 *                           example: "1996-02-25"
 *                         gioi_tinh:
 *                           type: string
 *                           example: "Nữ"
 *                         ho_va_ten:
 *                           type: string
 *                           example: "Nguyễn Thị Nghĩa"
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
 *                       example: "18 Hùng Vương, TP.HCM"
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
 *                       example: "2025-03-24T00:30:00.000Z"
 *                     thoi_diem_ket_thuc:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-24T00:45:00.000Z"
 *                     ngay_lam_viec:
 *                       type: string
 *                       format: date
 *                       example: "2025-03-24"
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
 *                 Danh_gia:
 *                   type: object
 *                   nullable: true
 *                   example: null
 *       404:
 *         description: Không tìm thấy cuộc hẹn với ID này
 *       500:
 *         description: Lỗi máy chủ
 */

router.get("/detail/:id", appointmentController.getAppointmentByID);
/**
 * @swagger
 * /api/appointment/countAppointmentByMethod:
 *   get:
 *     summary: Lấy số lượng cuộc hẹn theo phương thức hẹn
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
 * /api/appointment/countAppointmentByStatus:
 *   get:
 *     summary: Lấy số lượng cuộc hẹn theo trạng thái
 *     tags: [Appointment]
 *     parameters:
 *       - name: status
 *         in: query
 *         required: true
 *         description: Trạng thái cuộc hẹn (1 - Đang chờ, 2 - Hoàn thành, 3 - Đã hủy)
 *         schema:
 *           type: number
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
  "/countAppointmentByStatus",
  appointmentController.countAppointmentByStatus
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
 * /api/updateStatus:
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
 * /api/appointment/create:
 *   post:
 *     summary: Tạo cuộc hẹn mới
 *     description: API tạo cuộc hẹn mới giữa bệnh nhân và bác sĩ, đồng thời lưu trữ các hình ảnh liên quan
 *     tags:
 *       - Appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - textContent
 *               - ptID
 *               - drID
 *               - timeslotID
 *               - urls
 *             properties:
 *               textContent:
 *                 type: string
 *                 description: Nội dung mô tả cuộc hẹn
 *                 example: "Khám đau đầu và chóng mặt"
 *               ptID:
 *                 type: string
 *                 description: Mã bệnh nhân đặt hẹn
 *                 example: "BN0000006"
 *               drID:
 *                 type: string
 *                 description: Mã bác sĩ được đặt hẹn
 *                 example: "BS0000002"
 *               timeslotID:
 *                 type: integer
 *                 description: ID của khung giờ được đặt hẹn
 *                 example: 15
 *               urls:
 *                 type: array
 *                 description: Danh sách URL các hình ảnh liên quan đến cuộc hẹn
 *                 items:
 *                   type: string
 *                   example: "https://res.cloudinary.com/demo/image/upload/v1631234567/user_uploads/filename.jpg"
 *     responses:
 *       201:
 *         description: Tạo cuộc hẹn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: Kết quả tạo cuộc hẹn
 *               example: true
 *       500:
 *         description: Lỗi khi tạo cuộc hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: "Thời gian đã được đặt"
 */
router.post("/create", appointmentController.createAppointment);
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
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       thoi_diem_bat_dau:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-28T06:15:00.000Z"
 *                         description: Thời điểm bắt đầu cuộc hẹn
 *                       thoi_diem_ket_thuc:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-28T06:30:00.000Z"
 *                         description: Thời điểm kết thúc cuộc hẹn
 *                       ngay_lam_viec:
 *                         type: string
 *                         format: date
 *                         example: "2025-03-28"
 *                         description: Ngày làm việc
 *                       Ca_lam_viec_trong_tuan:
 *                         type: object
 *                         properties:
 *                           lam_viec_onl:
 *                             type: boolean
 *                             example: true
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
 *                         example: "18 Hùng Vương, TP.HCM"
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
 *                   Danh_gia:
 *                     type: object
 *                     properties:
 *                       diem_danh_gia:
 *                         type: integer
 *                         example: 5
 *                         description: Điểm đánh giá của bệnh nhân
 *                       noi_dung:
 *                         type: string
 *                         example: "Ủng hộ bác sĩ"
 *                         description: Nội dung đánh giá
 *                       thoi_diem:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-31T07:20:17.669Z"
 *                         description: Thời điểm bệnh nhân đánh giá
 *       404:
 *         description: Không tìm thấy cuộc hẹn cho bệnh nhân với trạng thái này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/patient/:ptID/status/:status",
  appointmentController.getAllByStatusAndPtID
);

/**
 * @swagger
 * /api/appointment/doctor/{drID}/status/{status}:
 *   get:
 *     summary: Lấy danh sách cuộc hẹn của bác sĩ theo trạng thái
 *     description: API này cho phép lấy danh sách tất cả các cuộc hẹn của một bác sĩ cụ thể theo trạng thái (1 - Đang chờ, 2 - Hoàn thành, 3 - Đã hủy).
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: path
 *         name: drID
 *         required: true
 *         description: Mã bác sĩ
 *         schema:
 *           type: string
 *           example: "BS0000001"
 *       - in: path
 *         name: status
 *         required: true
 *         description: Trạng thái cuộc hẹn (1 - Đang chờ, 2 - Hoàn thành, 3 - Đã hủy)
 *         schema:
 *           type: integer
 *           enum: [1, 2, 3]
 *           example: 2
 *     responses:
 *       200:
 *         description: Danh sách cuộc hẹn được lấy thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID cuộc hẹn
 *                     example: 14
 *                   Gio_hen:
 *                     type: object
 *                     properties:
 *                       thoi_diem_bat_dau:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-30T01:15:00.000Z"
 *                       thoi_diem_ket_thuc:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-30T01:30:00.000Z"
 *                       ngay_lam_viec:
 *                         type: string
 *                         format: date
 *                         example: "2025-03-30"
 *                       Ca_lam_viec_trong_tuan:
 *                         type: object
 *                         properties:
 *                           lam_viec_onl:
 *                             type: boolean
 *                             example: false
 *                   Benh_nhan:
 *                     type: object
 *                     properties:
 *                       ma_benh_nhan:
 *                         type: string
 *                         example: "BN0000007"
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ho_va_ten:
 *                             type: string
 *                             example: "Nguyễn Thị Nghĩa"
 *                           avt_url:
 *                             type: string
 *                             format: uri
 *                             example: "https://res.cloudinary.com/dpquv4bcu/image/upload/v1743839972/nd2_kgf7ro.jpg"
 *       400:
 *         description: Tham số không hợp lệ hoặc thiếu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trạng thái không hợp lệ"
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/doctor/:drID/status/:status",
  appointmentController.getAllByStatusAndDrID
);

/**
 * @swagger
 * /api/appointment/cancel/{id}:
 *   patch:
 *     summary: Hủy cuộc hẹn
 *     description: API hủy cuộc hẹn đã đặt theo ID và trả lại trạng thái khả dụng cho khung giờ đó
 *     tags:
 *       - Appointment
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cuộc hẹn cần hủy
 *         example: 15
 *     responses:
 *       200:
 *         description: Hủy cuộc hẹn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID của cuộc hẹn
 *                   example: 15
 *                 ma_bac_si:
 *                   type: string
 *                   description: Mã bác sĩ được đặt hẹn
 *                   example: "BS0000002"
 *                 ma_benh_nhan_dat_hen:
 *                   type: string
 *                   description: Mã bệnh nhân đặt hẹn
 *                   example: "BN0000006"
 *                 id_gio_hen:
 *                   type: integer
 *                   description: ID của khung giờ hẹn
 *                   example: 25
 *                 noi_dung:
 *                   type: string
 *                   description: Nội dung mô tả cuộc hẹn
 *                   example: "Khám đau đầu và chóng mặt"
 *                 trang_thai:
 *                   type: string
 *                   description: Trạng thái cuộc hẹn (đã được cập nhật thành Đã hủy)
 *                   example: "Đã hủy"
 *       500:
 *         description: Lỗi khi hủy cuộc hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: "Cuộc hẹn không tồn tại"
 */
router.patch("/cancel/:id", appointmentController.cancelAppointment);

router.get("/finish/:id", appointmentController.finishAppointment);

router.get(
  "/month/:year/doctor/:drID",
  appointmentController.getStatisticsByMonth
);

router.get("/year/doctor/:drID", appointmentController.getStatisticsByYear);

router.get(
  "/method/:month/:year/:drID",
  appointmentController.getMethodByMonth
);

router.get("/method/:year/:drID", appointmentController.getMethodByYear);

router.get("/");
module.exports = router;
