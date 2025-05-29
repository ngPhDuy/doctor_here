const express = require("express");
const router = express.Router();
const controller = require("../controllers/tracker.controller.js");

//BMI
/**
 * @swagger
 * /api/tracker/bmi/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu BMI trung bình hàng ngày của bệnh nhân
 *     description: API này dùng để lấy chỉ số trung bình chiều cao và cân nặng theo ngày của một bệnh nhân trong khoảng thời gian chỉ định.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: 2025-03-31
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: 2025-04-04
 *     responses:
 *       200:
 *         description: Danh sách chỉ số BMI trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     format: date
 *                     description: Ngày ghi nhận
 *                     example: "2025-04-01"
 *                   trung_binh_can_nang:
 *                     type: number
 *                     description: Trung bình cân nặng (kg)
 *                     example: 68
 *                   trung_binh_chieu_cao:
 *                     type: number
 *                     description: Trung bình chiều cao (cm)
 *                     example: 171
 *       500:
 *         description: Lỗi khi lấy dữ liệu BMI hàng ngày
 */
router.get("/bmi/daily/:ptID", controller.getDailyBMI);

/**
 * @swagger
 * /api/tracker/bmi/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu BMI trung bình hàng tháng của bệnh nhân
 *     description: API này dùng để truy xuất chỉ số trung bình chiều cao và cân nặng theo tháng của một bệnh nhân trong khoảng thời gian chỉ định.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d{4}-\\d{2}$"
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: 2025-02
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d{4}-\\d{2}$"
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: 2025-04
 *     responses:
 *       200:
 *         description: Danh sách chỉ số BMI trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     description: Thời điểm ghi nhận (theo tháng)
 *                     example: "2025-03"
 *                   trung_binh_can_nang:
 *                     type: number
 *                     description: Trung bình cân nặng (kg)
 *                     example: 67
 *                   trung_binh_chieu_cao:
 *                     type: number
 *                     description: Trung bình chiều cao (cm)
 *                     example: 171
 *       500:
 *         description: Lỗi khi lấy dữ liệu BMI hàng tháng
 */
router.get("/bmi/monthly/:ptID", controller.getMonthlyBMI);

/**
 * @swagger
 * /api/tracker/bmi/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu BMI trung bình hàng năm của bệnh nhân
 *     description: API này dùng để truy xuất chỉ số trung bình chiều cao và cân nặng theo năm của một bệnh nhân trong khoảng thời gian chỉ định.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d{4}$"
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: 2024
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d{4}$"
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: 2025
 *     responses:
 *       200:
 *         description: Danh sách chỉ số BMI trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     description: Thời điểm ghi nhận (theo năm)
 *                     example: "2025"
 *                   trung_binh_can_nang:
 *                     type: number
 *                     description: Trung bình cân nặng (kg)
 *                     example: 68
 *                   trung_binh_chieu_cao:
 *                     type: number
 *                     description: Trung bình chiều cao (cm)
 *                     example: 170.67
 *       500:
 *         description: Lỗi khi lấy dữ liệu BMI hàng năm
 */
router.get("/bmi/yearly/:ptID", controller.getYearlyBMI);

//DailyStep

/**
 * @swagger
 * /api/tracker/steps/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu số bước đi hàng ngày của bệnh nhân
 *     description: API này cho phép truy xuất tổng số bước đi mỗi ngày trong một khoảng thời gian nhất định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: 2024-03-30
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: 2025-04-03
 *     responses:
 *       200:
 *         description: Danh sách số bước đi hàng ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     format: date-time
 *                     description: Ngày ghi nhận dữ liệu
 *                     example: "2025-02-01T16:58:00.000Z"
 *                   tong_so_buoc:
 *                     type: integer
 *                     description: Tổng số bước đi trong ngày
 *                     example: 3200
 *       500:
 *         description: Lỗi khi lấy dữ liệu số bước đi hàng ngày
 */
router.get("/steps/daily/:ptID", controller.getDailySteps);

