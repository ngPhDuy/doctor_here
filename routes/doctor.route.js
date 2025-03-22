const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctor.controller");
/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         ngay_vao_nghe:
 *           type: string
 *           format: date
 *           example: "2010-09-22"
 *         trinh_do_hoc_van:
 *           type: string
 *           example: "Thạc sĩ Y học"
 *         mo_ta:
 *           type: string
 *           example: "Được bệnh nhân đánh giá cao"
 *         dia_chi_pk:
 *           type: string
 *           example: "Phòng khám B, Quận 2"
 *         ma_bac_si:
 *           type: string
 *           example: "BS0000001"
 *         Nguoi_dung:
 *           type: object
 *           properties:
 *             ten_dang_nhap:
 *               type: string
 *               example: "bacsi1"
 *             email:
 *               type: string
 *               format: email
 *               example: "bacsi1@example.com"
 *             sdt:
 *               type: string
 *               example: "0123456789"
 *             ngay_sinh:
 *               type: string
 *               format: date
 *               example: "1985-01-15"
 *             gioi_tinh:
 *               type: string
 *               example: "Nam"
 *             phan_loai:
 *               type: string
 *               example: "bs"
 *             ho_va_ten:
 *               type: string
 *               example: "Nguyễn Trung Hiếu"
 */

