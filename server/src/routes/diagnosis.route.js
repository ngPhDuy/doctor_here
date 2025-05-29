const express = require("express");
const router = express.Router();
const controller = require("../controllers/diagnosis.controller.js");

/**
 * @swagger
 * /api/diagnosis/patient/{ptID}:
 *   get:
 *     summary: Lấy danh sách chẩn đoán của bệnh nhân theo ID
 *     description: API này trả về danh sách các chẩn đoán của bệnh nhân, bao gồm thông tin cuộc hẹn, bác sĩ, chuyên khoa, và thời gian khám.
 *     tags:
 *       - Diagnosis
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân cần lấy thông tin chẩn đoán
 *         example: "BN0000006"
 *     responses:
 *       200:
 *         description: Trả về danh sách chẩn đoán của bệnh nhân thành công
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
 *                     description: ID của chẩn đoán
 *                   ket_qua_chan_doan:
 *                     type: string
 *                     example: "Đau đầu mãn tính"
 *                     description: Kết quả chẩn đoán của bác sĩ
 *                   ghi_chu_them:
 *                     type: string
 *                     example: "Nhớ uống thuốc đầy đủ mỗi khi đông về"
 *                     description: Ghi chú bổ sung từ bác sĩ
 *                   ma_cuoc_hen:
 *                     type: integer
 *                     example: 22
 *                     description: Mã cuộc hẹn liên quan đến chẩn đoán
 *                   ma_bac_si:
 *                     type: string
 *                     example: "BS0000001"
 *                     description: Mã của bác sĩ thực hiện chẩn đoán
 *                   dia_chi_phong_kham:
 *                     type: string
 *                     example: "18 Hùng Vương, TP.HCM"
 *                     description: Địa chỉ phòng khám
 *                   thoi_diem_bat_dau:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-28T06:15:00.000Z"
 *                     description: Thời gian bắt đầu cuộc hẹn
 *                   thoi_diem_ket_thuc:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-28T06:30:00.000Z"
 *                     description: Thời gian kết thúc cuộc hẹn
 *                   chuyen_khoa:
 *                     type: string
 *                     example: "Nội tổng quát"
 *                     description: Chuyên khoa của bác sĩ
 *                   ho_va_ten:
 *                     type: string
 *                     example: "Nguyễn Trung Hiếu"
 *                     description: Họ và tên của bác sĩ
 *                   avt_url:
 *                     type: string
 *                     nullable: true
 *                     example: null
 *                     description: Ảnh đại diện của bác sĩ (nếu có)
 *       404:
 *         description: Không tìm thấy chẩn đoán cho bệnh nhân này
 *       500:
 *         description: Lỗi máy chủ khi lấy thông tin chẩn đoán
 */
router.get("/patient/:ptID", controller.getDiagnosisByPatient);

