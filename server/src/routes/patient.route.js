const express = require("express");
const router = express.Router();
const patientController = require("../controllers/patient.controller");

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         cccd:
 *           type: string
 *           example: "123456789111"
 *         dan_toc:
 *           type: string
 *           example: "Kinh"
 *         diem_he_thong:
 *           type: integer
 *           example: 10
 *         nhom_mau:
 *           type: string
 *           example: "B"
 *         tien_su_benh:
 *           type: string
 *           example: "Béo phì"
 *         quoc_tich:
 *           type: string
 *           example: "Việt Nam"
 *         dia_chi:
 *           type: string
 *           example: "An Giang"
 *         ma_benh_nhan:
 *           type: string
 *           example: "BN0000006"
 *         Nguoi_dung:
 *           type: object
 *           properties:
 *             ten_dang_nhap:
 *               type: string
 *               example: "benhnhan1"
 *             email:
 *               type: string
 *               format: email
 *               example: "benhnhan1@example.com"
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
 *               example: "bn"
 *             ho_va_ten:
 *               type: string
 *               example: "Nguyễn Trung Hiếu"
 */

/**
 * @swagger
 * /api/patient:
 *   get:
 *     summary: Lấy danh sách tất cả bệnh nhân
 *     tags: [Patient]
 *     responses:
 *       200:
 *         description: Danh sách bệnh nhân được trả về thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID của bệnh nhân
 *                   cccd:
 *                     type: string
 *                     description: Số căn cước công dân của bệnh nhân
 *                   dan_toc:
 *                     type: string
 *                     description: Dân tộc của bệnh nhân
 *                   nhom_mau:
 *                     type: string
 *                     description: Nhóm máu của bệnh nhân
 *                   tien_su_benh:
 *                     type: string
 *                     description: Tiền sử bệnh của bệnh nhân
 *                   quoc_tich:
 *                     type: string
 *                     description: Quốc tịch của bệnh nhân
 *                   dia_chi:
 *                     type: string
 *                     description: Địa chỉ của bệnh nhân
 *                   ma_benh_nhan:
 *                     type: string
 *                     description: Mã bệnh nhân
 *                   Nguoi_dung:
 *                     type: object
 *                     properties:
 *                       ten_dang_nhap:
 *                         type: string
 *                         description: Tên đăng nhập của bệnh nhân
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Email của bệnh nhân
 *                       sdt:
 *                         type: string
 *                         description: Số điện thoại của bệnh nhân
 *                       ngay_sinh:
 *                         type: string
 *                         format: date
 *                         description: Ngày sinh của bệnh nhân
 *                       gioi_tinh:
 *                         type: string
 *                         description: Giới tính của bệnh nhân
 *                       phan_loai:
 *                         type: string
 *                         description: Phân loại người dùng (bn - bệnh nhân)
 *                       ho_va_ten:
 *                         type: string
 *                         description: Họ và tên bệnh nhân
 *                       Tai_khoan:
 *                         type: object
 *                         properties:
 *                           ten_dang_nhap:
 *                             type: string
 *                             description: Tên đăng nhập của tài khoản
 *                           active:
 *                             type: boolean
 *                             description: Trạng thái hoạt động của tài khoản
 *                           thoi_diem_mo_tk:
 *                             type: string
 *                             format: date-time
 *                             description: Thời điểm mở tài khoản
 *         examples:
 *           application/json:
 *             [
 *               {
 *                 "id": 6,
 *                 "cccd": "0123456706",
 *                 "dan_toc": "Tày",
 *                 "nhom_mau": "AB",
 *                 "tien_su_benh": "Tiền sử tiểu đường tuýp 2",
 *                 "quoc_tich": "Việt Nam",
 *                 "dia_chi": "Số 20, Đường B, Quận 2, TP HCM",
 *                 "ma_benh_nhan": "BN0000006",
 *                 "Nguoi_dung": {
 *                   "ten_dang_nhap": "nguoidung1",
 *                   "email": "nguoidung1@example.com",
 *                   "sdt": "0123456888",
 *                   "ngay_sinh": "1995-01-15",
 *                   "gioi_tinh": "Nữ",
 *                   "phan_loai": "bn",
 *                   "ho_va_ten": "Nguyễn Thị Hiền",
 *                   "Tai_khoan": {
 *                     "ten_dang_nhap": "nguoidung1",
 *                     "active": true,
 *                     "thoi_diem_mo_tk": "2025-02-17T08:10:02.410Z"
 *                   }
 *                 }
 *               }
 *             ]
 *       500:
 *         description: Lỗi từ server khi xử lý yêu cầu.
 */
