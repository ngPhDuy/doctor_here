const service = require("../services/token.service");

exports.getTokenByUserAndDevice = async (req, res) => {
  const { userID } = req.params;
  try {
    const token = await service.getTokenByUserAndDevice(userID);
    if (!token) {
      return res.status(404).json({ message: "Token not found" });
    }
    return res.status(200).json(token);
  } catch (error) {
    console.error("Error fetching token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.createTokenByUserAndDevice = async (req, res) => {
  const { userID } = req.params;
  const { token } = req.body;
  try {
    const newToken = await service.createTokenByUserAndDevice(userID, token);
    return res.status(201).json(newToken);
  } catch (error) {
    console.error("Error creating token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