/**
 * @swagger
 * /api/diagnosis/detail/{id}:
 *   get:
 *     summary: Lấy chi tiết chẩn đoán theo ID
 *     description: API này trả về thông tin chi tiết của một chẩn đoán, bao gồm kết quả, ghi chú, thông tin cuộc hẹn, bác sĩ, đơn thuốc và hình ảnh kết quả.
 *     tags:
 *       - Diagnosis
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chẩn đoán cần lấy thông tin
 *         example: 1
 *     responses:
 *       200:
 *         description: Trả về thông tin chi tiết của chẩn đoán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                   description: ID của chẩn đoán
 *                 ket_qua_chan_doan:
 *                   type: string
 *                   example: "Đau đầu mãn tính"
 *                   description: Kết quả chẩn đoán của bác sĩ
 *                 ghi_chu_them:
 *                   type: string
 *                   example: "Nhớ uống thuốc đầy đủ mỗi khi đông về"
 *                   description: Ghi chú thêm của bác sĩ
 *                 ma_cuoc_hen:
 *                   type: integer
 *                   example: 22
 *                   description: Mã cuộc hẹn liên quan đến chẩn đoán
 *                 ma_bac_si:
 *                   type: string
 *                   example: "BS0000001"
 *                   description: Mã bác sĩ thực hiện chẩn đoán
 *                 Cuoc_hen:
 *                   type: object
 *                   properties:
 *                     dia_chi_phong_kham:
 *                       type: string
 *                       example: "18 Hùng Vương, TP.HCM"
 *                       description: Địa chỉ phòng khám
 *                     Gio_hen:
 *                       type: object
 *                       properties:
 *                         thoi_diem_bat_dau:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-03-28T06:15:00.000Z"
 *                           description: Thời điểm bắt đầu cuộc hẹn
 *                         thoi_diem_ket_thuc:
 *                           type: string
 *                           format: date-time
 *                           example: "2025-03-28T06:30:00.000Z"
 *                           description: Thời điểm kết thúc cuộc hẹn
 *                 Bac_si:
 *                   type: object
 *                   properties:
 *                     ho_va_ten:
 *                       type: string
 *                       example: "Nguyễn Trung Hiếu"
 *                       description: Họ và tên bác sĩ
 *                     avt_url:
 *                       type: string
 *                       nullable: true
 *                       example: null
 *                       description: URL ảnh đại diện của bác sĩ
 *                     chuyen_khoa:
 *                       type: string
 *                       example: "Nội tổng quát"
 *                       description: Chuyên khoa của bác sĩ
 *                 Hinh_anh_ket_qua:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         example: "https://example.com/result1.png"
 *                         description: URL hình ảnh kết quả chẩn đoán
 *                 Don_thuoc:
 *                   type: object
 *                   properties:
 *                     ngay_bat_dau:
 *                       type: string
 *                       format: date
 *                       example: "2025-03-31"
 *                       description: Ngày bắt đầu sử dụng đơn thuốc
 *                     ngay_ket_thuc:
 *                       type: string
 *                       format: date
 *                       example: "2025-04-30"
 *                       description: Ngày kết thúc sử dụng đơn thuốc
 *                     id:
 *                       type: integer
 *                       example: 1
 *                       description: ID của đơn thuốc
 *                     ghi_chu:
 *                       type: string
 *                       example: "Uống thuốc đúng giờ"
 *                       description: Ghi chú của bác sĩ về đơn thuốc
 *                     Don_chua_thuoc:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                             description: ID của thuốc trong đơn
 *                           ten_thuoc:
 *                             type: string
 *                             example: "Panadol"
 *                             description: Tên thuốc
 *                           don_vi:
 *                             type: string
 *                             example: "viên"
 *                             description: Đơn vị thuốc
 *                           tong_so:
 *                             type: integer
 *                             example: 31
 *                             description: Tổng số lượng thuốc cần uống
 *       404:
 *         description: Không tìm thấy thông tin chẩn đoán
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/detail/:id", controller.getDiagnosisDetail);

/**
 * @swagger
 * /api/diagnosis/medicine_schedule:
 *   get:
 *     summary: Lấy lịch trình thuốc của bệnh nhân theo khoảng thời gian
 *     description: API này trả về lịch trình thuốc của bệnh nhân trong khoảng thời gian từ startDate đến endDate, bao gồm thông tin về các lần uống thuốc.
 *     tags:
 *       - Diagnosis
 *     parameters:
 *       - in: query
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân cần lấy lịch trình thuốc
 *         example: "BN0000006"
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (theo định dạng YYYY-MM-DD)
 *         example: "2025-03-31"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (theo định dạng YYYY-MM-DD)
 *         example: "2025-04-02"
 *     responses:
 *       200:
 *         description: Trả về lịch trình thuốc thành công
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
 *                   id_ket_qua:
 *                     type: integer
 *                     example: 1
 *                   ngay_bat_dau:
 *                     type: string
 *                     format: date
 *                     example: "2025-03-31"
 *                   ngay_ket_thuc:
 *                     type: string
 *                     format: date
 *                     example: "2025-04-30"
 *                   trang_thai:
 *                     type: string
 *                     example: "Đang chờ"
 *                   ghi_chu:
 *                     type: string
 *                     example: "Uống thuốc đúng giờ"
 *                   ten_don_thuoc:
 *                     type: string
 *                     example: "Thuốc đau đầu"
 *                   ma_benh_nhan:
 *                     type: string
 *                     example: "BN0000006"
 *                   Lan_uong:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         gio:
 *                           type: string
 *                           format: time
 *                           example: "08:00:00"
 *                         ngay:
 *                           type: string
 *                           format: date
 *                           example: "2025-04-01"
 *                         don_thuoc:
 *                           type: integer
 *                           example: 1
 *                         nhac_nho:
 *                           type: boolean
 *                           example: true
 *                         thoi_diem_da_uong:
 *                           type: string
 *                           format: date-time
 *                           nullable: true
 *                           example: null
 *                         buoi_uong:
 *                           type: string
 *                           example: "Sáng"
 *       404:
 *         description: Không tìm thấy lịch trình thuốc cho bệnh nhân này
 *       500:
 *         description: Lỗi máy chủ
 */
