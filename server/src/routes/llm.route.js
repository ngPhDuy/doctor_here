const express = require("express");
const router = express.Router();
const chatCtrl = require("../controllers/llm.controller");

router.post("/chat", chatCtrl.chatWithAI);

module.exports = router;