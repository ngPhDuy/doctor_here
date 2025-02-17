const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');

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
 *                 $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Lỗi từ server khi xử lý yêu cầu.
 */
router.get('/', patientController.getAllPatient);
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
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của bệnh nhân được trả về thành công.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Patient'
 *       500:
 *         description: Lỗi từ server khi xử lý yêu cầu.
 */
router.get('/detail/:patientID', patientController.getPatientInfo);

module.exports = router;