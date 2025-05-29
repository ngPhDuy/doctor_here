const redis = require("redis");
const { createClient } = require("@redis/client");
const client = createClient({ url: "redis://127.0.0.1:6379" });

client
  .connect()
  .then(() => {
    console.log("Redis client connected");
  })
  .catch((err) => {
    console.error("Redis client connection failed:", err);
  });

const checkConnectionAndRetry = async () => {
  if (!client.isOpen) {
    try {
      await client.connect();
    } catch (err) {
      console.error("Error reconnecting to Redis:", err);
      throw err;
    }
  }
};

const checkConversationInCache = async (drID, ptID) => {
  await checkConnectionAndRetry();

  return new Promise((resolve, reject) => {
    client.get(`conversation:${drID}:${ptID}`, (err, result) => {
      if (err) reject(err);
      resolve(result ? JSON.parse(result) : null);
    });
  });
};

const saveConversationToCache = async (drID, ptID, conversation) => {
  await checkConnectionAndRetry();

  client.setex(
    `conversation:${drID}:${ptID}`,
    3600,
    JSON.stringify(conversation)
  );
};

module.exports = {
  checkConversationInCache,
  saveConversationToCache,
};
