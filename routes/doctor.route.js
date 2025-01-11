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
 *     tags: [Doctor]
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
 *     tags: [Doctor]
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
/**
 * @swagger
 * /api/doctor/change_info:
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

router.post('/change_info', doctorController.changeInfo);
module.exports = router;