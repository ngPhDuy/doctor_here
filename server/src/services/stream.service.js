const { StreamClient } = require("@stream-io/node-sdk");
const appontmentService = require("./appointment.service");

// Khởi tạo Stream client
const streamClient = new StreamClient(
  process.env.STREAM_API_KEY,
  process.env.STREAM_SECRET_KEY,
  { timeout: 5000 }
);

// console.log("Stream client at service ", streamClient);

exports.generateToken = async (userID) => {
  const newUser = {
    id: userID,
    role: "user",
    name: "John",
    image: "link/to/profile/image",
  };
  await streamClient.upsertUsers([newUser]);
  const validity = 24 * 60 * 60; // 1 ngày
  const token = streamClient.generateUserToken({
    user_id: userID,
    validity_in_seconds: validity,
  });

  return {
    api_key: process.env.STREAM_API_KEY,
    token: token,
  };
};

//callID: appointmentID
exports.createCall = async (callID, userID) => {
  const result = await appontmentService.getAppointmentByID(callID);

  if (!result) {
    throw new Error("Invalid appointment ID");
  }

  const drUser = {
    id: result.ma_bac_si,
    role: "user",
    name: result.Bac_si.Nguoi_dung.ho_va_ten,
    image: result.Bac_si.Nguoi_dung.avt_url,
  };

  const ptUser = {
    id: result.ma_benh_nhan_dat_hen,
    role: "user",
    name: result.Benh_nhan.Nguoi_dung.ho_va_ten,
    image: result.Benh_nhan.Nguoi_dung.avt_url,
  };

  await streamClient.upsertUsers([drUser, ptUser]);

  const call = streamClient.video.call("default", callID);

  const callData = await call.getOrCreate({
    members_limit: 2,
    data: {
      created_by_id: userID,
      // Call members need to be existing users
      members: [
        { user_id: result.ma_bac_si },
        { user_id: result.ma_benh_nhan_dat_hen },
      ],
      custom: {
        color: "white",
      },
      settings_override: {
        limits: {
          max_duration_seconds: 15 * 60, // 15 phút
        },
      },
    },
  });

  console.log("Call data: ", callData);
  return callData;
};