/**
 * @swagger
 * /api/doctor:
 *   get:
 *     summary: Lấy danh sách tất cả bác sĩ
 *     description: API này trả về danh sách tất cả các bác sĩ, bao gồm thông tin cá nhân, chuyên khoa, đánh giá trung bình và tổng số đánh giá.
 *     tags:
 *       - Doctor
 *     responses:
 *       200:
 *         description: Trả về danh sách các bác sĩ
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
 *                     description: ID của bác sĩ
 *                   ngay_vao_nghe:
 *                     type: string
 *                     format: date
 *                     example: "2010-09-22"
 *                     description: Ngày bác sĩ bắt đầu hành nghề
 *                   trinh_do_hoc_van:
 *                     type: string
 *                     example: "Tiến sĩ Y học"
 *                     description: Trình độ học vấn của bác sĩ
 *                   mo_ta:
 *                     type: string
 *                     example: "Được bệnh nhân đánh giá cao"
 *                     description: Mô tả chung về bác sĩ
 *                   dia_chi_pk:
 *                     type: string
 *                     example: "Phòng khám C, Quận 3"
 *                     description: Địa chỉ phòng khám của bác sĩ
 *                   ma_bac_si:
 *                     type: string
 *                     example: "BS0000001"
 *                     description: Mã bác sĩ
 *                   chuyen_khoa:
 *                     type: string
 *                     example: "Nội tổng quát"
 *                     description: Chuyên khoa của bác sĩ
 *                   danh_gia_trung_binh:
 *                     type: string
 *                     example: "3.5000000000000000"
 *                     description: Điểm đánh giá trung bình của bác sĩ
 *                   tong_so_danh_gia:
 *                     type: string
 *                     example: "2"
 *                     description: Tổng số lượt đánh giá của bác sĩ
 *                   Nguoi_dung:
 *                     type: object
 *                     properties:
 *                       ten_dang_nhap:
 *                         type: string
 *                         example: "bacsi1"
 *                       email:
 *                         type: string
 *                         example: "bacsi1@example.com"
 *                       sdt:
 *                         type: string
 *                         example: "0123456785"
 *                       ngay_sinh:
 *                         type: string
 *                         format: date
 *                         example: "1985-01-05"
 *                       gioi_tinh:
 *                         type: string
 *                         example: "Nam"
 *                       phan_loai:
 *                         type: string
 *                         example: "bs"
 *                       ho_va_ten:
 *                         type: string
 *                         example: "Nguyễn Trung Hiếu"
 *                       avt_url:
 *                         type: string
 *                         nullable: true
 *                         example: null
 *                       Tai_khoan:
 *                         type: object
 *                         properties:
 *                           ten_dang_nhap:
 *                             type: string
 *                             example: "bacsi1"
 *                           active:
 *                             type: boolean
 *                             example: true
 *                           thoi_diem_mo_tk:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-28T01:55:00.651Z"
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/", doctorController.getAllDoctor);
/**
 * @swagger
 * /api/doctor/changeInfo:
 *   post:
 *     summary: Cập nhật thông tin cá nhân cho bác sĩ
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorID:
 *                 type: string
 *                 description: Doctor's unique identifier (e.g., "BS12345").
 *                 example: "BS0000001"
 *               email:
 *                 type: string
 *                 description: Doctor's email address.
 *                 example: "doctor@example.com"
 *               fullName:
 *                 type: string
 *                 description: Doctor's full name.
 *                 example: "Nguyen Van A"
 *               phoneNumber:
 *                 type: string
 *                 description: Doctor's phone number.
 *                 example: "0123456789"
 *               birthDay:
 *                 type: string
 *                 format: date
 *                 description: Doctor's date of birth in yyyy-mm-dd format.
 *                 example: "1985-05-10"
 *               gender:
 *                 type: string
 *                 description: Doctor's gender (e.g., "Nam" or "Nữ").
 *                 example: "Nam"
 *               description:
 *                 type: string
 *                 description: Additional description about the doctor.
 *                 example: "Thạc sĩ Y học chuyên ngành nội khoa"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Information updated successfully"
 *                 userChangedColumns:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["email", "ho_va_ten", "sdt", "ngay_sinh", "gioi_tinh"]
 *                 doctorChangedColumns:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["mo_ta"]
 *       500:
 *         description: Lỗi từ server khi xử lý yêu cầu.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/changeInfo", doctorController.changeInfo);
/**
 * @swagger
 * /api/doctor/addDoctor:
 *   post:
 *     summary: Thêm một bác sĩ mới
 *     tags: [Doctor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tenDangNhap:
 *                 type: string
 *                 description: Tên đăng nhập của bác sĩ.
 *                 example: "doctor123"
 *               matKhau:
 *                 type: string
 *                 description: Mật khẩu của tài khoản bác sĩ.
 *                 example: "securepassword123"
 *               email:
 *                 type: string
 *                 description: Địa chỉ email của bác sĩ.
 *                 example: "doctor@example.com"
 *               sdt:
 *                 type: string
 *                 description: Số điện thoại của bác sĩ.
 *                 example: "0912345678"
 *               ngaySinh:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh của bác sĩ (định dạng dd/mm/yyyy).
 *                 example: "01/01/1980"
 *               gioiTinh:
 *                 type: string
 *                 description: Giới tính của bác sĩ ("Nam", "Nữ", hoặc "Khác").
 *                 example: "Nam"
 *               hoVaTen:
 *                 type: string
 *                 description: Họ và tên đầy đủ của bác sĩ.
 *                 example: "Nguyễn Văn A"
 *               thoiDiemVaoNghe:
 *                 type: string
 *                 format: date
 *                 description: Thời điểm bác sĩ bắt đầu hành nghề (định dạng dd/mm/yyyy).
 *                 example: "01/01/2010"
 *               trinhDoHocVan:
 *                 type: string
 *                 description: Trình độ học vấn của bác sĩ.
 *                 example: "Thạc sĩ Y khoa"
 *               moTa:
 *                 type: string
 *                 description: Mô tả ngắn về bác sĩ.
 *                 example: "Chuyên gia phẫu thuật nội soi"
 *               diaChiPhongKham:
 *                 type: string
 *                 description: Địa chỉ phòng khám của bác sĩ.
 *                 example: "123 Đường Lý Thường Kiệt, Quận 10, TP.HCM"
 *               chuyenKhoa:
 *                 type: string
 *                 description: Chuyên khoa của bác sĩ.
 *                 example: "Nội khoa"
 *     responses:
 *       200:
 *         description: Thêm bác sĩ thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thêm bác sĩ thành công"
 *       500:
 *         description: Lỗi xảy ra khi thêm bác sĩ.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi xảy ra khi thêm bác sĩ"
 */
router.post("/addDoctor", doctorController.insertDoctor);
/**
 * @swagger
 * /api/doctor/addWeeklyWork:
 *   post:
 *     summary: Thêm lịch làm việc hàng tuần cho bác sĩ, thêm các giờ CHO MỘT THỨ CỤ THỂ
 *     description: API này cho phép thêm lịch làm việc cho bác sĩ, bao gồm các thông tin như bác sĩ, thứ làm việc, các giờ làm việc, phương thức làm việc online, và giá thành.
 *     tags:
 *       - Doctor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorID:
 *                 type: string
 *                 description: Mã bác sĩ
 *                 example: 'BS0000001'
 *               date:
 *                 type: string
 *                 description: Thứ làm việc (ví dụ 'T2', 'T3', ..., 'T7', 'CN')
 *                 example: 'T3'
 *               workTime:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Mảng các giờ làm việc của bác sĩ
 *                 example: ['Sáng: 7-11h', 'Trưa: 11-13h', 'Chiều: 13-17h']
 *               onlMethod:
 *                 type: boolean
 *                 description: Phương thức làm việc online (true hoặc false)
 *                 example: true
 *               price:
 *                 type: integer
 *                 description: Giá thành của mỗi buổi làm việc
 *                 example: 500000
 *     responses:
 *       200:
 *         description: Lịch làm việc được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thêm lịch làm việc thành công"
 *       500:
 *         description: Lỗi khi thêm lịch làm việc
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra: <lỗi cụ thể>"
 */
