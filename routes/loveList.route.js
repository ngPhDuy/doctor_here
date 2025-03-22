const express = require("express");
const router = express.Router();
const controller = require("../controllers/loveList.controller");

/**
 * @swagger
 * /api/loveList:
 *   post:
 *     summary: Thêm bác sĩ vào danh sách yêu thích của bệnh nhân
 *     description: API này cho phép bệnh nhân thêm một bác sĩ vào danh sách yêu thích của mình.
 *     tags:
 *       - Love List
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ptID:
 *                 type: string
 *                 example: "BN0000006"
 *                 description: Mã bệnh nhân
 *               drID:
 *                 type: string
 *                 example: "BS0000002"
 *                 description: Mã bác sĩ cần thêm vào danh sách yêu thích
 *     responses:
 *       200:
 *         description: Thêm bác sĩ vào danh sách yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ma_benh_nhan:
 *                   type: string
 *                   example: "BN0000006"
 *                   description: Mã bệnh nhân
 *                 ma_bac_si:
 *                   type: string
 *                   example: "BS0000002"
 *                   description: Mã bác sĩ đã được thêm vào danh sách yêu thích
 *       400:
 *         description: Yêu cầu không hợp lệ (bác sĩ đã có trong danh sách yêu thích)
 *       500:
 *         description: Lỗi máy chủ
 */

router.post("/", controller.addDoctorToLoveList);
/**
 * @swagger
 * /api/loveList/patient/{ptID}:
 *   get:
 *     summary: Lấy danh sách bác sĩ yêu thích của bệnh nhân
 *     description: API này trả về danh sách các bác sĩ mà bệnh nhân đã thêm vào danh sách yêu thích.
 *     tags:
 *       - Love List
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân cần lấy danh sách yêu thích
 *         example: "BN0000006"
 *     responses:
 *       200:
 *         description: Trả về danh sách bác sĩ yêu thích của bệnh nhân
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ma_benh_nhan:
 *                     type: string
 *                     example: "BN0000006"
 *                     description: Mã bệnh nhân
 *                   ma_bac_si:
 *                     type: string
 *                     example: "BS0000002"
 *                     description: Mã bác sĩ được yêu thích
 *                   Bac_si:
 *                     type: object
 *                     properties:
 *                       dia_chi_pk:
 *                         type: string
 *                         example: "Phòng khám B, Quận 2"
 *                         description: Địa chỉ phòng khám của bác sĩ
 *                       chuyen_khoa:
 *                         type: string
 *                         example: "Nội tổng quát"
 *                         description: Chuyên khoa của bác sĩ
 *                       Nguoi_dung:
 *                         type: object
 *                         properties:
 *                           ho_va_ten:
 *                             type: string
 *                             example: "Nguyễn Trung Nghĩa"
 *                             description: Họ và tên bác sĩ
 *                           avt_url:
 *                             type: string
 *                             nullable: true
 *                             example: null
 *                             description: URL ảnh đại diện của bác sĩ (có thể null)
 *       404:
 *         description: Không tìm thấy danh sách yêu thích cho bệnh nhân này
 *       500:
 *         description: Lỗi máy chủ
 */
router.get("/patient/:ptID", controller.getLoveListByPatient);
/**
 * @swagger
 * /api/loveList/patient/{ptID}/doctor/{drID}:
 *   delete:
 *     summary: Xóa bác sĩ khỏi danh sách yêu thích của bệnh nhân
 *     description: API này cho phép bệnh nhân xóa một bác sĩ khỏi danh sách yêu thích của mình.
 *     tags:
 *       - Love List
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân muốn xóa bác sĩ khỏi danh sách yêu thích
 *         example: "BN0000006"
 *       - in: path
 *         name: drID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bác sĩ cần xóa khỏi danh sách yêu thích
 *         example: "BS0000002"
 *     responses:
 *       200:
 *         description: Xóa bác sĩ khỏi danh sách yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bác sĩ đã được xóa khỏi danh sách yêu thích."
 *       404:
 *         description: Không tìm thấy bác sĩ trong danh sách yêu thích của bệnh nhân này
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete(
  "/patient/:ptID/doctor/:drID",
  controller.removeDoctorFromLoveList
);

module.exports = router;