//input ptID, startDate, endDate
router.get("/medicine_schedule", controller.getMedicineSchedule);

/**
 * @swagger
 * /api/diagnosis/medicine_schedule/{id}:
 *   put:
 *     summary: Cập nhật lịch trình thuốc của bệnh nhân
 *     description: API này cập nhật thời gian uống thuốc cho một lịch trình thuốc của bệnh nhân.
 *     tags:
 *       - Diagnosis
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch trình thuốc cần cập nhật
 *         example: 30
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newTime:
 *                 type: string
 *                 format: time
 *                 description: Thời gian mới (theo định dạng HH:MM:SS)
 *                 example: "09:30:00"
 *     responses:
 *       200:
 *         description: Cập nhật lịch trình thuốc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 30
 *                 gio:
 *                   type: string
 *                   format: time
 *                   example: "09:30:00"
 *                 ngay:
 *                   type: string
 *                   format: date
 *                   example: "2025-04-29"
 *                 don_thuoc:
 *                   type: integer
 *                   example: 1
 *                 nhac_nho:
 *                   type: boolean
 *                   example: true
 *                 thoi_diem_da_uong:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *                 buoi_uong:
 *                   type: string
 *                   example: "Sáng"
 *       404:
 *         description: Không tìm thấy lịch trình thuốc
 *       500:
 *         description: Lỗi máy chủ
 */
router.put("/medicine_schedule/:id", controller.updateMedicineSchedule);

/**
 * @swagger
 * /api/diagnosis/medicine_schedule:
 *   put:
 *     summary: Cập nhật toàn bộ thời gian uống thuốc theo buổi (Sáng/Trưa/Chiều) cho một đơn thuốc
 *     tags:
 *       - Diagnosis
 *     parameters:
 *       - in: query
 *         name: prescriptionID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đơn thuốc
 *         example: 38
 *       - in: query
 *         name: doseTime
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Sáng, Trưa, Chiều]
 *         description: Buổi uống thuốc cần cập nhật
 *         example: Sáng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newTime:
 *                 type: string
 *                 format: time
 *                 description: Thời gian mới cho buổi uống thuốc (HH:mm:ss)
 *                 example: "07:30:00"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 example: "Cập nhật thành công lịch trình thuốc"
 *       400:
 *         description: Thiếu thông tin đầu vào
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Thiếu thông tin đơn thuốc, buổi uống hoặc thời gian mới
 *       500:
 *         description: Lỗi máy chủ khi cập nhật dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Lỗi khi cập nhật lịch trình thuốc theo thời gian uống
 */

router.put(
  "/medicine_schedule",
  controller.updateAllMedicineScheduleByDoseTime
);

/**
 * @swagger
 * /api/diagnosis/medicine_schedule/toggle/{id}:
 *   get:
 *     summary: Thay đổi trạng thái của lịch trình thuốc
 *     description: API này thay đổi trạng thái của lịch trình thuốc bằng cách đánh dấu thuốc đã được uống hoặc chưa được uống.
 *     tags:
 *       - Diagnosis
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch trình thuốc cần thay đổi trạng thái
 *         example: 30
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái lịch trình thuốc thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 30
 *                 gio:
 *                   type: string
 *                   format: time
 *                   example: "09:30:00"
 *                 ngay:
 *                   type: string
 *                   format: date
 *                   example: "2025-04-29"
 *                 don_thuoc:
 *                   type: integer
 *                   example: 1
 *                 nhac_nho:
 *                   type: boolean
 *                   example: true
 *                 thoi_diem_da_uong:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2025-04-03T03:10:19.742Z"
 *                 buoi_uong:
 *                   type: string
 *                   example: "Sáng"
 *       404:
 *         description: Không tìm thấy lịch trình thuốc
 *       500:
 *         description: Lỗi máy chủ
 */
router.get(
  "/medicine_schedule/toggle/:id",
  controller.toggleMedicineScheduleStatus
);

