const express = require("express");
const multer = require("multer");
const upload = multer(); // Multer middleware để nhận nhiều file từ client
const router = express.Router();
const updateRequestController = require("../controllers/updateRequest.controller");
/**
 * @swagger
 * /api/updateRequest/newRequest:
 *   get:
 *     summary: Lấy danh sách yêu cầu cập nhật thông tin mới
 *     description: Trả về danh sách các yêu cầu cập nhật thông tin của bác sĩ đang ở trạng thái "Chờ duyệt".
 *     tags:
 *       - Update Requests
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu cập nhật thông tin thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ma_yeu_cau:
 *                     type: string
 *                     example: "YCCN00002"
 *                     description: Mã yêu cầu cập nhật
 *                   ma_bac_si:
 *                     type: string
 *                     example: "BS0000002"
 *                     description: Mã bác sĩ gửi yêu cầu
 *                   ho_va_ten:
 *                     type: string
 *                     example: "Nguyễn Trung Nghĩa"
 *                     description: Họ và tên bác sĩ
 *                   thoi_diem_yeu_cau:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-11T06:55:43.433Z"
 *                     description: Thời điểm gửi yêu cầu
 *                   trang_thai:
 *                     type: string
 *                     example: "Chờ duyệt"
 *                     description: Trạng thái của yêu cầu
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/newRequest", updateRequestController.getAllNewRequest);
/**
 * @swagger
 * /api/updateRequest/oldRequest:
 *   get:
 *     summary: Lấy danh sách yêu cầu cập nhật thông tin cũ
 *     description: Trả về danh sách các yêu cầu cập nhật thông tin của bác sĩ đã được duyệt hoặc từ chối.
 *     tags:
 *       - Update Requests
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu cập nhật thông tin cũ thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ma_yeu_cau:
 *                     type: string
 *                     example: "YCCN00001"
 *                     description: Mã yêu cầu cập nhật
 *                   ma_bac_si:
 *                     type: string
 *                     example: "BS0000001"
 *                     description: Mã bác sĩ gửi yêu cầu
 *                   ho_va_ten:
 *                     type: string
 *                     example: "Nguyễn Trung Hiếu"
 *                     description: Họ và tên bác sĩ
 *                   thoi_diem_yeu_cau:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-11T06:52:37.021Z"
 *                     description: Thời điểm gửi yêu cầu
 *                   trang_thai:
 *                     type: string
 *                     example: "Đã duyệt"
 *                     description: Trạng thái của yêu cầu
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get("/oldRequest", updateRequestController.getOldRequest);
/**
 * @swagger
 * /api/updateRequest/requestDetail/{requestID}:
 *   get:
 *     summary: Lấy chi tiết yêu cầu cập nhật thông tin
 *     description: Trả về thông tin chi tiết của một yêu cầu cập nhật dựa trên requestID.
 *     tags:
 *       - Update Requests
 *     parameters:
 *       - in: path
 *         name: requestID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã yêu cầu cập nhật cần lấy thông tin
 *     responses:
 *       200:
 *         description: Chi tiết yêu cầu cập nhật thông tin thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: ID yêu cầu cập nhật
 *                 trang_thai:
 *                   type: string
 *                   example: "Đã duyệt"
 *                   description: Trạng thái yêu cầu
 *                 thoi_diem_yeu_cau:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-02-11T06:52:37.021Z"
 *                   description: Thời điểm gửi yêu cầu
 *                 ma_yeu_cau:
 *                   type: string
 *                   example: "YCCN00001"
 *                   description: Mã yêu cầu cập nhật
 *                 trinh_do_hoc_van_cu:
 *                   type: string
 *                   example: "Tiến sĩ"
 *                   description: Trình độ học vấn cũ
 *                 trinh_do_hoc_van_moi:
 *                   type: string
 *                   example: "Tiến sĩ chuyên khoa"
 *                   description: Trình độ học vấn mới
 *                 dia_chi_pk_cu:
 *                   type: string
 *                   example: "Số 40, Đường D, Quận 4, TP HCM"
 *                   description: Địa chỉ phòng khám cũ
 *                 dia_chi_pk_moi:
 *                   type: string
 *                   example: "Số 50, Đường E, Quận 5, TP HCM"
 *                   description: Địa chỉ phòng khám mới
 *                 chuyen_khoa_cu:
 *                   type: string
 *                   example: "Nhi khoa"
 *                   description: Chuyên khoa cũ
 *                 chuyen_khoa_moi:
 *                   type: string
 *                   example: "Nhi khoa cấp cứu"
 *                   description: Chuyên khoa mới
 *                 ma_bac_si:
 *                   type: string
 *                   example: "BS0000001"
 *                   description: Mã bác sĩ gửi yêu cầu
 *                 Bac_si:
 *                   type: object
 *                   properties:
 *                     ngay_vao_nghe:
 *                       type: string
 *                       format: date
 *                       example: "2010-09-22"
 *                       description: Ngày vào nghề của bác sĩ
 *                     trinh_do_hoc_van:
 *                       type: string
 *                       example: "Thạc sĩ Y học"
 *                       description: Trình độ học vấn của bác sĩ
 *                     mo_ta:
 *                       type: string
 *                       example: "Được bệnh nhân đánh giá cao"
 *                       description: Mô tả về bác sĩ
 *                     dia_chi_pk:
 *                       type: string
 *                       example: "Phòng khám B, Quận 2"
 *                       description: Địa chỉ phòng khám của bác sĩ
 *                     ma_bac_si:
 *                       type: string
 *                       example: "BS0000001"
 *                       description: Mã bác sĩ
 *                     Nguoi_dung:
 *                       type: object
 *                       properties:
 *                         ten_dang_nhap:
 *                           type: string
 *                           example: "bacsi1"
 *                           description: Tên đăng nhập của bác sĩ
 *                         email:
 *                           type: string
 *                           example: "bacsi1@example.com"
 *                           description: Email của bác sĩ
 *                         sdt:
 *                           type: string
 *                           example: "0123456789"
 *                           description: Số điện thoại của bác sĩ
 *                         ngay_sinh:
 *                           type: string
 *                           format: date
 *                           example: "1985-01-15"
 *                           description: Ngày sinh của bác sĩ
 *                         gioi_tinh:
 *                           type: string
 *                           example: "Nam"
 *                           description: Giới tính của bác sĩ
 *                         phan_loai:
 *                           type: string
 *                           example: "bs"
 *                           description: Phân loại người dùng
 *                         ho_va_ten:
 *                           type: string
 *                           example: "Nguyễn Trung Hiếu"
 *                           description: Họ và tên của bác sĩ
 *                 Anh_minh_chung:
 *                   type: array
 *                   description: Danh sách ảnh minh chứng (nếu có)
 *                   items:
 *                     type: object
 *                 Duyet_yeu_cau_cap_nhat:
 *                   type: object
 *                   properties:
 *                     yeu_cau_cap_nhat:
 *                       type: string
 *                       example: "YCCN00001"
 *                       description: Mã yêu cầu cập nhật được duyệt
 *                     ma_qtv:
 *                       type: string
 *                       example: "QT0000011"
 *                       description: Mã quản trị viên duyệt yêu cầu
 *                     thoi_diem_duyet:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-11T07:16:31.277Z"
 *                       description: Thời điểm duyệt yêu cầu
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc thiếu requestID
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
  "/requestDetail/:requestID",
  updateRequestController.getRequestDetail
);
/**
 * @swagger
 * /api/updateRequest/requestByDoctorID/{doctorID}:
 *   get:
 *     summary: Lấy danh sách yêu cầu cập nhật thông tin của bác sĩ
 *     description: Trả về danh sách các yêu cầu cập nhật thông tin của một bác sĩ dựa trên doctorID.
 *     tags:
 *       - Update Requests
 *     parameters:
 *       - in: path
 *         name: doctorID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bác sĩ cần lấy danh sách yêu cầu cập nhật thông tin
 *     responses:
 *       200:
 *         description: Danh sách yêu cầu cập nhật thông tin của bác sĩ thành công.
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
 *                     description: ID yêu cầu cập nhật
 *                   trang_thai:
 *                     type: string
 *                     example: "Đã duyệt"
 *                     description: Trạng thái yêu cầu
 *                   thoi_diem_yeu_cau:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-02-11T06:52:37.021Z"
 *                     description: Thời điểm gửi yêu cầu
 *                   ma_yeu_cau:
 *                     type: string
 *                     example: "YCCN00001"
 *                     description: Mã yêu cầu cập nhật
 *                   trinh_do_hoc_van_cu:
 *                     type: string
 *                     example: "Tiến sĩ"
 *                     description: Trình độ học vấn cũ
 *                   trinh_do_hoc_van_moi:
 *                     type: string
 *                     example: "Tiến sĩ chuyên khoa"
 *                     description: Trình độ học vấn mới
 *                   dia_chi_pk_cu:
 *                     type: string
 *                     example: "Số 40, Đường D, Quận 4, TP HCM"
 *                     description: Địa chỉ phòng khám cũ
 *                   dia_chi_pk_moi:
 *                     type: string
 *                     example: "Số 50, Đường E, Quận 5, TP HCM"
 *                     description: Địa chỉ phòng khám mới
 *                   chuyen_khoa_cu:
 *                     type: string
 *                     example: "Nhi khoa"
 *                     description: Chuyên khoa cũ
 *                   chuyen_khoa_moi:
 *                     type: string
 *                     example: "Nhi khoa cấp cứu"
 *                     description: Chuyên khoa mới
 *                   ma_bac_si:
 *                     type: string
 *                     example: "BS0000001"
 *                     description: Mã bác sĩ gửi yêu cầu
 *                   Bac_si:
 *                     type: object
 *                     properties:
 *                       ngay_vao_nghe:
 *                         type: string
 *                         format: date
 *                         example: "2010-09-22"
 *                         description: Ngày vào nghề của bác sĩ
 *                       trinh_do_hoc_van:
 *                         type: string
 *                         example: "Thạc sĩ Y học"
 *                         description: Trình độ học vấn của bác sĩ
 *                       mo_ta:
 *                         type: string
 *                         example: "Được bệnh nhân đánh giá cao"
 *                         description: Mô tả về bác sĩ
 *                       dia_chi_pk:
 *                         type: string
 *                         example: "Phòng khám B, Quận 2"
 *                         description: Địa chỉ phòng khám của bác sĩ
 *                       ma_bac_si:
 *                         type: string
 *                         example: "BS0000001"
 *                         description: Mã bác sĩ
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ten_dang_nhap:
 *                             type: string
 *                             example: "bacsi1"
 *                             description: Tên đăng nhập của bác sĩ
 *                           email:
 *                             type: string
 *                             example: "bacsi1@example.com"
 *                             description: Email của bác sĩ
 *                           sdt:
 *                             type: string
 *                             example: "0123456789"
 *                             description: Số điện thoại của bác sĩ
 *                           ngay_sinh:
 *                             type: string
 *                             format: date
 *                             example: "1985-01-15"
 *                             description: Ngày sinh của bác sĩ
 *                           gioi_tinh:
 *                             type: string
 *                             example: "Nam"
 *                             description: Giới tính của bác sĩ
 *                           phan_loai:
 *                             type: string
 *                             example: "bs"
 *                             description: Phân loại người dùng
 *                           ho_va_ten:
 *                             type: string
 *                             example: "Nguyễn Trung Hiếu"
 *                             description: Họ và tên của bác sĩ
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc thiếu doctorID
 *       500:
 *         description: Lỗi máy chủ nội bộ
 */