/**
 * @swagger
 * /api/tracker/steps/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu số bước đi trung bình theo tháng
 *     description: API này trả về số bước đi trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-\d{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: 2025-01
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^\d{4}-\d{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: 2025-03
 *     responses:
 *       200:
 *         description: Danh sách số bước đi trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     pattern: '^\d{4}-\d{2}$'
 *                     description: Tháng ghi nhận dữ liệu
 *                     example: "2025-02"
 *                   trung_binh_buoc_di:
 *                     type: number
 *                     format: float
 *                     description: Số bước đi trung bình trong tháng
 *                     example: 4523.75
 *       500:
 *         description: Lỗi khi lấy dữ liệu số bước đi theo tháng
 */
router.get("/steps/monthly/:ptID", controller.getMonthlySteps);

/**
 * @swagger
 * /api/tracker/steps/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu số bước đi trung bình hàng năm của bệnh nhân
 *     description: API này dùng để truy xuất số bước đi trung bình mỗi năm trong một khoảng thời gian chỉ định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d{4}$"
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: 2024
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: "^\\d{4}$"
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: 2025
 *     responses:
 *       200:
 *         description: Danh sách số bước trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     description: Năm ghi nhận
 *                     example: "2025"
 *                   trung_binh_buoc_di:
 *                     type: number
 *                     description: Trung bình số bước đi
 *                     example: 4046.6704545454545
 *       500:
 *         description: Lỗi khi lấy dữ liệu số bước đi hàng năm
 */
router.get("/steps/yearly/:ptID", controller.getYearlySteps);

//HeartBeat
/**
 * @swagger
 * /api/tracker/heartbeat/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhịp tim trung bình theo ngày
 *     description: API này trả về nhịp tim trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: 2025-02-01
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: 2025-02-05
 *     responses:
 *       200:
 *         description: Danh sách nhịp tim trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     format: date
 *                     description: Ngày ghi nhận
 *                     example: "2025-02-01"
 *                   trung_binh_nhip_tim:
 *                     type: number
 *                     format: float
 *                     description: Nhịp tim trung bình, đơn vị bpm
 *                     example: 96.77
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhịp tim hàng ngày
 */
router.get("/heartbeat/daily/:ptID", controller.getDailyHeartBeat);

/**
 * @swagger
 * /api/tracker/heartbeat/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhịp tim trung bình theo tháng
 *     description: API này trả về nhịp tim trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: 2025-01
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: 2025-03
 *     responses:
 *       200:
 *         description: Danh sách nhịp tim trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_nhip_tim:
 *                     type: number
 *                     format: float
 *                     description: Nhịp tim trung bình trong tháng
 *                     example: 88.25
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhịp tim theo tháng
 */
router.get("/heartbeat/monthly/:ptID", controller.getMonthlyHeartBeat);

/**
 * @swagger
 * /api/tracker/heartbeat/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhịp tim trung bình theo năm
 *     description: API này trả về nhịp tim trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: 2024
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: 2025
 *     responses:
 *       200:
 *         description: Danh sách nhịp tim trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_nhip_tim:
 *                     type: number
 *                     format: float
 *                     description: Nhịp tim trung bình trong năm
 *                     example: 85.34
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhịp tim theo năm
 */
router.get("/heartbeat/yearly/:ptID", controller.getYearlyHeartBeat);

//BreathBeat
/**
 * @swagger
 * /api/tracker/breath/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhịp thở trung bình theo ngày
 *     description: API này trả về nhịp thở trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-02-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-02-05"
 *     responses:
 *       200:
 *         description: Danh sách nhịp thở trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   trung_binh_nhip_tho:
 *                     type: number
 *                     format: float
 *                     description: Nhịp thở trung bình trong ngày
 *                     example: 12.33
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhịp thở theo ngày
 */
router.get("/breath/daily/:ptID", controller.getDailyBreathBeat);

