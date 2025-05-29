const express = require("express");
const router = express.Router();
const relativeController = require("../controllers/relative.controller");
const authMiddleware = require("../middleware/auth.middleware");

/**
 * @swagger
 * /api/relative:
 *   post:
 *     summary: Tạo mối quan hệ giữa hai bệnh nhân
 *     description: API này dùng để tạo mối quan hệ giữa hai bệnh nhân trong hệ thống. Người gửi yêu cầu phải đặt vào ptID1, người nhận yêu cầu sẽ là ptID2.
 *     tags:
 *       - Relative
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ptID:
 *                 type: string
 *                 description: Mã bệnh nhân gửi yêu cầu
 *                 example: "BN0000006"
 *               phone:
 *                 type: string
 *                 description: số điện thoại của bệnh nhân nhận yêu cầu
 *                 example: "0123456789"
 *               relationship:
 *                 type: string
 *                 description: Mối quan hệ giữa hai bệnh nhân (ví dụ "bố", "mẹ", "vợ/chồng", "con", ...)
 *                 example: "bố con"
 *     responses:
 *       200:
 *         description: Mối quan hệ đã được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Mối quan hệ đã được tạo thành công"
 *       400:
 *         description: Lỗi khi tạo mối quan hệ, có thể do bệnh nhân trùng lặp hoặc mối quan hệ đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Không thể tạo mối quan hệ với chính mình"
 *       500:
 *         description: Lỗi hệ thống khi tạo mối quan hệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi tạo mối quan hệ"
 */
router.post("/", relativeController.createRelative);

/**
 * @swagger
 * /api/relative/patient/{ptID}:
 *   get:
 *     summary: Lấy danh sách các bệnh nhân có mối quan hệ với bệnh nhân cụ thể
 *     description: API này trả về danh sách các bệnh nhân có mối quan hệ với bệnh nhân có mã `ptID`. Các thông tin bao gồm tên, email, số điện thoại, ngày sinh, giới tính, và mối quan hệ với bệnh nhân này.
 *     tags:
 *       - Relative
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         description: Mã bệnh nhân cần tra cứu mối quan hệ.
 *         schema:
 *           type: string
 *           example: "BN0000006"
 *     responses:
 *       200:
 *         description: Danh sách các bệnh nhân có mối quan hệ với bệnh nhân này
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ten_dang_nhap:
 *                     type: string
 *                     description: Tên đăng nhập của bệnh nhân
 *                   email:
 *                     type: string
 *                     description: Email của bệnh nhân
 *                   sdt:
 *                     type: string
 *                     description: Số điện thoại của bệnh nhân
 *                   ngay_sinh:
 *                     type: string
 *                     format: date
 *                     description: Ngày sinh của bệnh nhân
 *                   gioi_tinh:
 *                     type: string
 *                     description: Giới tính của bệnh nhân
 *                   phan_loai:
 *                     type: string
 *                     description: Phân loại bệnh nhân (ví dụ "bn" cho bệnh nhân)
 *                   ho_va_ten:
 *                     type: string
 *                     description: Họ và tên đầy đủ của bệnh nhân
 *                   avt_url:
 *                     type: string
 *                     nullable: true
 *                     description: URL ảnh đại diện của bệnh nhân (nếu có)
 *                   than_phan:
 *                     type: string
 *                     description: Mối quan hệ giữa bệnh nhân và bệnh nhân này
 *                   ma_benh_nhan_2:
 *                     type: string
 *                     description: Mã bệnh nhân thứ hai trong mối quan hệ
 *         examples:
 *           application/json:
 *             value: [
 *               {
 *                 "id": 8,
 *                 "ten_dang_nhap": "nguoidung3",
 *                 "email": "nguoidung3@example.com",
 *                 "sdt": "0123456890",
 *                 "ngay_sinh": "1999-08-28",
 *                 "gioi_tinh": "Nam",
 *                 "phan_loai": "bn",
 *                 "ho_va_ten": "Nguyễn Thành Danh",
 *                 "avt_url": null,
 *                 "than_phan": "Anh em",
 *                 "ma_benh_nhan_2": "BN0000008"
 *               },
 *               {
 *                 "id": 7,
 *                 "ten_dang_nhap": "nguoidung2",
 *                 "email": "nguoidung2@example.com",
 *                 "sdt": "0123456889",
 *                 "ngay_sinh": "1996-02-25",
 *                 "gioi_tinh": "Nữ ",
 *                 "phan_loai": "bn",
 *                 "ho_va_ten": "Nguyễn Thị Nghĩa",
 *                 "avt_url": null,
 *                 "than_phan": "Chị em",
 *                 "ma_benh_nhan_2": "BN0000009"
 *               }
 *             ]
 *       404:
 *         description: Không tìm thấy mối quan hệ cho bệnh nhân với mã ptID đã cho
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Không tìm thấy mối quan hệ cho bệnh nhân này"
 *       500:
 *         description: Lỗi hệ thống khi lấy danh sách mối quan hệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi lấy danh sách mối quan hệ"
 */
router.get("/patient/:ptID", relativeController.getAllRelatives);

