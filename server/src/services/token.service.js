const { NotificationToken, sequelize } = require("../models");

exports.getTokenByUserAndDevice = async (userID, deviceID) => {
  userID = parseInt(userID.slice(2), 10);

  const token = await NotificationToken.findOne({
    where: {
      id_nguoi_dung: userID,
      thiet_bi: deviceID,
    },
  });
  return token;
};

exports.createTokenByUserAndDevice = async (userID, token) => {
  userID = parseInt(userID.slice(2), 10);
  const newToken = await sequelize.query(
    "SELECT * FROM luu_token(:userID, :token)",
    {
      replacements: {
        userID: userID,
        token: token,
      },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return newToken[0];
};