/**
 * @swagger
 * /api/tracker/breath/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhịp thở trung bình theo tháng
 *     description: API này trả về nhịp thở trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách nhịp thở trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_nhip_tho:
 *                     type: number
 *                     format: float
 *                     description: Nhịp thở trung bình trong tháng
 *                     example: 13.25
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhịp thở theo tháng
 */
router.get("/breath/monthly/:ptID", controller.getMonthlyBreathBeat);

/**
 * @swagger
 * /api/tracker/breath/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhịp thở trung bình theo năm
 *     description: API này trả về nhịp thở trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách nhịp thở trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_nhip_tho:
 *                     type: number
 *                     format: float
 *                     description: Nhịp thở trung bình trong năm
 *                     example: 12.50
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhịp thở theo năm
 */
router.get("/breath/yearly/:ptID", controller.getYearlyBreathBeat);

//BloodPressure
/**
 * @swagger
 * /api/tracker/blood_pressure/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu huyết áp trung bình theo ngày
 *     description: API này trả về huyết áp trung bình (tâm thu và tâm trương) mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-02-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-02-05"
 *     responses:
 *       200:
 *         description: Danh sách huyết áp trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   trung_binh_huyet_ap_tam_truong:
 *                     type: number
 *                     format: float
 *                     description: Huyết áp tâm trương trung bình trong ngày
 *                     example: 61.55
 *                   trung_binh_huyet_ap_tam_thu:
 *                     type: number
 *                     format: float
 *                     description: Huyết áp tâm thu trung bình trong ngày
 *                     example: 115.62
 *       500:
 *         description: Lỗi khi lấy dữ liệu huyết áp theo ngày
 */
router.get("/blood_pressure/daily/:ptID", controller.getDailyBloodPressure);

/**
 * @swagger
 * /api/tracker/blood_pressure/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu huyết áp trung bình theo tháng
 *     description: API này trả về huyết áp trung bình (tâm thu và tâm trương) mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách huyết áp trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_huyet_ap_tam_truong:
 *                     type: number
 *                     format: float
 *                     description: Huyết áp tâm trương trung bình trong tháng
 *                     example: 62.33
 *                   trung_binh_huyet_ap_tam_thu:
 *                     type: number
 *                     format: float
 *                     description: Huyết áp tâm thu trung bình trong tháng
 *                     example: 116.50
 *       500:
 *         description: Lỗi khi lấy dữ liệu huyết áp theo tháng
 */
router.get("/blood_pressure/monthly/:ptID", controller.getMonthlyBloodPressure);

/**
 * @swagger
 * /api/tracker/blood_pressure/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu huyết áp trung bình theo năm
 *     description: API này trả về huyết áp trung bình (tâm thu và tâm trương) mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách huyết áp trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_huyet_ap_tam_truong:
 *                     type: number
 *                     format: float
 *                     description: Huyết áp tâm trương trung bình trong năm
 *                     example: 63.10
 *                   trung_binh_huyet_ap_tam_thu:
 *                     type: number
 *                     format: float
 *                     description: Huyết áp tâm thu trung bình trong năm
 *                     example: 118.00
 *       500:
 *         description: Lỗi khi lấy dữ liệu huyết áp theo năm
 */
router.get("/blood_pressure/yearly/:ptID", controller.getYearlyBloodPressure);

//BloodSugar
/**
 * @swagger
 * /api/tracker/blood_sugar/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu đường huyết trung bình theo ngày
 *     description: API này trả về đường huyết trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-02-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-02-05"
 *     responses:
 *       200:
 *         description: Danh sách đường huyết trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   trung_binh_duong_huyet:
 *                     type: number
 *                     format: float
 *                     description: Đường huyết trung bình trong ngày
 *                     example: 75.35
 *       500:
 *         description: Lỗi khi lấy dữ liệu đường huyết theo ngày
 */
router.get("/blood_sugar/daily/:ptID", controller.getDailyBloodSugar);

