const express = require("express");
const router = express.Router();
const controller = require("../controllers/mess.controller");
const multer = require("multer");
const upload = multer();

router.post("/conversation", controller.createConversation);

router.get("/conversation/user/:userID", controller.getConversations);

router.get("/messages/conversation/:conversationID", controller.getMessages);

router.post("/message/text", controller.sendTextMessage);

router.post(
  "/message/media",
  upload.single("file"),
  controller.sendMediaMessage
);

router.patch("/message/seen/:messageID", controller.seenMessage);

module.exports = router;
