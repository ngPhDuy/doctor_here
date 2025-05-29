const express = require("express");
const multer = require("multer");
const upload = multer(); // Multer middleware để nhận nhiều file từ client
const router = express.Router();
const controller = require("../controllers/cloud.controller");

/**
 * @swagger
 * /api/cloud/upload:
 *   post:
 *     summary: Upload file lên Cloudinary
 *     description: API cho phép tải lên nhiều file (hình ảnh, video, tệp) lên Cloudinary và trả về các URL cùng loại file
 *     tags:
 *       - Cloud
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: files
 *         type: array
 *         items:
 *           type: file
 *         required: true
 *         description: Danh sách các file cần tải lên (hỗ trợ nhiều file)
 *       - in:
 *         name: folderName
 *         type: string
 *         required: true
 *         description: Tên thư mục trên Cloudinary để lưu trữ file
 *         example: "user_uploads"
 *     responses:
 *       200:
 *         description: Tải file lên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   url:
 *                     type: string
 *                     description: Đường dẫn truy cập file đã tải lên
 *                     example: "https://res.cloudinary.com/demo/image/upload/v1631234567/user_uploads/filename.jpg"
 *                   type:
 *                     type: string
 *                     description: Loại file (image, video, application, etc.)
 *                     example: "image"
 *       500:
 *         description: Lỗi khi tải file lên
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: Thông báo lỗi
 *               example: "Không thể tải file lên Cloudinary"
 */
router.post("/upload", upload.array("files"), controller.uploadFile);

module.exports = router;