router.post("/addWeeklyWork", doctorController.insertWeeklyWork);
/**
 * @swagger
 * /api/doctor/specialization:
 *   get:
 *     summary: Lấy danh sách tất cả chuyên khoa
 *     description: API này trả về danh sách tất cả các chuyên khoa hiện có trong hệ thống.
 *     tags:
 *       - Doctor
 *     responses:
 *       200:
 *         description: Trả về danh sách các chuyên khoa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ten_chuyen_khoa:
 *                     type: string
 *                     example: "Nhi khoa"
 *                     description: Tên của chuyên khoa
 *                   img_url:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                     description: URL hình ảnh đại diện cho chuyên khoa (có thể null nếu không có)
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/specialization", doctorController.getAllSpecialization);
/**
 * @swagger
 * /api/doctor/{doctorID}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một bác sĩ
 *     description: API này trả về thông tin chi tiết của bác sĩ bao gồm thông tin cá nhân, chuyên khoa, đánh giá trung bình và tổng số đánh giá.
 *     tags:
 *       - Doctor
 *     parameters:
 *       - in: path
 *         name: doctorID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bác sĩ cần lấy thông tin chi tiết
 *         example: "BS0000001"
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết của bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: ID của bác sĩ
 *                 ngay_vao_nghe:
 *                   type: string
 *                   format: date
 *                   example: "2010-09-22"
 *                   description: Ngày bác sĩ bắt đầu hành nghề
 *                 trinh_do_hoc_van:
 *                   type: string
 *                   example: "trình độ mới 5"
 *                   description: Trình độ học vấn của bác sĩ
 *                 mo_ta:
 *                   type: string
 *                   example: "Được bệnh nhân đánh giá cao"
 *                   description: Mô tả chung về bác sĩ
 *                 dia_chi_pk:
 *                   type: string
 *                   example: "địa chỉ mới 5"
 *                   description: Địa chỉ phòng khám của bác sĩ
 *                 ma_bac_si:
 *                   type: string
 *                   example: "BS0000001"
 *                   description: Mã bác sĩ
 *                 chuyen_khoa:
 *                   type: string
 *                   example: "Nội tổng quát"
 *                   description: Chuyên khoa của bác sĩ
 *                 danh_gia_trung_binh:
 *                   type: string
 *                   example: "3.5000000000000000"
 *                   description: Điểm đánh giá trung bình của bác sĩ
 *                 tong_so_danh_gia:
 *                   type: string
 *                   example: "2"
 *                   description: Tổng số lượt đánh giá của bác sĩ
 *                 Nguoi_dung:
 *                   type: object
 *                   properties:
 *                     ten_dang_nhap:
 *                       type: string
 *                       example: "bacsi1"
 *                     email:
 *                       type: string
 *                       example: "bacsi1@example.com"
 *                     sdt:
 *                       type: string
 *                       example: "0123456785"
 *                     ngay_sinh:
 *                       type: string
 *                       format: date
 *                       example: "1985-01-05"
 *                     gioi_tinh:
 *                       type: string
 *                       example: "Nữ"
 *                     phan_loai:
 *                       type: string
 *                       example: "bs"
 *                     ho_va_ten:
 *                       type: string
 *                       example: "Nguyễn Trung Hiếu"
 *                     avt_url:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     Tai_khoan:
 *                       type: object
 *                       properties:
 *                         ten_dang_nhap:
 *                           type: string
 *                           example: "bacsi1"
 *                         active:
 *                           type: boolean
 *                           example: true
 *                         thoi_diem_mo_tk:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-02-28T01:55:00.651Z"
 *       404:
 *         description: Không tìm thấy bác sĩ với ID này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/:doctorID", doctorController.getDoctorInfo);
module.exports = router;