router.get("/", patientController.getAllPatient);
/**
 * @swagger
 * /api/patient/detail/{patientID}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một bệnh nhân
 *     description: API này trả về thông tin chi tiết của một bệnh nhân, bao gồm thông tin cá nhân, tài khoản người dùng và bảo hiểm y tế.
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: patientID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã định danh của bệnh nhân cần lấy thông tin.
 *         example: "BN0000006"
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết của bệnh nhân thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 6
 *                 cccd:
 *                   type: string
 *                   example: "0123456706"
 *                 dan_toc:
 *                   type: string
 *                   example: "Tày"
 *                 nhom_mau:
 *                   type: string
 *                   example: "AB"
 *                 tien_su_benh:
 *                   type: string
 *                   example: "Tiền sử tiểu đường tuýp 2"
 *                 quoc_tich:
 *                   type: string
 *                   example: "Việt Nam"
 *                 dia_chi:
 *                   type: string
 *                   example: "Số 20, Đường B, Quận 2, TP HCM"
 *                 ma_benh_nhan:
 *                   type: string
 *                   example: "BN0000006"
 *                 chieu_cao:
 *                   type: number
 *                   example: 170.5
 *                 can_nang:
 *                   type: number
 *                   example: 70.5
 *                 Nguoi_dung:
 *                   type: object
 *                   properties:
 *                     ten_dang_nhap:
 *                       type: string
 *                       example: "nguoidung1"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "nguoidung1@example.com"
 *                     sdt:
 *                       type: string
 *                       example: "0123456888"
 *                     ngay_sinh:
 *                       type: string
 *                       format: date
 *                       example: "1995-01-15"
 *                     gioi_tinh:
 *                       type: string
 *                       example: "Nữ"
 *                     phan_loai:
 *                       type: string
 *                       example: "bn"
 *                     ho_va_ten:
 *                       type: string
 *                       example: "Nguyễn Thị Hiền"
 *                     avt_url:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                     Tai_khoan:
 *                       type: object
 *                       properties:
 *                         ten_dang_nhap:
 *                           type: string
 *                           example: "nguoidung1"
 *                         active:
 *                           type: boolean
 *                           example: true
 *                         thoi_diem_mo_tk:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-02-28T01:55:00.651Z"
 *                 Bao_hiem_y_te:
 *                   type: object
 *                   properties:
 *                     ma_bhyt:
 *                       type: string
 *                       example: "089141222333"
 *                     bv_dang_ky:
 *                       type: string
 *                       example: "BV A"
 *                     ngay_cap:
 *                       type: string
 *                       format: date
 *                       example: "2022-01-01"
 *                     ngay_het_han:
 *                       type: string
 *                       format: date
 *                       example: "2022-12-31"
 *       500:
 *         description: Lỗi từ server khi xử lý yêu cầu.
 */
