const cron = require("node-cron");
const { chunkArray } = require("../utils/chunkArray");
const doctorService = require("../services/doctor.service");

// Tạo ra Timeslot cho các bác sĩ, lần lượt tạo cho 1 số nhất định bác sĩ cho đến khi hết
// Chạy vào 00:00 - 01:00 ngày 1 hàng tháng
exports.generateTimeSlots = function () {
  cron.schedule("0 0-1 1 * *", async () => {
    try {
      const doctors = await doctorService.getAllDoctor(); // nhớ await
      const doctorIds = doctors.map((doctor) => doctor.ma_bac_si);

      const chunkSize = 10;
      const chunks = chunkArray(doctorIds, chunkSize);

      for (const chunk of chunks) {
        await doctorService.generateTimeSlotsForDoctors(chunk);
        console.log(`Đã xử lý batch: ${chunk.join(", ")}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log("Đã tạo time slot cho tất cả bác sĩ trong tháng này.");
    } catch (error) {
      console.error("Lỗi khi tạo time slot cho bác sĩ:", error);
    }
  });
};
