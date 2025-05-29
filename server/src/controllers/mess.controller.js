const service = require("../services/mess.service");
const { uploadFile } = require("../services/cloud.service");
const streamService = require("../services/stream.service");

exports.createConversation = async (req, res) => {
  try {
    //Authenticate
    const { ptID, drID } = req.body;
    const conversation = await service.createConversation(ptID, drID);
    res.status(200).json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const { userID } = req.params;
    const conversations = await service.getConversations(userID);
    res.status(200).json(conversations);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { conversationID } = req.params;
    const messages = await service.getMessages(conversationID);
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendTextMessage = async (req, res) => {
  try {
    const { conversationID, senderSide, messageContent } = req.body;
    const message = await service.createMessage({
      conversationID,
      senderSide,
      messageType: "text",
      messageContent,
      mediaURL: null,
      sendTime: new Date(),
    });
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendMediaMessage = async (req, res) => {
  try {
    const { conversationID, senderSide, messageContent } = req.body;
    const file = req.file;

    //Get type of media
    const type = file.mimetype.split("/")[0];

    //Upload file to cloud
    const mediaURL = await uploadFile(file, "mess_media", type);

    const message = await service.createMessage({
      conversationID,
      senderSide,
      messageType: type,
      messageContent,
      mediaURL,
      sendTime: new Date(),
    });

    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.seenMessage = async (req, res) => {
  try {
    const { messageID } = req.params;
    const message = await service.updateSeenTime(messageID);
    res.status(200).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSeenAll = async (req, res) => {
  try {
    const { conversationID, userID } = req.params;
    const messages = await service.updateSeenAll(conversationID, userID);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { drID, ptID } = req.params;
    const conversation = await service.getConversation(drID, ptID);
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.generateToken = async (req, res) => {
  try {
    const { userID } = req.body;
    console.log("Generate token for user:", userID);
    const token = await streamService.generateToken(userID);
    console.log(token);
    res.status(200).json(token);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createCall = async (req, res) => {
  try {
    const { callID, userID } = req.body;

    if (!callID || !userID) {
      return res.status(400).json({ message: "Thiếu thông tin" });
    }

    const call = await streamService.createCall(callID, userID);
    res.status(200).json(call);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
