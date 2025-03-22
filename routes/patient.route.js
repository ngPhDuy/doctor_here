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
 *     tags: [Patient]
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
 *         description: Thông tin chi tiết của bệnh nhân được trả về thành công.
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
 *                           example: "2025-02-17T08:10:02.410Z"
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
 *                       example: "2022-01-01"
 *                     ngay_het_han:
 *                       type: string
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

module.exports = router;