router.get("/detail/:patientID", patientController.getPatientInfo);
/**
 * @swagger
 * /api/patient/getAllByDoctorID:
 *   get:
 *     summary: Lấy tất cả bệnh nhân theo mã bác sĩ
 *     description: API này trả về danh sách tất cả bệnh nhân mà đã từng đặt hẹn với bác sĩ có mã bác sĩ truyền vào
 *     tags:
 *       - Patient
 *     parameters:
 *       - name: doctorID
 *         in: query
 *         required: true
 *         description: Mã bác sĩ cần lấy danh sách bệnh nhân
 *         schema:
 *           type: string
 *         example: 'BS0000001'
 *     responses:
 *       200:
 *         description: Danh sách bệnh nhân của bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID người dùng
 *                   ten_dang_nhap:
 *                     type: string
 *                     description: Tên đăng nhập người dùng
 *                   email:
 *                     type: string
 *                     description: Địa chỉ email người dùng
 *                   sdt:
 *                     type: string
 *                     description: Số điện thoại người dùng
 *                   ngay_sinh:
 *                     type: string
 *                     format: date
 *                     description: Ngày sinh của bệnh nhân
 *                   gioi_tinh:
 *                     type: string
 *                     description: Giới tính của bệnh nhân
 *                   phan_loai:
 *                     type: string
 *                     description: Phân loại bệnh nhân
 *                   ho_va_ten:
 *                     type: string
 *                     description: Họ và tên của bệnh nhân
 *                   cccd:
 *                     type: string
 *                     description: CCCD của bệnh nhân
 *                   dan_toc:
 *                     type: string
 *                     description: Dân tộc của bệnh nhân
 *                   nhom_mau:
 *                     type: string
 *                     description: Nhóm máu của bệnh nhân
 *                   tien_su_benh:
 *                     type: string
 *                     description: Tiền sử bệnh của bệnh nhân
 *                   quoc_tich:
 *                     type: string
 *                     description: Quốc tịch của bệnh nhân
 *                   dia_chi:
 *                     type: string
 *                     description: Địa chỉ của bệnh nhân
 *                   ma_benh_nhan:
 *                     type: string
 *                     description: Mã bệnh nhân
 *                   ma_bhyt:
 *                     type: string
 *                     description: Mã bảo hiểm y tế
 *                   bv_dang_ky:
 *                     type: string
 *                     description: Bệnh viện đăng ký
 *                   ngay_cap:
 *                     type: string
 *                     description: Ngày cấp
 *                   ngay_het_han:
 *                     type: string
 *                     description: Ngày hết hạn
 *       500:
 *         description: Lỗi máy chủ khi lấy danh sách bệnh nhân
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Có lỗi xảy ra: <lỗi cụ thể>"
 */
router.get("/getAllByDoctorID", patientController.getAllByDoctorID);
/**
 * @swagger
 * /api/patient/create:
 *   post:
 *     summary: Tạo bệnh nhân mới
 *     description: API tạo thông tin bệnh nhân mới bao gồm tài khoản người dùng và thông tin cá nhân
 *     tags:
 *       - Patient
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullname
 *               - address
 *               - phone
 *               - birthday
 *               - gender
 *               - avt_url
 *             properties:
 *               username:
 *                 type: string
 *                 description: Tên đăng nhập (không được trùng với tên đăng nhập đã tồn tại)
 *                 example: "benhnhan01"
 *               fullname:
 *                 type: string
 *                 description: Họ và tên đầy đủ của bệnh nhân
 *                 example: "Nguyễn Văn A"
 *               address:
 *                 type: string
 *                 description: Địa chỉ của bệnh nhân
 *                 example: "123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh"
 *               phone:
 *                 type: string
 *                 description: Số điện thoại của bệnh nhân (không được trùng với số điện thoại đã tồn tại)
 *                 example: "0912345678"
 *               birthday:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh của bệnh nhân (định dạng YYYY-MM-DD)
 *                 example: "1990-01-15"
 *               gender:
 *                 type: string
 *                 description: Giới tính của bệnh nhân
 *                 enum: [nam, nu, khac]
 *                 example: "nam"
 *               avt_url:
 *                 type: string
 *                 description: Đường dẫn đến ảnh đại diện của bệnh nhân (có thể null)
 *                 example: null
 *     responses:
 *       200:
 *         description: Tạo bệnh nhân thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID của người dùng trong hệ thống
 *                   example: 123
 *                 dia_chi:
 *                   type: string
 *                   description: Địa chỉ của bệnh nhân
 *                   example: "123 Nguyễn Văn Cừ, Quận 5, TP. Hồ Chí Minh"
 *                 ma_benh_nhan:
 *                   type: string
 *                   description: Mã bệnh nhân được tạo tự động
 *                   example: "BN0000123"
 *       500:
 *         description: Lỗi khi tạo bệnh nhân
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: "Tên đăng nhập đã tồn tại!"
 */
