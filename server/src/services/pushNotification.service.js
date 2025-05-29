const axios = require("axios");
const { NotificationToken, Patient, User } = require("../models");
const { where } = require("sequelize");

exports.sendMedicineSchedule = async (token, body, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        {
          to: token,
          sound: "default",
          title: "Nhắc nhở uống thuốc",
          body: JSON.stringify(body),
        },
        {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data.status === "ok") {
        console.log(`✅ Gửi thành công cho token: ${token}`);
        return true; // thành công
      } else {
        throw new Error(response.data.data.message || "Unknown Expo error");
      }
    } catch (error) {
      console.error(
        `❌ Lỗi gửi lần ${attempt + 1} cho token: ${token}:`,
        error.message
      );

      if (attempt === retries - 1) {
        console.error(`⛔ Gửi thất bại sau ${retries} lần thử.`);
        return false; // thất bại
      }

      await wait(2000); // đợi 2s trước khi retry
    }
  }
};

exports.sendAppointment = async (token, body, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await axios.post(
        "https://exp.host/--/api/v2/push/send",
        {
          to: token,
          sound: "default",
          title: "Nhắc nhở lịch hẹn",
          body: JSON.stringify(body),
        },
        {
          headers: {
            Accept: "application/json",
            "Accept-Encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.data.status === "ok") {
        console.log(`✅ Gửi thành công cho token: ${token}`);
        return true; // thành công
      } else {
        throw new Error(response.data.data.message || "Unknown Expo error");
      }
    } catch (error) {
      console.error(
        `❌ Lỗi gửi lần ${attempt + 1} cho token: ${token}:`,
        error.message
      );

      if (attempt === retries - 1) {
        console.error(`⛔ Gửi thất bại sau ${retries} lần thử.`);
        return false; // thất bại
      }

      await wait(2000); // đợi 2s trước khi retry
    }
  }
};

//sender, receiver ở đây là ma_benh_nhan hoặc ma_bac_si
exports.sendMessNotification = async (sender, receiver, body, retries = 3) => {
  try {
    let tokens;
    let user;
    //Nếu receiver bắt đầu bằng 'BN'
    if (receiver.startsWith("BN")) {
      [user, tokens] = await Promise.all([
        User.findOne({
          where: {
            id: +sender.slice(2),
          },
          attributes: ["ho_va_ten"],
        }),
        NotificationToken.findAll({
          where: {
            id_nguoi_dung: +receiver.slice(2),
          },
          attributes: ["token"],
        }),
      ]);

      if (!tokens.length) return;

      const messages = tokens.map((t) => ({
        to: t.token,
        sound: "default",
        title: `Tin nhắn từ ${user.ho_va_ten}`,
        body,
      }));

      console.log("user", user);
      console.log("tokens", tokens);

      const sendPush = async () => {
        try {
          await axios.post("https://exp.host/--/api/v2/push/send", messages, {
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          if (retries > 0) {
            console.warn("Retry sending push notification...");
            await wait(1000);
            return sendPush(id, body, retries - 1);
          } else {
            console.error("Gửi thông báo thất bại:", error.message);
          }
        }
      };

      await sendPush();
    } else {
    }
  } catch (err) {
    console.error("Lỗi khi lấy token hoặc gửi thông báo:", err.message);
  }
};

// Hàm wait tạm thời
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