router.get(
  "/requestByDoctorID/:doctorID",
  updateRequestController.getRequestByDoctorID
);
/**
 * @swagger
 * /api/updateRequest/handleRequest:
 *   post:
 *     summary: Xử lý yêu cầu cập nhật thông tin
 *     description: Quản trị viên duyệt hoặc từ chối yêu cầu cập nhật thông tin của bác sĩ.
 *     tags:
 *       - Update Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestID:
 *                 type: string
 *                 example: "YCCN00001"
 *                 description: Mã yêu cầu cập nhật cần xử lý
 *               approved:
 *                 type: boolean
 *                 example: true
 *                 description: Trạng thái xử lý yêu cầu (`true` = chấp nhận, `false` = từ chối)
 *               adminID:
 *                 type: string
 *                 example: "QT0000011"
 *                 description: Mã quản trị viên thực hiện xử lý yêu cầu
 *     responses:
 *       200:
 *         description: Yêu cầu được xử lý thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Yêu cầu đã được duyệt thành công."
 *       500:
 *         description: Lỗi máy chủ nội bộ.
 */
router.post("/handleRequest", updateRequestController.handleRequest);
/**
 * @swagger
 * /api/updateRequest/createUpdateRequest:
 *   post:
 *     summary: Tạo yêu cầu cập nhật thông tin bác sĩ
 *     description: Gửi yêu cầu cập nhật thông tin của bác sĩ, bao gồm thông tin trình độ học vấn, địa chỉ phòng khám và chuyên khoa.
 *     tags:
 *       - Update Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               education:
 *                 type: string
 *                 description: Trình độ học vấn mới của bác sĩ
 *                 example: "Tiến sĩ chuyên khoa"
 *               address:
 *                 type: string
 *                 description: Địa chỉ phòng khám mới của bác sĩ
 *                 example: "Số 50, Đường E, Quận 5, TP HCM"
 *               speciality:
 *                 type: string
 *                 description: Chuyên khoa mới của bác sĩ
 *                 example: "Nhi khoa"
 *               doctorID:
 *                 type: string
 *                 description: Mã bác sĩ cần cập nhật
 *                 example: "BS0000001"
 *             required:
 *               - education
 *               - address
 *               - speciality
 *               - doctorID
 *     responses:
 *       200:
 *         description: Yêu cầu đã được gửi thành công
 *       500:
 *         description: Có lỗi xảy ra khi gửi yêu cầu
 *       400:
 *         description: Tham số đầu vào không hợp lệ
 */
router.post(
  "/createUpdateRequest",
  upload.array("files"),
  updateRequestController.createUpdateRequest
);
/**
 * @swagger
 * /api/updateRequest/cancelRequest:
 *   post:
 *     summary: Thu hồi yêu cầu cập nhật thông tin bác sĩ
 *     description: Bác sĩ có thể thu hồi yêu cầu cập nhật thông tin của mình.
 *     tags:
 *       - Update Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requestID:
 *                 type: string
 *                 description: Mã yêu cầu cần thu hồi
 *               doctorID:
 *                 type: string
 *                 description: Mã bác sĩ thu hồi yêu cầu
 *             required:
 *               - requestID
 *               - doctorID
 *     responses:
 *       200:
 *         description: Yêu cầu đã bị thu hồi thành công
 *       500:
 *         description: Có lỗi xảy ra khi thu hồi yêu cầu
 *       400:
 *         description: Tham số đầu vào không hợp lệ hoặc yêu cầu không tồn tại
 */
router.post("/cancelRequest", updateRequestController.cancelRequest);
module.exports = router;