router.post("/create", patientController.createOne);
/**
 * @swagger
 * /api/patient/userDetail/{ptID}:
 *   get:
 *     summary: Lấy thông tin chi tiết người dùng
 *     description: API trả về thông tin chi tiết của người dùng dựa trên mã bệnh nhân
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân (ptID)
 *         example: "BN0000006"
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID của người dùng trong hệ thống
 *                   example: 6
 *                 cccd:
 *                   type: string
 *                   description: Số căn cước công dân
 *                   example: "0123456706"
 *                 dan_toc:
 *                   type: string
 *                   description: Dân tộc của người dùng
 *                   example: "Tày"
 *                 quoc_tich:
 *                   type: string
 *                   description: Quốc tịch của người dùng
 *                   example: "Việt Nam"
 *                 dia_chi:
 *                   type: string
 *                   description: Địa chỉ cư trú
 *                   example: "Số 20, Đường B, Quận 2, TP HCM"
 *                 email:
 *                   type: string
 *                   description: Địa chỉ email
 *                   example: "nguoidung1@example.com"
 *                 sdt:
 *                   type: string
 *                   description: Số điện thoại liên hệ
 *                   example: "0123456888"
 *                 ngay_sinh:
 *                   type: string
 *                   format: date
 *                   description: Ngày sinh của người dùng
 *                   example: "1995-01-15"
 *                 gioi_tinh:
 *                   type: string
 *                   description: Giới tính của người dùng
 *                   example: "Nữ"
 *                 ho_va_ten:
 *                   type: string
 *                   description: Họ và tên đầy đủ
 *                   example: "Nguyễn Thị Hiền"
 *       500:
 *         description: Lỗi khi lấy thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: "Không tìm thấy thông tin người dùng"
 */
router.get("/userDetail/:ptID", patientController.getUserDetail);
/**
 * @swagger
 * /api/patient/userDetail/{ptID}:
 *   put:
 *     summary: Cập nhật thông tin chi tiết người dùng
 *     description: API cho phép cập nhật thông tin chi tiết của người dùng dựa trên mã bệnh nhân
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân (ptID)
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ho_va_ten:
 *                 type: string
 *                 description: Họ và tên đầy đủ
 *                 example: "Nguyễn Thị Hiền"
 *               avt_url:
 *                 type: string
 *                 description: Đường dẫn đến ảnh đại diện
 *                 example: "https://example.com/avatar.jpg"
 *               cccd:
 *                 type: string
 *                 description: Số căn cước công dân
 *                 example: "0123456706"
 *               dan_toc:
 *                 type: string
 *                 description: Dân tộc của người dùng
 *                 example: "Tày"
 *               quoc_tich:
 *                 type: string
 *                 description: Quốc tịch của người dùng
 *                 example: "Việt Nam"
 *               dia_chi:
 *                 type: string
 *                 description: Địa chỉ cư trú
 *                 example: "Số 20, Đường B, Quận 2, TP HCM"
 *               email:
 *                 type: string
 *                 description: Địa chỉ email
 *                 example: "nguoidung1@example.com"
 *               sdt:
 *                 type: string
 *                 description: Số điện thoại liên hệ
 *                 example: "0123456888"
 *               ngay_sinh:
 *                 type: string
 *                 format: date
 *                 description: Ngày sinh của người dùng
 *                 example: "1995-01-15"
 *               gioi_tinh:
 *                 type: string
 *                 description: Giới tính của người dùng
 *                 example: "Nữ"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: boolean
 *               description: Kết quả cập nhật thông tin
 *               example: true
 *       500:
 *         description: Lỗi khi cập nhật thông tin người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Thông báo lỗi
 *                   example: "Không tìm thấy bệnh nhân!"
 */