/**
 * @swagger
 * /api/tracker/blood_sugar/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu đường huyết trung bình theo tháng
 *     description: API này trả về đường huyết trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách đường huyết trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_duong_huyet:
 *                     type: number
 *                     format: float
 *                     description: Đường huyết trung bình trong tháng
 *                     example: 76.12
 *       500:
 *         description: Lỗi khi lấy dữ liệu đường huyết theo tháng
 */
router.get("/blood_sugar/monthly/:ptID", controller.getMonthlyBloodSugar);

/**
 * @swagger
 * /api/tracker/blood_sugar/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu đường huyết trung bình theo năm
 *     description: API này trả về đường huyết trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách đường huyết trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_duong_huyet:
 *                     type: number
 *                     format: float
 *                     description: Đường huyết trung bình trong năm
 *                     example: 77.00
 *       500:
 *         description: Lỗi khi lấy dữ liệu đường huyết theo năm
 */
router.get("/blood_sugar/yearly/:ptID", controller.getYearlyBloodSugar);

//BloodOxygen
/**
 * @swagger
 * /api/tracker/blood_oxygen/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nồng độ oxy trong máu trung bình theo ngày
 *     description: API này trả về nồng độ oxy trong máu trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-02-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-02-05"
 *     responses:
 *       200:
 *         description: Danh sách nồng độ oxy trong máu trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   trung_binh_oxy_mau:
 *                     type: number
 *                     format: float
 *                     description: Nồng độ oxy trong máu trung bình trong ngày
 *                     example: 96.74
 *       500:
 *         description: Lỗi khi lấy dữ liệu nồng độ oxy trong máu theo ngày
 */
router.get("/blood_oxygen/daily/:ptID", controller.getDailyBloodOxygen);

/**
 * @swagger
 * /api/tracker/blood_oxygen/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nồng độ oxy trong máu trung bình theo tháng
 *     description: API này trả về nồng độ oxy trong máu trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách nồng độ oxy trong máu trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_oxy_mau:
 *                     type: number
 *                     format: float
 *                     description: Nồng độ oxy trong máu trung bình trong tháng
 *                     example: 97.12
 *       500:
 *         description: Lỗi khi lấy dữ liệu nồng độ oxy trong máu theo tháng
 */
router.get("/blood_oxygen/monthly/:ptID", controller.getMonthlyBloodOxygen);

/**
 * @swagger
 * /api/tracker/blood_oxygen/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nồng độ oxy trong máu trung bình theo năm
 *     description: API này trả về nồng độ oxy trong máu trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách nồng độ oxy trong máu trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_oxy_mau:
 *                     type: number
 *                     format: float
 *                     description: Nồng độ oxy trong máu trung bình trong năm
 *                     example: 96.88
 *       500:
 *         description: Lỗi khi lấy dữ liệu nồng độ oxy trong máu theo năm
 */
router.get("/blood_oxygen/yearly/:ptID", controller.getYearlyBloodOxygen);

//BodyTemperature
/**
 * @swagger
 * /api/tracker/body_temperature/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhiệt độ cơ thể trung bình theo ngày
 *     description: API này trả về nhiệt độ cơ thể trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-02-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-02-05"
 *     responses:
 *       200:
 *         description: Danh sách nhiệt độ cơ thể trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   trung_binh_nhiet_do:
 *                     type: number
 *                     format: float
 *                     description: Nhiệt độ cơ thể trung bình trong ngày
 *                     example: 36.58
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhiệt độ cơ thể theo ngày
 */
router.get("/body_temperature/daily/:ptID", controller.getDailyBodyTemperature);

/**
 * @swagger
 * /api/tracker/body_temperature/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhiệt độ cơ thể trung bình theo tháng
 *     description: API này trả về nhiệt độ cơ thể trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách nhiệt độ cơ thể trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_nhiet_do:
 *                     type: number
 *                     format: float
 *                     description: Nhiệt độ cơ thể trung bình trong tháng
 *                     example: 36.60
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhiệt độ cơ thể theo tháng
 */