/**
 * @swagger
 * /api/diagnosis/medicine_schedule/{id}:
 *   get:
 *     tags:
 *       - Diagnosis
 *     summary: "Lấy lịch thông tin lần uống thuốc theo ID"
 *     description: "API này trả về thông tin lịch trình thuốc cho một người bệnh dựa trên ID lịch trình."
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: "ID của lịch trình thuốc cần lấy."
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: "Lịch trình thuốc được trả về thành công."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: "ID của lịch trình thuốc"
 *                   example: 1
 *                 gio:
 *                   type: string
 *                   description: "Giờ của lịch trình thuốc"
 *                   example: "08:00:00"
 *                 ngay:
 *                   type: string
 *                   format: date
 *                   description: "Ngày của lịch trình thuốc"
 *                   example: "2025-03-31"
 *                 don_thuoc:
 *                   type: integer
 *                   description: "ID của đơn thuốc"
 *                   example: 1
 *                 nhac_nho:
 *                   type: boolean
 *                   description: "Cờ nhắc nhở thuốc"
 *                   example: true
 *                 thoi_diem_da_uong:
 *                   type: string
 *                   format: date-time
 *                   description: "Thời điểm thuốc đã được uống"
 *                   example: "2025-04-03T03:10:19.742Z"
 *                 buoi_uong:
 *                   type: string
 *                   description: "Buổi uống thuốc"
 *                   example: "Sáng"
 *                 Thuoc_uong:
 *                   type: array
 *                   description: "Danh sách thuốc trong một lần uống"
 *                   items:
 *                     type: object
 *                     properties:
 *                       so_luong:
 *                         type: integer
 *                         description: "Số lượng của mỗi loại thuốc"
 *                         example: 2
 *                       id:
 *                         type: integer
 *                         description: "ID của thuốc"
 *                         example: 1
 *                       ten_thuoc:
 *                         type: string
 *                         description: "Tên thuốc"
 *                         example: "Panadol"
 *                       don_vi:
 *                         type: string
 *                         description: "Đơn vị của thuốc"
 *                         example: "Viên nén"
 *                       url:
 *                         type: string
 *                         description: "URL hình ảnh của thuốc"
 *                         example: "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00005713_panadol_extra_do_500mg_180v_sanofi_3541_63d7_large_72b42bbdda.jpg"
 *                 Don_thuoc:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: "ID của đơn thuốc"
 *                       example: 1
 *                     ten_don_thuoc:
 *                       type: string
 *                       description: "Tên đơn thuốc"
 *                       example: "Thuốc đau đầu"
 *                     ghi_chu:
 *                       type: string
 *                       description: "Ghi chú của đơn thuốc"
 *                       example: "Uống thuốc đúng giờ"
 *       404:
 *         description: "Không tìm thấy lịch trình thuốc với ID đã cho."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Không tìm thấy lịch trình thuốc với ID đã cho."
 *       500:
 *         description: "Lỗi server."
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi server. Vui lòng thử lại sau."
 */
router.get("/medicine_schedule/:id", controller.getMedicineScheduleByID);

router.put("/appointment/:appID", controller.updateDiagnosis);

router.post("/prescription", controller.createPrescription);

/**
 * @swagger
 *   /api/diagnosis/medicine:
 *   get:
 *     summary: Lấy danh sách thuốc
 *     tags:
 *       - Medicine
 *     responses:
 *       200:
 *         description: Danh sách các loại thuốc
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 ten_thuoc: "Panadol"
 *                 mo_ta: "Panadol Extra được sản xuất bởi GlaxoSmithKline (GSK) chứa paracetamol là một chất hạ sốt, giảm đau và caffeine là một chất tăng cường tác dụng giảm đau của paracetamol. Thuốc được khuyến cáo để điều trị hầu hết các triệu chứng đau từ nhẹ đến vừa và hạ sốt, ví dụ như đau đầu, kể cả đau nửa đầu, đau lưng, đau răng, đau khớp và đau bụng kinh, giảm các triệu chứng cảm lạnh, cảm cúm và đau họng."
 *                 don_vi: "Viên nén"
 *                 cong_dung: "Thuốc Panadol Extra chứa paracetamol là một chất hạ sốt, giảm đau và caffeine là một chất tăng cường tác dụng giảm đau của paracetamol. Thuốc Panadol được khuyến cáo để điều trị hầu hết các triệu chứng đau từ nhẹ đến vừa và hạ sốt, ví dụ như đau đầu, kể cả đau nửa đầu, đau lưng, đau răng, đau khớp và đau bụng kinh, giảm các triệu chứng cảm lạnh, cảm cúm và đau họng."
 *                 cach_dung: "Thuốc dùng đường uống và có thể dùng khi bụng đói. Nên dùng 1 hoặc 2 viên mỗi 4 đến 6 giờ nếu cần. Thời gian tối thiểu dùng liều lặp lại: 4 giờ. Nên sử dụng liều thấp nhất cần thiết để có hiệu quả trong thời gian điều trị ngắn nhất."
 *                 chong_chi_dinh: "Thuốc Panadol Extra chống chỉ định trong trường hợp bệnh nhân có tiền sử quá mẫn với paracetamol, caffeine hoặc với bất kỳ tá dược nào của thuốc."
 *                 url: "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00005713_panadol_extra_do_500mg_180v_sanofi_3541_63d7_large_72b42bbdda.jpg"
 *       500:
 *         description: Lỗi server
 */

