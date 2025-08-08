const {
  sequelize,
  Conversation,
  Message,
  Doctor,
  Patient,
  User,
} = require("../models");
const { Op, fn, col } = require("sequelize");

exports.createConversation = async (ptID, drID) => {
  let conversation = await Conversation.findOne({
    where: {
      ma_benh_nhan: ptID,
      ma_bac_si: drID,
    },
  });

  if (conversation) {
    throw new Error("Cuộc trò chuyện đã tồn tại");
  }

  conversation = await Conversation.create({
    ma_benh_nhan: ptID,
    ma_bac_si: drID,
    thoi_diem_tao: new Date(),
  });

  return conversation;
};

exports.createAIConversation = async (userID) => {
  if (!userID) {
    throw new Error("Thiếu userID khi tạo cuộc trò chuyện với AI");
  }

  let ptID, drID;
  const userIDStr = String(userID);

  if (userIDStr.startsWith("BN")) {
    ptID = userIDStr;
    drID = null;
  } else {
    drID = userIDStr;
    ptID = null;
  }

  if (!ptID && !drID) {
    throw new Error("Không xác định được mã bệnh nhân hoặc bác sĩ");
  }

  const existingConversation = await Conversation.findOne({
    where: {
      [Op.or]: [
        { ma_benh_nhan: ptID, ma_bac_si: drID },
        { ma_benh_nhan: drID, ma_bac_si: ptID },
      ],
    },
  });

  if (existingConversation) {
    throw new Error("Cuộc trò chuyện với AI đã tồn tại");
  }

  const newConversation = await Conversation.create({
    ma_benh_nhan: ptID ?? null,
    ma_bac_si: drID ?? null,
    thoi_diem_tao: new Date(),
    is_ai_agent: true,
  });

  return newConversation;
};

exports.getMessages = async (conversationID) => {
  //Tìm tất cả tin nhắn trong cuộc trò chuyện, săp xếp theo thoi_diem_gui từ cũ đến mới
  const messages = await Message.findAll({
    where: { cuoc_hoi_thoai: conversationID },
    order: [["thoi_diem_gui", "ASC"]],
  });
  return messages;
};

/* props:
conversationID
senderSide
messageType
messageContent
mediaURL
sendTime
*/
exports.createMessage = async (props) => {
  const message = await Message.create({
    kieu_noi_dung: props.messageType,
    noi_dung_van_ban: props.messageContent,
    media_url: props.mediaURL,
    thoi_diem_gui: props.sendTime,
    cuoc_hoi_thoai: props.conversationID,
    ben_gui_di: props.senderSide,
  });

  const conversation = await Conversation.findByPk(props.conversationID);
  conversation.thoi_diem_tin_nhan_cuoi = new Date();
  await conversation.save();

  return message;
};

