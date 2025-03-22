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
  try {
    // Tìm tất cả cuộc trò chuyện mà user tham gia: ma_benh_nhan hoặc ma_bac_si = userID
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: [{ ma_benh_nhan: userID }, { ma_bac_si: userID }],
      },
      attributes: ["id"],
      order: [["thoi_diem_tin_nhan_cuoi", "DESC"]],
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
        {
          // đếm số tin nhắn chưa đọc trong cuộc hội thoại do đối phương gửi
          //Nếu userID = BN________ thì đếm số tin nhắn chưa đọc của ben_gui_di = "bs"
          //Nếu userID = BS________ thì đếm số tin nhắn chưa đọc của ben_gui_di = "bn"
          model: Message,
          as: "Tin_nhan",
          attributes: [
            [
              sequelize.fn("COUNT", sequelize.col("Tin_nhan.cuoc_hoi_thoai")),
              "so_tin_moi",
            ],
          ],
          where: {
            ben_gui_di: userID.startsWith("BN") ? "bs" : "bn",
            thoi_diem_da_xem: null,
          },
          required: false,
        },
      ],
      group: [
        "Conversation.id",
        "Tin_nhan.cuoc_hoi_thoai",
        "Bac_si.id",
        "Benh_nhan.id",
        "Bac_si->Nguoi_dung.id",
        "Benh_nhan->Nguoi_dung.id",
        "Tin_nhan.id",
      ],
      raw: true,
    });

    console.log(conversations);

    // Kiểm tra nếu không có cuộc trò chuyện nào
    if (!conversations || conversations.length === 0) {
      return [];
    }

    const flatConversations = conversations
      .map((conv) => {
        // Xác định người tham gia (bệnh nhân hoặc bác sĩ)
        let user = {};
        let userRole;

        if (userID === conv["Benh_nhan.ma_benh_nhan"]) {
          user.ma = conv["Bac_si.ma_bac_si"];
          user.avt_url = conv["Bac_si.Nguoi_dung.avt_url"];
          user.ho_va_ten = conv["Bac_si.Nguoi_dung.ho_va_ten"];
          userRole = "bs";
        } else {
          user.ma = conv["Benh_nhan.ma_benh_nhan"];
          user.avt_url = conv["Benh_nhan.Nguoi_dung.avt_url"];
          user.ho_va_ten = conv["Benh_nhan.Nguoi_dung.ho_va_ten"];
          userRole = "bn";
        }

        if (!user) {
          return null;
        }

        // Kiểm tra xem có tin nhắn chưa đọc không

        return {
          cuoc_hoi_thoai: conv.id,
          nguoi_dung: {
            ma: user.ma,
            avt_url: user.avt_url,
            ho_va_ten: user.ho_va_ten,
          },
          so_tin_moi: +conv["Tin_nhan.so_tin_moi"],
        };
      })
      .filter((conv) => conv !== null); // Loại bỏ các giá trị null (nếu có)

    return flatConversations;
  } catch (error) {
    console.error(error);
    throw new Error("Có lỗi xảy ra khi lấy thông tin cuộc trò chuyện");
  }
};

exports.updateSeenTime = async (messageID) => {
  const message = await Message.findByPk(messageID);
  if (!message) {
    throw new Error("Không tìm thấy tin nhắn");
  }

  message.thoi_diem_da_xem = new Date();
  await message.save();
};