router.get("/medicine", controller.getMedicineList);

/**
 * @swagger
 *   /api/diagnosis/medicine/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của thuốc theo ID
 *     tags:
 *       - Medicine
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID của thuốc
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của thuốc
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               ten_thuoc: "Panadol"
 *               mo_ta: "Panadol Extra được sản xuất bởi GlaxoSmithKline (GSK) chứa paracetamol là một chất hạ sốt, giảm đau và caffeine là một chất tăng cường tác dụng giảm đau của paracetamol. Thuốc được khuyến cáo để điều trị hầu hết các triệu chứng đau từ nhẹ đến vừa và hạ sốt, ví dụ như đau đầu, kể cả đau nửa đầu, đau lưng, đau răng, đau khớp và đau bụng kinh, giảm các triệu chứng cảm lạnh, cảm cúm và đau họng."
 *               don_vi: "Viên nén"
 *               cong_dung: "Thuốc Panadol Extra chứa paracetamol là một chất hạ sốt, giảm đau và caffeine là một chất tăng cường tác dụng giảm đau của paracetamol. Thuốc Panadol được khuyến cáo để điều trị hầu hết các triệu chứng đau từ nhẹ đến vừa và hạ sốt, ví dụ như đau đầu, kể cả đau nửa đầu, đau lưng, đau răng, đau khớp và đau bụng kinh, giảm các triệu chứng cảm lạnh, cảm cúm và đau họng."
 *               cach_dung: "Thuốc dùng đường uống và có thể dùng khi bụng đói. Nên dùng 1 hoặc 2 viên mỗi 4 đến 6 giờ nếu cần. Thời gian tối thiểu dùng liều lặp lại: 4 giờ. Nên sử dụng liều thấp nhất cần thiết để có hiệu quả trong thời gian điều trị ngắn nhất."
 *               chong_chi_dinh: "Thuốc Panadol Extra chống chỉ định trong trường hợp bệnh nhân có tiền sử quá mẫn với paracetamol, caffeine hoặc với bất kỳ tá dược nào của thuốc."
 *               url: "https://cdn.nhathuoclongchau.com.vn/unsafe/768x0/filters:quality(90)/https://cms-prod.s3-sgn09.fptcloud.com/00005713_panadol_extra_do_500mg_180v_sanofi_3541_63d7_large_72b42bbdda.jpg"
 *               Thanh_phan:
 *                 - id: 4
 *                   thuoc_id: 1
 *                   ten_thanh_phan: "Caffeine"
 *                   ham_luong: "65mg"
 *                 - id: 5
 *                   thuoc_id: 1
 *                   ten_thanh_phan: "Paracetamol"
 *                   ham_luong: "500mg"
 *       404:
 *         description: Không tìm thấy thuốc với ID đã cung cấp
 *       500:
 *         description: Lỗi server
 */

router.get("/medicine/:id", controller.getMedicineByID);

//Xóa nhiều thuốc
router.delete("/medicine", controller.deleteMedicineList);

//Sửa thông tin thuốc
router.put("/medicine/:id", controller.updateMedicine);

//Thêm thuốc
router.post("/medicine", controller.createMedicine);

router.get("/appointment/:appID", controller.getDiagnosisDetailByAppointmentID);