router.put("/userDetail/:ptID", patientController.updateUserDetail);
/**
 * @swagger
 * /api/patient/insurance/{ptID}:
 *   get:
 *     summary: Lấy thông tin bảo hiểm y tế của bệnh nhân
 *     description: API này dùng để lấy thông tin bảo hiểm y tế của bệnh nhân dựa vào mã bệnh nhân (`ptID`).
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         description: Mã bệnh nhân cần lấy thông tin bảo hiểm
 *         schema:
 *           type: string
 *           example: "BN0000006"
 *     responses:
 *       200:
 *         description: Trả về thông tin bảo hiểm y tế của bệnh nhân
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tien_su_benh:
 *                   type: string
 *                   description: Tiền sử bệnh của bệnh nhân
 *                   example: "Tiền sử tiểu đường tuýp 2"
 *                 nhom_mau:
 *                   type: string
 *                   description: Nhóm máu của bệnh nhân
 *                   example: "AB"
 *                 ma_bhyt:
 *                   type: string
 *                   description: Mã số bảo hiểm y tế
 *                   example: "089141222333"
 *                 bv_dang_ky:
 *                   type: string
 *                   description: Bệnh viện đăng ký bảo hiểm
 *                   example: "BV A"
 *                 ngay_cap:
 *                   type: string
 *                   format: date
 *                   description: Ngày cấp bảo hiểm
 *                   example: "2022-01-01"
 *                 ngay_het_han:
 *                   type: string
 *                   format: date
 *                   description: Ngày hết hạn bảo hiểm
 *                   example: "2022-12-31"
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/insurance/:ptID", patientController.getInsuranceInfo);
/**
 * @swagger
 * /api/patient/insurance/{ptID}:
 *   put:
 *     summary: Cập nhật thông tin bảo hiểm y tế và hồ sơ sức khỏe của bệnh nhân
 *     description: API này cho phép cập nhật thông tin bảo hiểm y tế và tiền sử bệnh, nhóm máu của bệnh nhân dựa vào mã bệnh nhân (`ptID`). Nếu bệnh nhân chưa có thông tin bảo hiểm, hệ thống sẽ tạo mới.
 *     tags:
 *       - Patient
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         description: Mã bệnh nhân cần cập nhật thông tin
 *         schema:
 *           type: string
 *           example: "123456789"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ma_bhyt:
 *                 type: string
 *                 description: Mã số thẻ bảo hiểm y tế (bắt buộc nếu tạo mới)
 *                 example: "089141222333"
 *               bv_dang_ky:
 *                 type: string
 *                 description: Bệnh viện đăng ký khám chữa bệnh ban đầu
 *                 example: "BV Đa khoa Quận 1"
 *               ngay_cap:
 *                 type: string
 *                 format: date
 *                 description: Ngày cấp bảo hiểm
 *                 example: "2022-01-01"
 *               ngay_het_han:
 *                 type: string
 *                 format: date
 *                 description: Ngày hết hạn bảo hiểm
 *                 example: "2025-12-31"
 *               tien_su_benh:
 *                 type: string
 *                 description: Tiền sử bệnh của bệnh nhân
 *                 example: "Tiểu đường tuýp 2"
 *               nhom_mau:
 *                 type: string
 *                 description: Nhóm máu của bệnh nhân
 *                 example: "AB"
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
 *                   example: "Cập nhật thành công"
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/insurance/:ptID", patientController.updateInsuranceInfo);

module.exports = router;
