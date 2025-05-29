const cron = require("node-cron");
const { chunkArray } = require("../utils/chunkArray");
const { sendAppointment } = require("../services/pushNotification.service");
const {
  getAppointment,
} = require("../services/getInfoForPushNotification.service");
const appointmentService = require("../services/appointment.service");

const batchSize = 100; // Kích thước mỗi batch

exports.appointmentReminder = function () {
  // Chạy cronjob mỗi 10 phút
  cron.schedule("*/1 * * * *", async () => {
    console.log("Cronjob nhắc lịch hẹn...");

    try {
      const upcomingAppointments = await getAppointment();

      if (!upcomingAppointments || upcomingAppointments.length === 0) {
        console.log("Không có lịch hẹn nào sắp tới.");
        return;
      }

      const batches = chunkArray(upcomingAppointments, batchSize);

      for (const batch of batches) {
        const promises = batch.map(async (appointment) => {
          let { cuoc_hen_id, ten_bac_si, thoi_diem_bat_dau, push_token } =
            appointment;
          console.log(thoi_diem_bat_dau);
          // Thời điểm bắt đầu chuyển qua giờ Việt Nam trích HH:mm
          //thoi_diem_bat_dau: 2025-04-27T17:50:00.000Z
          const gio = new Date(thoi_diem_bat_dau).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh",
            hour: "2-digit",
            minute: "2-digit",
          });

          console.log(
            `Gửi thông báo cho cuoc_hen_id: ${cuoc_hen_id}, ten_bac_si: ${ten_bac_si}, giờ: ${gio}`
          );

          const body = `Bạn có lịch hẹn vào lúc ${gio} với ${ten_bac_si}`;

          try {
            const res = await sendAppointment(push_token, body);
            if (res) {
              return { cuoc_hen_id, success: true };
            } else {
              return { cuoc_hen_id, success: false };
            }
          } catch (error) {
            console.error(`Gửi thất bại cho id ${cuoc_hen_id}:`, error);
            return { cuoc_hen_id, success: false };
          }
        });

        const results = await Promise.all(promises);

        const successIds = results
          .filter((r) => r.success)
          .map((r) => r.cuoc_hen_id);

        if (successIds.length > 0) {
          await appointmentService.updatePushState(successIds, false); // Cập nhật nhac_nho = false
          console.log(`Đã cập nhật nhac_nho=false cho các lịch:`, successIds);
        }
      }
    } catch (error) {
      console.error("Lỗi trong cronjob nhắc lịch hẹn:", error);
    }
  });
};
