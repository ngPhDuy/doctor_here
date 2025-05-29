const cron = require("node-cron");
const { chunkArray } = require("../utils/chunkArray");
const {
  sendMedicineSchedule,
} = require("../services/pushNotification.service");
const {
  getMedicineSchedule,
} = require("../services/getInfoForPushNotification.service");
const diagnosisService = require("../services/diagnosis.service");

const batchSize = 100; // Kích thước mỗi batch

exports.medicineScheduleReminder = function () {
  // / Chạy cronjob mỗi 5 phút
  cron.schedule("*/1 * * * *", async () => {
    console.log("Cronjob nhắc uống thuốc...");

    try {
      const upcomingSchedules = await getMedicineSchedule();

      if (!upcomingSchedules || upcomingSchedules.length === 0) {
        console.log("Không có lịch uống thuốc nào sắp tới.");
        return;
      }

      const batches = chunkArray(upcomingSchedules, batchSize);

      for (const batch of batches) {
        const promises = batch.map(async (schedule) => {
          const { id_lan_uong, push_token, gio } = schedule;
          console.log(
            `Gửi thông báo cho id_lan_uong: ${id_lan_uong}, push_token: ${push_token}, giờ: ${gio}`
          );
          const body = `Bạn có lịch uống thuốc vào lúc ${gio}`;

          try {
            const res = await sendMedicineSchedule(push_token, body);
            if (res) {
              return { id_lan_uong, success: true };
            } else {
              return { id_lan_uong, success: false };
            }
          } catch (error) {
            console.error(`Gửi thất bại cho id ${id_lan_uong}:`, error);
            return { id_lan_uong, success: false };
          }
        });

        const results = await Promise.all(promises);

        const successIds = results
          .filter((r) => r.success)
          .map((r) => r.id_lan_uong);
        console.log(successIds);

        if (successIds.length > 0) {
          await diagnosisService.updatePushState(successIds, false); // Cập nhật nhac_nho = false
          console.log(`Đã cập nhật nhac_nho=false cho các lịch:`, successIds);
        }
      }
    } catch (error) {
      console.error("Lỗi trong cronjob nhắc uống thuốc:", error);
    }
  });
};
