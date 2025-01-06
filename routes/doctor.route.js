const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
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
 *     description: API này trả về danh sách toàn bộ bác sĩ, bao gồm thông tin liên quan từ bảng User.
 *     responses:
 *       200:
 *         description: Danh sách bác sĩ được trả về thành công.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Lỗi từ server khi xử lý yêu cầu.
 */
router.get('/', doctorController.getAllDoctor);
/**
 * @swagger
 * /api/doctor/{doctorID}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một bác sĩ
 *     description: API này trả về thông tin chi tiết của một bác sĩ dựa trên mã bác sĩ (doctorID).
 *     parameters:
 *       - in: path
 *         name: doctorID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã định danh của bác sĩ cần lấy thông tin.
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của bác sĩ được trả về thành công.
 *         content:
 *           application/json:
 *             schema:
 *              $ref: '#/components/schemas/Doctor'
 *       500:
 *         description: Lỗi từ server khi xử lý yêu cầu.
 */
router.get('/:doctorID', doctorController.getDoctorInfo);

module.exports = router;