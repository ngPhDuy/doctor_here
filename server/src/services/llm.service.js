const axios = require("axios");

// Local server
const LLM_API_URL = "http://ai-agent/:8001/chat"; 

async function askLLM(message, role) {
  try {
    const res = await axios.post(LLM_API_URL, { message, role });
    console.log(res,"abc");
    return res.data.response;
  } catch (err) {
    console.error("❌ Failed to call LLM:", err.message);
    return "Xin lỗi, tôi không thể xử lý câu hỏi lúc này.";
  }
}

module.exports = { askLLM };