router.get(
  "/body_temperature/monthly/:ptID",
  controller.getMonthlyBodyTemperature
);

/**
 * @swagger
 * /api/tracker/body_temperature/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu nhiệt độ cơ thể trung bình theo năm
 *     description: API này trả về nhiệt độ cơ thể trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách nhiệt độ cơ thể trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_nhiet_do:
 *                     type: number
 *                     format: float
 *                     description: Nhiệt độ cơ thể trung bình trong năm
 *                     example: 36.64
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhiệt độ cơ thể theo năm
 */
router.get(
  "/body_temperature/yearly/:ptID",
  controller.getYearlyBodyTemperature
);

//Distance
/**
 * @swagger
 * /api/tracker/distance/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu tổng quãng đường trung bình theo ngày
 *     description: API này trả về nồng độ oxy trong máu trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-04-06"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-04-08"
 *     responses:
 *       200:
 *         description: Danh sách tổng quãng đường theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   tong_quang_duong:
 *                     type: number
 *                     format: float
 *                     description: Tổng quãng đường đi được trong ngày
 *                     example: 2000
 *       500:
 *         description: Lỗi khi lấy dữ liệu nồng độ oxy trong máu theo ngày
 */
router.get("/distance/daily/:ptID", controller.getDailyDistance);

/**
 * @swagger
 * /api/tracker/distance/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu tổng quãng đường theo tháng
 *     description: API này trả về nồng độ oxy trong máu trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách nồng độ oxy trong máu trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   tong_quang_duong:
 *                     type: number
 *                     format: float
 *                     description: Tổng quãng đường đi được trong tháng
 *                     example: 97.12
 *       500:
 *         description: Lỗi khi lấy dữ liệu nồng độ oxy trong máu theo tháng
 */
router.get("/distance/monthly/:ptID", controller.getMonthlyDistance);

/**
 * @swagger
 * /api/tracker/distance/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu tổng quãng đường theo năm
 *     description: API này trả về nhiệt độ cơ thể trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách nhiệt độ cơ thể trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   tong_quang_duong:
 *                     type: number
 *                     format: float
 *                     description: Tổng quãng đường đi được trong năm
 *                     example: 28901
 *       500:
 *         description: Lỗi khi lấy dữ liệu nhiệt độ cơ thể theo năm
 */
router.get("/distance/yearly/:ptID", controller.getYearlyDistance);

//Height
/**
 * @swagger
 * /api/tracker/height/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu chiều cao trung bình theo ngày
 *     description: API này trả về chiều cao trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-02-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-02-05"
 *     responses:
 *       200:
 *         description: Danh sách chiều cao trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   trung_binh_chieu_cao:
 *                     type: number
 *                     format: float
 *                     description: Chiều cao trung bình trong ngày đơn vị cm
 *                     example: 165.3
 *       500:
 *         description: Lỗi khi lấy dữ liệu chiều cao trung bình theo ngày
 */
router.get("/height/daily/:ptID", controller.getDailyHeight);

/**
 * @swagger
 * /api/tracker/height/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu chiều cao trung bình theo tháng
 *     description: API này trả về chiều cao trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách chiều cao trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_chieu_cao:
 *                     type: number
 *                     format: float
 *                     description: Chiều cao trung bình trong tháng đơn vị cm
 *                     example: 166.1
 *       500:
 *         description: Lỗi khi lấy dữ liệu chiều cao trung bình theo tháng
 */
router.get("/height/monthly/:ptID", controller.getMonthlyHeight);

/**
 * @swagger
 * /api/tracker/height/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu chiều cao trung bình theo năm
 *     description: API này trả về chiều cao trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách chiều cao trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_chieu_cao:
 *                     type: number
 *                     format: float
 *                     description: Chiều cao trung bình trong năm đơn vị cm
 *                     example: 165.8
 *       500:
 *         description: Lỗi khi lấy dữ liệu chiều cao trung bình theo năm
 */