exports.getConversations = async (userID) => {
  const conversations = await Conversation.findAll({
    where: {
      [Op.or]: [{ ma_benh_nhan: userID }, { ma_bac_si: userID }],
      // ✅ Không filter is_ai_agent nữa
    },
    attributes: [
      [sequelize.fn("DISTINCT", sequelize.col("Conversation.id")), "id"],
      "thoi_diem_tin_nhan_cuoi",
      "is_ai_agent", // ✅ Thêm thuộc tính này để trả về client

      [
        sequelize.literal(
          `(SELECT COUNT(*) FROM "Tin_nhan" AS tn WHERE tn.cuoc_hoi_thoai = "Conversation"."id" AND tn.ben_gui_di = '${
            userID.startsWith("BN") ? "bs" : "bn"
          }' AND tn.thoi_diem_da_xem IS NULL)`
        ),
        "so_tin_moi",
      ],
      [
        sequelize.literal(
          `(SELECT "noi_dung_van_ban" FROM "Tin_nhan" AS tn WHERE tn.cuoc_hoi_thoai = "Conversation"."id" ORDER BY tn.thoi_diem_gui DESC LIMIT 1)`
        ),
        "noi_dung_tin_nhan",
      ],
      [
        sequelize.literal(
          `(SELECT "media_url" FROM "Tin_nhan" AS tn WHERE tn.cuoc_hoi_thoai = "Conversation"."id" ORDER BY tn.thoi_diem_gui DESC LIMIT 1)`
        ),
        "media_url",
      ],
    ],
    order: [
      [sequelize.col("Conversation.thoi_diem_tin_nhan_cuoi"), "DESC"],
      [sequelize.col("Conversation.id"), "DESC"],
    ],
    include: [
      {
        model: Doctor,
        as: "Bac_si",
        attributes: ["ma_bac_si"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "avt_url"],
          },
        ],
      },
      {
        model: Patient,
        as: "Benh_nhan",
        attributes: ["ma_benh_nhan"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "avt_url"],
          },
        ],
      },
    ],
    raw: true,
  });

  if (!conversations || conversations.length === 0) {
    return [];
  }

  const flatConversations = conversations
    .map((conv) => {
      let user = {};
      let userRole;

      const isAiAgent = conv["is_ai_agent"];

      if (isAiAgent) {
        // ✅ Trường hợp AI Agent
        user = {
          ma: "ai_agent",
          ho_va_ten: "AI Agent",
          avt_url: "/images/ai-avatar.png", // hoặc lấy từ DB nếu có thật
        };
      } else if (userID === conv["Benh_nhan.ma_benh_nhan"]) {
        user = {
          ma: conv["Bac_si.ma_bac_si"],
          ho_va_ten: conv["Bac_si.Nguoi_dung.ho_va_ten"],
          avt_url: conv["Bac_si.Nguoi_dung.avt_url"],
        };
        userRole = "bs";
      } else {
        user = {
          ma: conv["Benh_nhan.ma_benh_nhan"],
          ho_va_ten: conv["Benh_nhan.Nguoi_dung.ho_va_ten"],
          avt_url: conv["Benh_nhan.Nguoi_dung.avt_url"],
        };
        userRole = "bn";
      }

      return {
        cuoc_hoi_thoai: conv.id,
        is_ai_agent: !!isAiAgent, // ✅ Trả về thông tin AI
        nguoi_dung: {
          ma: user.ma,
          avt_url: user.avt_url,
          ho_va_ten: user.ho_va_ten,
        },
        so_tin_moi: +conv["so_tin_moi"],
        thoi_diem_tin_nhan_cuoi: conv.thoi_diem_tin_nhan_cuoi,
        tin_nhan: {
          noi_dung_van_ban: conv["noi_dung_tin_nhan"],
          media_url: conv["media_url"],
        },
      };
    })
    .filter((conv) => conv !== null);

  return flatConversations;
};

exports.updateSeenTime = async (messageID) => {
  const message = await Message.findByPk(messageID);
  if (!message) {
    throw new Error("Không tìm thấy tin nhắn");
  }

  message.thoi_diem_da_xem = new Date();
  await message.save();
};

exports.updateSeenAll = async (conversationID, userID) => {
  const messages = await Message.findAll({
    where: {
      cuoc_hoi_thoai: conversationID,
      ben_gui_di: userID.startsWith("BN") ? "bs" : "bn",
      thoi_diem_da_xem: null,
    },
  });

  let seenTime = new Date();

  //promise.all
  await Promise.all(
    messages.map(async (message) => {
      message.thoi_diem_da_xem = seenTime;
      await message.save();
    })
  );

  return true;
};

exports.getConversation = async (drID, ptID, userID) => {
  let conversation = await Conversation.findOne({
    where: {
      ma_bac_si: drID,
      ma_benh_nhan: ptID,
    },
    include: [],
  });

  if (!conversation) {
    return null;
  }

  return conversation;
};

exports.recallMessage = async (
  convID,
  type,
  content,
  mediaURL,
  senderID,
  time
) => {
  try {
    let result;

    console.log("Recall: ", convID, type, content, mediaURL, senderID, time);

    if (type === "text") {
      result = await Message.update(
        { kieu_noi_dung: "recall" },
        {
          where: {
            cuoc_hoi_thoai: convID,
            kieu_noi_dung: "text",
            noi_dung_van_ban: content,
            ben_gui_di: senderID.startsWith("BN") ? "bn" : "bs",
            thoi_diem_gui: time,
          },
        }
      );
    } else {
      result = await Message.update(
        { kieu_noi_dung: "recall" },
        {
          where: {
            cuoc_hoi_thoai: convID,
            kieu_noi_dung: type,
            media_url: mediaURL,
            ben_gui_di: senderID.startsWith("BN") ? "bn" : "bs",
            thoi_diem_gui: time,
          },
        }
      );
    }

    return result;
  } catch (error) {
    console.log(error);
  }
};