//Về chia sẻ các kết quả khám bệnh
/**
 * @swagger
 * /api/diagnosis/from_other/patient/{ptID}:
 *   get:
 *     summary: Lấy danh sách chẩn đoán từ bác sĩ khác cho bệnh nhân
 *     description: Trả về danh sách các chẩn đoán từ các bác sĩ khác với thông tin cơ bản về bác sĩ và trạng thái làm việc
 *     tags:
 *       - Diagnosis
 *     parameters:
 *       - in: path
 *         name: ptID
 *         schema:
 *           type: string
 *         required: true
 *         description: Mã bệnh nhân cần lấy chẩn đoán
 *         example: BN0000006
 *     responses:
 *       200:
 *         description: Thành công - trả về danh sách chẩn đoán
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ho_va_ten_bac_si:
 *                     type: string
 *                     description: Họ và tên bác sĩ chẩn đoán
 *                     example: Nguyễn Trung Hiếu
 *                   avt_url_bac_si:
 *                     type: string
 *                     format: uri
 *                     description: URL ảnh đại diện bác sĩ
 *                     example: https://res.cloudinary.com/dpquv4bcu/image/upload/v1744614905/avatar/e9juhyvm3o5t44cuk9v6.jpg
 *                   ma_bac_si:
 *                     type: string
 *                     description: Mã định danh bác sĩ
 *                     example: BS0000001
 *                   ma_benh_nhan:
 *                     type: string
 *                     description: Mã định danh bệnh nhân
 *                     example: BN0000006
 *                   duoc_chia_se:
 *                     type: boolean
 *                     description: Bác sĩ có chia sẻ thông tin chẩn đoán hay không
 *                     example: false
 *                   lam_viec_onl:
 *                     type: boolean
 *                     description: Bác sĩ làm việc online hay không
 *                     example: true
 *                   thoi_diem_bat_dau:
 *                     type: string
 *                     format: date-time
 *                     description: Thời điểm bắt đầu chẩn đoán
 *                     example: "2025-05-07T01:30:00.000Z"
 *                   id_cuoc_hen:
 *                     type: integer
 *                     description: Mã định danh cuộc hẹn
 *                     example: 1
 *             examples:
 *               example-1:
 *                 summary: Ví dụ dữ liệu trả về
 *                 value: [
 *                   {
 *                     "ho_va_ten_bac_si": "Nguyễn Trung Hiếu",
 *                     "avt_url_bac_si": "https://res.cloudinary.com/dpquv4bcu/image/upload/v1744614905/avatar/e9juhyvm3o5t44cuk9v6.jpg",
 *                     "ma_bac_si": "BS0000001",
 *                     "ma_benh_nhan": "BN0000006",
 *                     "duoc_chia_se": false,
 *                     "lam_viec_onl": false,
 *                     "thoi_diem_bat_dau": "2025-05-07T01:30:00.000Z",
 *                     "id_cuoc_hen": 1
 *                   },
 *                   {
 *                     "ho_va_ten_bac_si": "Nguyễn Trung Hiếu",
 *                     "avt_url_bac_si": "https://res.cloudinary.com/dpquv4bcu/image/upload/v1744614905/avatar/e9juhyvm3o5t44cuk9v6.jpg",
 *                     "ma_bac_si": "BS0000001",
 *                     "ma_benh_nhan": "BN0000006",
 *                     "duoc_chia_se": false,
 *                     "lam_viec_onl": true,
 *                     "thoi_diem_bat_dau": "2025-03-24T07:45:00.000Z",
 *                     "id_cuoc_hen": 2
 *                   }
 *                 ]
 */
router.get("/from_other/patient/:ptID", controller.getDiagnosisFromOther);

router.get("/is_shared/appointment/:appID", controller.getIsShared);

router.get("/patients/:drID", controller.getPatientsByDoctorID);

router.get("/hidden_state/:drID/:ptID", controller.getHiddenState);

router.put("/hidden_state/:drID/:ptID", controller.updateHiddenState);

router.put("/share_all/patient/:ptID", controller.updateShareAllForPatient);

router.put("/share_all/doctor/:drID", controller.updateShareAllForDoctor);

router.get("/share_all/patient/:ptID", controller.getShareAllForPatient);

router.get("/share_all/doctor/:drID", controller.getShareAllForDoctor);

module.exports = router;