router.get("/height/yearly/:ptID", controller.getYearlyHeight);

//Weight
/**
 * @swagger
 * /api/tracker/weight/daily/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu cân nặng trung bình theo ngày
 *     description: API này trả về cân nặng trung bình mỗi ngày trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày bắt đầu (định dạng YYYY-MM-DD)
 *         example: "2025-02-01"
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Ngày kết thúc (định dạng YYYY-MM-DD)
 *         example: "2025-02-05"
 *     responses:
 *       200:
 *         description: Danh sách cân nặng trung bình theo ngày
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02-01"
 *                     description: Thời điểm ghi nhận theo ngày
 *                   trung_binh_can_nang:
 *                     type: number
 *                     format: float
 *                     description: Cân nặng trung bình trong ngày đơn vị kg
 *                     example: 58.4
 *       500:
 *         description: Lỗi khi lấy dữ liệu cân nặng trung bình theo ngày
 */
router.get("/weight/daily/:ptID", controller.getDailyWeight);

/**
 * @swagger
 * /api/tracker/weight/monthly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu cân nặng trung bình theo tháng
 *     description: API này trả về cân nặng trung bình mỗi tháng trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng bắt đầu (định dạng YYYY-MM)
 *         example: "2025-01"
 *       - in: query
 *         name: endMonth
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}-[0-9]{2}$'
 *         description: Tháng kết thúc (định dạng YYYY-MM)
 *         example: "2025-03"
 *     responses:
 *       200:
 *         description: Danh sách cân nặng trung bình theo tháng
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025-02"
 *                     description: Thời điểm ghi nhận theo tháng
 *                   trung_binh_can_nang:
 *                     type: number
 *                     format: float
 *                     description: Cân nặng trung bình trong tháng đơn vị kg
 *                     example: 59.2
 *       500:
 *         description: Lỗi khi lấy dữ liệu cân nặng trung bình theo tháng
 */
router.get("/weight/monthly/:ptID", controller.getMonthlyWeight);

/**
 * @swagger
 * /api/tracker/weight/yearly/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu cân nặng trung bình theo năm
 *     description: API này trả về cân nặng trung bình mỗi năm trong khoảng thời gian xác định của bệnh nhân.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *       - in: query
 *         name: startYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm bắt đầu (định dạng YYYY)
 *         example: "2024"
 *       - in: query
 *         name: endYear
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[0-9]{4}$'
 *         description: Năm kết thúc (định dạng YYYY)
 *         example: "2025"
 *     responses:
 *       200:
 *         description: Danh sách cân nặng trung bình theo năm
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   thoi_diem_ghi_nhan:
 *                     type: string
 *                     example: "2025"
 *                     description: Thời điểm ghi nhận theo năm
 *                   trung_binh_can_nang:
 *                     type: number
 *                     format: float
 *                     description: Cân nặng trung bình trong năm đơn vị kg
 *                     example: 60.3
 *       500:
 *         description: Lỗi khi lấy dữ liệu cân nặng trung bình theo năm
 */
router.get("/weight/yearly/:ptID", controller.getYearlyWeight);

//Add
/**
 * @swagger
 * /api/tracker/steps/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu bước đi cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu bước đi của bệnh nhân vào hệ thống theo thời gian thực. Mỗi bản ghi bao gồm số bước và thời điểm ghi nhận.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân cần thêm dữ liệu bước đi
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: integer
 *                 description: Số bước đi của bệnh nhân
 *                 example: 123
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu bước đi đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dong_bo:
 *                   type: boolean
 *                   example: false
 *                   description: Trạng thái đồng bộ dữ liệu
 *                 ma_benh_nhan:
 *                   type: string
 *                   example: "BN0000006"
 *                   description: Mã bệnh nhân
 *                 tong_so_buoc:
 *                   type: integer
 *                   example: 123
 *                   description: Tổng số bước được ghi nhận
 *                 thoi_diem_ghi_nhan:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-05-06T07:50:00.000Z"
 *                   description: Thời điểm ghi nhận dữ liệu (ISO 8601)
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu bước đi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu bước"
 */
