const messService = require("../../services/mess.service");
const pushNotificationService = require("../../services/pushNotification.service");
// const redisService = require("../../services/redis.service");

module.exports = (io, socket, activeUsers) => {
  socket.on("join_conversation", (conservationID) => {
    socket.join(conservationID);
  });

  socket.on("leave_conversation", (conservationID) => {
    socket.leave(conservationID);
  });

  socket.on("chat_message", async (messageObject) => {
    const { sender, receiver, content, time, type, url } = messageObject;

    let ptID;
    let drID;

    if (sender.startsWith("BN")) {
      ptID = sender;
      drID = receiver;
    } else if (sender.startsWith("BS")) {
      ptID = receiver;
      drID = sender;
    } else {
      console.log("Không xác định được người gửi");
      return;
    }

    console.log(`Tin nhắn từ ${sender} đến ${receiver}`);

    let conversation = await messService.getConversation(drID, ptID);

    console.log(`ID cuộc trò chuyện: ${conversation.id}`);
    // Lưu tin nhắn vào CSDL

    const newMess = await messService.createMessage({
      conversationID: conversation.id,
      senderSide: sender.startsWith("BN") ? "bn" : "bs",
      messageType: type,
      messageContent: content,
      mediaURL: url,
      sendTime: time,
    });

    console.log("Active User:", activeUsers);

    if (activeUsers[receiver]) {
      let jsonMessage = JSON.stringify(newMess);

      console.log(`Gửi tin nhắn đến ${receiver}`);
      io.to(activeUsers[receiver].id).emit("chat_message", jsonMessage);
    } else {
      const body = type === "text" ? content : "Tệp đính kèm";

      pushNotificationService.sendMessNotification(sender, receiver, body);
    }
  });

  socket.on("recall_message", async (messageObject) => {
    const { sender, receiver, content, time, type, url } = messageObject;

    let ptID;
    let drID;

    if (sender.startsWith("BN")) {
      ptID = sender;
      drID = receiver;
    } else if (sender.startsWith("BS")) {
      ptID = receiver;
      drID = sender;
    } else {
      console.log("Không xác định được người gửi");
      return;
    }

    console.log(`Tin nhắn từ ${sender} đến ${receiver}`);

    let conversation = await messService.getConversation(drID, ptID);

    console.log(`ID cuộc trò chuyện: ${conversation.id}`);

    const result = await messService.recallMessage(
      conversation.id,
      type,
      content,
      url,
      sender,
      time
    );

    console.log("Result Recall: ", result);

    if (result && activeUsers[receiver]) {
      let jsonBody = JSON.stringify({
        cuoc_hoi_thoai: conversation.id,
        ben_gui_di: sender.startsWith("BN") ? "bn" : "bs",
        kieu_noi_dung: type,
        noi_dung_van_ban: content,
        media_url: url,
        thoi_diem_gui: time,
      });

      io.to(activeUsers[receiver].id).emit("recall_message", jsonBody);
    }
  });
};
