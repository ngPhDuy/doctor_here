const express = require("express");
const router = express.Router();
const controller = require("../controllers/mess.controller");
const multer = require("multer");
const upload = multer();

/**
 * @swagger
 * /api/conversation:
 *   post:
 *     summary: Tạo cuộc trò chuyện mới giữa bệnh nhân và bác sĩ
 *     tags:
 *       - Conversation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ptID
 *               - drID
 *             properties:
 *               ptID:
 *                 type: string
 *                 description: Mã bệnh nhân
 *                 example: BN0000006
 *               drID:
 *                 type: string
 *                 description: Mã bác sĩ
 *                 example: BS0000003
 *     responses:
 *       200:
 *         description: Tạo cuộc trò chuyện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 ma_benh_nhan:
 *                   type: string
 *                   example: BN0000006
 *                 ma_bac_si:
 *                   type: string
 *                   example: BS0000003
 *                 thoi_diem_tao:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-05-06T14:12:45.000Z
 *                 thoi_diem_tin_nhan_cuoi:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Cuộc trò chuyện đã tồn tại hoặc dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cuộc trò chuyện đã tồn tại
 */
router.post("/conversation", controller.createConversation);

router.post("/conversation/ai", controller.createConversationWithAI);

router.get("/conversation/user/:userID", controller.getConversations);

router.get("/message/conversation/:conversationID", controller.getMessages);

router.post("/message/text", controller.sendTextMessage);

router.post("/message/text/ai", controller.sendTextMessageAI);

// router.post(
//   "/message/media",
//   upload.single("file"),
//   controller.sendMediaMessage
// );

router.patch("/message/seen/:messageID", controller.seenMessage);

router.patch(
  "/message/seen/conversation/:conversationID/user/:userID",
  controller.updateSeenAll
);

/**
 * @swagger
 * /api/coversation/doctor/{drID}/patient/{ptID}:
 *   get:
 *     summary: Lấy cuộc trò chuyện giữa bác sĩ và bệnh nhân
 *     tags:
 *       - Conversation
 *     parameters:
 *       - in: path
 *         name: drID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bác sĩ
 *         example: BS0000003
 *       - in: path
 *         name: ptID
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã bệnh nhân
 *         example: BN0000006
 *     responses:
 *       200:
 *         description: Trả về thông tin cuộc trò chuyện nếu tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 ma_benh_nhan:
 *                   type: string
 *                   example: BN0000006
 *                 ma_bac_si:
 *                   type: string
 *                   example: BS0000003
 *                 thoi_diem_tao:
 *                   type: string
 *                   format: date-time
 *                   example: 2025-05-06T14:12:45.000Z
 *                 thoi_diem_tin_nhan_cuoi:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: null
 *       200 (null):
 *         description: Không tìm thấy cuộc trò chuyện
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
 *                   example: Không thể truy xuất cuộc trò chuyện
 */
router.get(
  "/coversation/doctor/:drID/patient/:ptID",
  controller.getConversation
);

/**
 * @swagger
 * /api/loveList:
 *   post:
 *     summary: Thêm bác sĩ vào danh sách yêu thích của bệnh nhân
 *     description: API này cho phép bệnh nhân thêm một bác sĩ vào danh sách yêu thích của mình.
 *     tags:
 *       - Video Call
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
router.post("/video_call/token", controller.generateToken);

router.post("/video_call/call", controller.createCall);

module.exports = router;