/**
 * @swagger
 * /api/relative/role:
 *   put:
 *     summary: Cập nhật mối quan hệ giữa các bệnh nhân
 *     description: API này cho phép cập nhật mối quan hệ giữa hai bệnh nhân, thay đổi thông tin mối quan hệ giữa họ. Cần cung cấp mã bệnh nhân và mối quan hệ mới.
 *     tags:
 *       - Relative
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ptID1:
 *                 type: string
 *                 description: Mã bệnh nhân 1
 *                 example: "BN0000006"
 *               ptID2:
 *                 type: string
 *                 description: Mã bệnh nhân 2
 *                 example: "BN0000007"
 *               newRelationship:
 *                 type: string
 *                 description: Mối quan hệ mới giữa bệnh nhân 1 và bệnh nhân 2
 *                 example: "Bố con"
 *     responses:
 *       200:
 *         description: Mối quan hệ đã được cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ma_benh_nhan_1:
 *                   type: string
 *                   description: Mã bệnh nhân 1
 *                 ma_benh_nhan_2:
 *                   type: string
 *                   description: Mã bệnh nhân 2
 *                 than_phan:
 *                   type: string
 *                   description: Mối quan hệ mới
 *                 da_xac_nhan:
 *                   type: boolean
 *                   description: Trạng thái xác nhận mối quan hệ
 *       400:
 *         description: Yêu cầu không hợp lệ (ví dụ, bệnh nhân cố gắng thay đổi mối quan hệ với chính mình)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Không thể thay đổi mối quan hệ với chính mình"
 *       404:
 *         description: Không tìm thấy mối quan hệ giữa hai bệnh nhân
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Không tìm thấy mối quan hệ này"
 *       500:
 *         description: Lỗi hệ thống khi cập nhật mối quan hệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Lỗi khi cập nhật mối quan hệ"
 */
router.put("/role", relativeController.changeRoleRelative);

/**
 * @swagger
 * /api/relative/confirm:
 *   put:
 *     summary: Xác nhận mối quan hệ giữa các bệnh nhân
 *     description: API này cho phép xác nhận mối quan hệ giữa hai bệnh nhân sau khi đã gửi yêu cầu kết bạn. Cần cung cấp mã bệnh nhân để xác nhận mối quan hệ.
 *     tags:
 *       - Relative
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ptID1:
 *                 type: string
 *                 description: Mã bệnh nhân 1
 *                 example: "BN0000006"
 *               ptID2:
 *                 type: string
 *                 description: Mã bệnh nhân 2
 *                 example: "BN0000007"
 *     responses:
 *       200:
 *         description: Mối quan hệ đã được xác nhận thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ma_benh_nhan_1:
 *                   type: string
 *                   description: Mã bệnh nhân 1
 *                 ma_benh_nhan_2:
 *                   type: string
 *                   description: Mã bệnh nhân 2
 *                 than_phan:
 *                   type: string
 *                   description: Mối quan hệ
 *                 da_xac_nhan:
 *                   type: boolean
 *                   description: Trạng thái xác nhận mối quan hệ
 *       400:
 *         description: Yêu cầu không hợp lệ (ví dụ, bệnh nhân cố gắng xác nhận mối quan hệ với chính mình)
 *       404:
 *         description: Không tìm thấy mối quan hệ giữa hai bệnh nhân
 *       500:
 *         description: Lỗi hệ thống khi xác nhận mối quan hệ
 */
router.put("/confirm", relativeController.confirmRelative);

/**
 * @swagger
 * /api/relative/pending/{ptID}:
 *   get:
 *     summary: Lấy danh sách các mối quan hệ chưa được xác nhận
 *     description: API này cho phép lấy danh sách các mối quan hệ chưa được xác nhận của bệnh nhân (ptID). Cung cấp mã bệnh nhân để lấy các mối quan hệ đang chờ xác nhận.
 *     tags:
 *       - Relative
 *     parameters:
 *       - in: path
 *         name: ptID
 *         required: true
 *         description: Mã bệnh nhân cần kiểm tra mối quan hệ
 *         schema:
 *           type: string
 *           example: "BN0000006"
 *     responses:
 *       200:
 *         description: Danh sách các mối quan hệ chưa được xác nhận
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   than_phan:
 *                     type: string
 *                     description: Mối quan hệ với bệnh nhân. Nếu chưa có mối quan hệ thì giá trị là null.
 *                     example: null
 *                   ma_benh_nhan_1:
 *                     type: string
 *                     description: Mã bệnh nhân gửi yêu cầu kết bạn
 *                     example: "BN0000006"
 *                   ho_va_ten:
 *                     type: string
 *                     description: Họ và tên của bệnh nhân gửi yêu cầu
 *                     example: "Nguyễn Thị Hiền"
 *                   sdt:
 *                     type: string
 *                     description: Số điện thoại của bệnh nhân gửi yêu cầu
 *                     example: "0123456888"
 *                   avt_url:
 *                     type: string
 *                     description: URL ảnh đại diện của bệnh nhân gửi yêu cầu. Nếu không có ảnh, giá trị sẽ là null.
 *                     example: null
 *       404:
 *         description: Không tìm thấy mối quan hệ chưa được xác nhận
 *       500:
 *         description: Lỗi hệ thống khi lấy danh sách mối quan hệ
 */
router.get("/pending/:ptID", relativeController.getPendingRelatives);

/**
 * @swagger
 * /api/relative/delete:
 *   delete:
 *     summary: Xóa mối quan hệ giữa các bệnh nhân
 *     description: API này cho phép xóa mối quan hệ giữa hai bệnh nhân. Cần cung cấp mã bệnh nhân 1 và mã bệnh nhân 2 để xóa mối quan hệ.
 *     tags:
 *       - Relative
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ptID1:
 *                 type: string
 *                 description: Mã bệnh nhân 1
 *                 example: "BN0000006"
 *               ptID2:
 *                 type: string
 *                 description: Mã bệnh nhân 2
 *                 example: "BN0000007"
 *     responses:
 *       200:
 *         description: Mối quan hệ đã được xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Xóa mối quan hệ thành công"
 *       404:
 *         description: Không tìm thấy mối quan hệ để xóa
 *       500:
 *         description: Lỗi hệ thống khi xóa mối quan hệ
 */
router.delete("/delete", relativeController.deleteRelative);

module.exports = router;