router.post("/steps/:ptID", controller.addSteps);

/**
 * @swagger
 * /api/tracker/bmi/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu BMI cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu BMI của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 description: Dữ liệu BMI cần thêm
 *                 properties:
 *                   weight:
 *                     type: number
 *                     description: Cân nặng của bệnh nhân
 *                     example: 70.5
 *                   height:
 *                     type: number
 *                     description: Chiều cao của bệnh nhân
 *                     example: 170.0
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu BMI đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu BMI đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu BMI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu BMI"
 */
router.post("/bmi/:ptID", controller.addBMI);

/**
 * @swagger
 * /api/tracker/heartbeat/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu nhịp tim cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu nhịp tim của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị nhịp tim cần thêm
 *                 example: 85
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu nhịp tim đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu nhịp tim đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu nhịp tim
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu nhịp tim"
 */
router.post("/heartbeat/:ptID", controller.addHeartBeat);

/**
 * @swagger
 * /api/tracker/breath/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu nhịp thở cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu nhịp thở của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị nhịp thở cần thêm
 *                 example: 18
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu nhịp thở đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu nhịp thở đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu nhịp thở
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu nhịp thở"
 */
router.post("/breath/:ptID", controller.addBreathBeat);

/**
 * @swagger
 * /api/tracker/blood_pressure/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu huyết áp cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu huyết áp của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 description: Dữ liệu huyết áp cần thêm
 *                 properties:
 *                   huyet_ap_tam_truong:
 *                     type: number
 *                     description: Huyết áp tâm trương
 *                     example: 80
 *                   huyet_ap_tam_thu:
 *                     type: number
 *                     description: Huyết áp tâm thu
 *                     example: 120
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu huyết áp đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu huyết áp đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu huyết áp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu huyết áp"
 */
router.post("/blood_pressure/:ptID", controller.addBloodPressure);

/**
 * @swagger
 * /api/tracker/blood_sugar/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu đường huyết cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu đường huyết của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị đường huyết cần thêm
 *                 example: 90.5
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu đường huyết đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu đường huyết đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu đường huyết
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu đường huyết"
 */
router.post("/blood_sugar/:ptID", controller.addBloodSugar);

/**
 * @swagger
 * /api/tracker/blood_oxygen/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu oxy trong máu cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu oxy trong máu của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị oxy trong máu cần thêm
 *                 example: 98.3
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu oxy trong máu đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu oxy trong máu đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu oxy trong máu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu oxy trong máu"
 */
router.post("/blood_oxygen/:ptID", controller.addBloodOxygen);

/**
 * @swagger
 * /api/tracker/body_temperature/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu nhiệt độ cơ thể cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu nhiệt độ cơ thể của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị nhiệt độ cơ thể cần thêm
 *                 example: 36.7
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu nhiệt độ cơ thể đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu nhiệt độ cơ thể đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu nhiệt độ cơ thể
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu nhiệt độ cơ thể"
 */
router.post("/body_temperature/:ptID", controller.addBodyTemperature);

/**
 * @swagger
 * /api/tracker/distance/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu quãng đường đi bộ
 *     description: API này dùng để thêm dữ liệu quãng đường đi bộ của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị nhiệt độ cơ thể cần thêm
 *                 example: 100
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06 14:50"
 *     responses:
 *       200:
 *         description: Dữ liệu nhiệt độ cơ thể đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu nhiệt độ cơ thể đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu nhiệt độ cơ thể
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu nhiệt độ cơ thể"
 */
router.post("/distance/:ptID", controller.addDistance);

/**
 * @swagger
 * /api/tracker/height/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu chiều cao cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu huyết áp của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị chiều cao, cm
 *                 example: 167
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06T14:50:00+07:00"
 *     responses:
 *       200:
 *         description: Dữ liệu huyết áp đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu huyết áp đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu huyết áp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu huyết áp"
 */
