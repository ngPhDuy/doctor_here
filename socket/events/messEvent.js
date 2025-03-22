module.exports = (io, socket, activeUsers) => {
  socket.on("join_conversation", (conservationID) => {
    socket.join(conservationID);
  });

  socket.on("leave_conversation", (conservationID) => {
    socket.leave(conservationID);
  });

  socket.on("chat_message", (messageObject) => {
    const { sender, receiver, content } = messageObject;
    console.log(` Có tin nhắn từ ${sender} đến ${receiver}: ${content}`);
    if (activeUsers[receiver]) {
      let jsonMessage = JSON.stringify(messageObject);
      console.log(`Gửi tin nhắn đến ${receiver}`);
      io.to(activeUsers[receiver].id).emit("chat_message", jsonMessage);
    } else {
      console.log(`${receiver} không online`);
    }
  });
};
