const { askLLM } = require("../services/llm.service");
const { handleLLMResponse } = require("../services/llm-response.service");

exports.chatWithAI = async (req, res) => {
  const { message, role, ma_user } = req.body;

  const rawReply = await askLLM(message ,role);

  console.log("📦 rawReply typeof:", typeof rawReply);
  console.log("📦 rawReply value:", rawReply);

  try {
    const parsed = rawReply.response ?? rawReply; // phòng trường hợp lồng trong .response
    const response = await handleLLMResponse(parsed, ma_user, role);
    return res.json({ reply: response });
  } catch (err) {
    console.warn("❌ Xử lý LLM thất bại:", err.message);
    return res.json({ reply: rawReply });
  }
};