router.post("/height/:ptID", controller.addHeight);

/**
 * @swagger
 * /api/tracker/weight/{ptID}:
 *   post:
 *     summary: Thêm dữ liệu cân nặng cho bệnh nhân
 *     description: API này dùng để thêm dữ liệu huyết áp của bệnh nhân vào hệ thống.
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: "BN0000006"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *                 description: Giá trị cân nặng, kg
 *                 example: 167
 *               timeStamp:
 *                 type: string
 *                 format: date-time
 *                 description: Thời điểm ghi nhận dữ liệu (định dạng yyyy-MM-dd HH:mm)
 *                 example: "2025-05-06T14:50:00+07:00"
 *     responses:
 *       200:
 *         description: Dữ liệu huyết áp đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Dữ liệu huyết áp đã được thêm thành công"
 *       500:
 *         description: Lỗi hệ thống khi thêm dữ liệu huyết áp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi thêm dữ liệu huyết áp"
 */
router.post("/weight/:ptID", controller.addWeight);

//Sync

/**
 * @swagger
 * /api/tracker/sync/{ptID}:
 *   get:
 *     summary: Lấy dữ liệu chỉ số sức khỏe của bệnh nhân tại một thời điểm cụ thể
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *     responses:
 *       200:
 *         description: Dữ liệu đồng bộ thành công hoặc null nếu không có dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     dong_bo:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Định dạng thời gian không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Định dạng thời gian không hợp lệ
 *       500:
 *         description: Lỗi khi lấy dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Lỗi khi lấy dữ liệu
 */
router.get("/sync/:ptID", controller.getSyncData);

/**
 * @swagger
 * /api/tracker/sync/{ptID}:
 *   put:
 *     summary: Cập nhật trạng thái đồng bộ của dữ liệu sức khỏe tại một thời điểm cụ thể
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newSync
 *             properties:
 *               newSync:
 *                 type: boolean
 *                 description: Trạng thái đồng bộ mới
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ma_benh_nhan:
 *                   type: string
 *                   example: BN0000006
 *                 thoi_diem_ghi_nhan:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-02-02T16:59:00.000Z
 *                 tong_so_buoc:
 *                   type: integer
 *                   example: 3305
 *                 dong_bo:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Dữ liệu không hợp lệ hoặc không tìm thấy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Không tìm thấy dữ liệu
 *       500:
 *         description: Lỗi khi cập nhật dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Lỗi khi cập nhật dữ liệu
 */
router.put("/sync/:ptID", controller.updateSyncData);

/**
 * @swagger
 * /api/tracker/latest/{type}/{ptID}:
 *   get:
 *     summary: Lấy chỉ số sức khỏe mới nhất của bệnh nhân theo loại
 *     tags:
 *       - Tracker
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum:
 *             - steps
 *             - bmi
 *             - heartbeat
 *             - breath
 *             - blood_pressure
 *             - blood_sugar
 *             - blood_oxygen
 *             - body_temperature
 *             - distance
 *             - height
 *             - weight
 *         description: Loại chỉ số sức khỏe cần lấy
 *         example: heartbeat
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *     responses:
 *       200:
 *         description: Trả về bản ghi mới nhất của loại chỉ số đã chọn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ma_benh_nhan:
 *                   type: string
 *                   example: BN0000006
 *                 gia_tri:
 *                   type: number
 *                   example: 78
 *                 thoi_diem_ghi_nhan:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-05-06T08:15:00.000Z
 *                 dong_bo:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: Không tìm thấy dữ liệu tương ứng
 *         content:
 *           application/json:
 *             example: null
 *       400:
 *         description: Yêu cầu không hợp lệ hoặc lỗi xử lý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Tham số type không hợp lệ
 */
router.get("/latest/:type/:ptID", controller.getLatestData);

module.exports = router;
