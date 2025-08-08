const { getDoctorInfoByName, getAllDoctor, getAllSpecialization } = require("./doctor.service");
const { createOne, deleteOneAI, updateOneAI  } = require("./doctorSchedule.service");
const { mapWeekday } = require("../utils/helper");
// const { getAllByStatusAndDrID, getAllByDoctorID } = require("./appointment.service");
// const { getAllByDoctorID } = require("./patient.service");
// const { getAllRatingsByDoctorID } = require("./rating.service");
const appointmentService = require("./appointment.service");
const patientService = require("./patient.service");
const ratingService = require("./rating.service");
const doctorService = require("./doctor.service");
const doctorScheduleService = require("./doctorSchedule.service");
const diagnosisService = require("./diagnosis.service");
const { DateTime } = require("luxon");
// Khai báo map các function
const FUNCTION_MAP = {
    // EX:  Tôi muốn tìm hiểu về bác sĩ Nguyễn Văn Tâm.
    get_doctor_info: async (args) => await getDoctorInfoByName(args.doctor_name),
    // EX:  Tôi muốn tìm hiểu về bác sĩ Nguyễn Văn Tâm.
    get_doctor_list: async (args) => await getAllDoctor(),
    gec_doctor_specialization: async (args) => await getAllSpecialization(),

    //Doctor:
    // Thêm lịch làm việc vào thứ hai từ 21h đến 23h, hình thức trực tiếp.
    add_work_schedule: async (args, ma_user) => {
        const { weekday, start_time, end_time, work_type } = args;
        const scheduleData = {
            thu: mapWeekday(weekday),
            gio_bat_dau: start_time,
            gio_ket_thuc: end_time,
            lam_viec_onl: work_type === "Trực tiếp" ? false : true,
            ma_bac_si: ma_user
        };
        const newSchedule = await createOne(scheduleData);
        return { message: "add_work_schedule", newSchedule };
    },
    // Cập nhật lịch làm việc vào thứ hai từ 20h đến 23h, hình thức trực tiếp.
    update_work_schedule: async (args, ma_user) => {
        const { week_day, start_time, end_time, work_type } = args;
        const scheduleData = {
            thu: mapWeekday(week_day),
            gio_bat_dau: start_time,
            gio_ket_thuc: end_time,
            lam_viec_onl: work_type === "Trực tiếp" || "trực tiếp" ? false : true,
            ma_bac_si: ma_user
        };
        const updateSchedule = await updateOneAI(scheduleData);
        return { message: "update_work_schedule", updateSchedule };
    },
    //Xóa lịch làm việc vào thứ hai từ 21h đến 23h.
    delete_work_schedule: async (args, ma_user) => {
        const { weekday, start_time, end_time } = args;
        const scheduleData = {
            thu: mapWeekday(weekday),
            gio_bat_dau: start_time,
            gio_ket_thuc: end_time,
            ma_bac_si: ma_user
        };
        console.log("Deleting schedule with data:", scheduleData);
        const deletedSchedule = await deleteOneAI(scheduleData);
        return { message: "delete_work_schedule", deletedSchedule };
    },
    get_work_schedule: async (args, ma_user) => {
    try {
        const hasSchedule = await doctorService.haveWorking(ma_user);

        if (!hasSchedule) {
        return {
            message: "Hiện tại không có lịch làm việc tuần này của bác sĩ.",
            data: [],
        };
        }

        const data = await doctorScheduleService.getAll(ma_user);

        return {
        message: "get_work_schedule",
        data,
        };
    } catch (error) {
        console.error("Lỗi khi lấy lịch làm việc:", error);
        throw new Error("Đã xảy ra lỗi khi lấy lịch làm việc.");
    }
    },

    // Cho tôi xem danh sách các buổi khám đã được xử lý.
    get_diagnosis_done : async (args, ma_user) => {
        try {
            const status = "Hoàn thành";
            const drID = ma_user;

            const appointments = await appointmentService.getAllByStatusAndDrID(status, drID);

            return { message: "get_diagnosis_done", appointments };

        } catch (error) {
            throw new Error(`Error in get_diagnosis_done: ${error.message}`);
        }
    },
    // Cho tôi xem danh sách các buổi khám chờ xử lý.
    get_diagnosis_undone : async (args, ma_user) => {
        try {
            const status = "Đang chờ";
            const drID = ma_user;

            const appointments = await appointmentService.getAllByStatusAndDrID(status, drID);

            return { message: "get_diagnosis_undone", appointments };

        } catch (error) {
            throw new Error(`Error in get_diagnosis_done: ${error.message}`);
        }
    },
    // Cho tôi xem danh sách tất cả bệnh nhân đã từng đặt lịch khám với tôi
    get_all_patient_by_doctor: async (args, ma_user) => {
        try {
            const patients = await patientService.getAllByDoctorID(ma_user);
            return { message: "get_all_patient_by_doctor", patients };
        } catch (error) {
            throw new Error(`Error in get_all_patient_by_doctor: ${error.message}`);
        }
    },
    // Cho tôi xem tất cả đánh giá của bệnh nhân về bác sĩ.
    get_all_reviews: async (args, ma_user) => {
        try {
            const { averageRating, ratings } = await ratingService.getAllRatingsByDoctorID(ma_user);
            
            return { message: "get_all_reviews", averageRating, ratings };

        } catch (error) {
            throw new Error(`Error in get_all_reviews: ${error.message}`);
        }
    },
    // Cho tôi danh sách toàn bộ các lịch khám đã diễn ra.
    get_appointment: async (args, ma_user) => {
        try {
            const appointments = await appointmentService.getTop5ByDoctorID(ma_user);

            return { message: "get_appointment", noi_dung_van_ban: appointments };

        } catch (error) {
            throw new Error(`Error in get_appointment: ${error.message}`);
        }
    },
    // Cho tôi xem chi tiết cuộc hẹn với bệnh nhân Nguyễn Thị Hiền vào lúc 7h sáng ngày 24/3.
    get_detail_appointment: async (args, ma_user) => {
    try {
        const { patient_name, time } = args;

        if (!time || !patient_name) {
        throw new Error("Thiếu time hoặc patient_name");
        }

        // ✅ Parse ISO với múi giờ Việt Nam
        const luxonDate = DateTime.fromISO(time, { zone: "Asia/Ho_Chi_Minh" });

        // ✅ Chuyển sang UTC tương đương để Postgres hiểu đúng
        const start_time = luxonDate.toUTC().toJSDate();

        const appointment = await appointmentService.getAppointmentByPatientNameAndTime(
            ma_user,
            patient_name,
            start_time
        );

        return {
            message: `get_detail_appointment`,
            noi_dung_van_ban: appointment,
        };
    } catch (error) {
        console.error("❌ Lỗi get_detail_appointment:", error);
        throw new Error(`Error in get_appointment_by_patient_name_and_time: ${error.message}`);
    }
    },
    // Cho tôi xem thông tin chi tiết của bệnh nhân Nguyễn Thị Hiền.
    get_patient_info_by_doctor: async (args, ma_user) => {
        try {
            const { patient_name } = args;

            if (!patient_name) {
            throw new Error("Thiếu tên bệnh nhân (patient_name)");
            }

            const patient = await patientService.getPatientInfoByName(patient_name);

            if (!patient) {
            return { message: `❌ Không tìm thấy bệnh nhân tên "${patient_name}"` };
            }

            return {
                message: `get_patient_info_by_doctor`,
                noi_dung_van_ban: patient
            };
        } catch (error) {
            console.error("❌ Lỗi get_patient_info_by_doctor:", error);
            throw new Error(`Error in get_patient_info_by_doctor: ${error.message}`);
        }
    },
    // Danh sách cuộc hẹn kế tiếp
    get_upcoming_appointment : async (args, ma_user) => {
        try {
            const appointments = await appointmentService.getUpcomingAppointmentsByDoctorID(ma_user);
            return { message: "get_upcoming_appointment", appointments };
        } catch (error) {
            throw new Error(`Error in get_upcomming_appointment: ${error.message}`);
        }
    },
    // Tôi muốn xem các cuộc hẹn từ 7 giờ đến 9 giờ sáng ngày 24/3.
    get_appointment_by_time: async (args, ma_user) => {
        const { time } = args;

        const appointments = await appointmentService.getAppointmentsByTimeRange(ma_user, time);

        return {
            message: "get_appointment_by_time",
            data: appointments,
        };
    },
    // Tôi muốn xem các cuộc hẹn đã bị hủy.
    get_appointment_canceled: async (args, ma_user) => {
        const appointments = await appointmentService.getCanceledAppointmentsByDoctorID(ma_user);

        return {
            message: "get_appointment_canceled",
            data: appointments,
        };
    },
    // Tôi muốn xem các cuộc hẹn đã khám xong.
    get_appointment_done: async (args, ma_user) => {
        const appointments = await appointmentService.getDoneAppointmentsByDoctorID(ma_user);

        return {
            message: "get_appointment_done",
            data: appointments,
        };
    },
    // Tôi muốn xem các cuộc hẹn chưa khám.
    get_appointment_undone: async (args, ma_user) => {
        const appointments = await appointmentService.getUndoneAppointmentsByDoctorID(ma_user);

        return {
            message: "get_appointment_undone",
            data: appointments,
        };
    },
    // Cho tôi xem toàn bộ lịch sử khám bệnh của bệnh nhân Nguyễn Thị Hiền.
    get_appointment_history_by_patient: async (args, ma_user) => {
        const { patient_name } = args;

        const { count, data } = await appointmentService.getAllByPatientNameAndDoctorID(patient_name, ma_user);

        return {
            message: `get_patient_appointments_by_name`,
            total: count,
            data,
        };
    },
    // Cho tôi xem kết quả khám bệnh của bệnh nhân Nguyễn Thị Hiền.
    get_diagnosis_patient_by_all: async (args, ma_user) => {
        const { patient_name } = args;

        const result = await diagnosisService.getDiagnosisByPatientName(patient_name);

        return {
            message: "get_diagnosis_patient_by_all",
            total: result.length,
            data: result,
        };
    },
    // Tôi muốn xem toàn bộ kết quả khám bệnh mà tôi đã thực hiện.
    get_all_diagnosis_results: async (args, ma_user) => {
        const result = await diagnosisService.getDiagnosisByDoctorID(ma_user);

        return {
            message: "get_all_diagnosis_results",
            total: result.length,
            data: result,
        };
    },
    // Tôi muốn biết bệnh nhân Nguyễn Thị Hiền đã nhận xét gì về tôi.
    get_review_by_patient: async (args) => {
        const { patient_name } = args;
        const reviews = await ratingService.getReviewByPatientName(patient_name);

        return {
            message: "get_review_by_patient",
            total: reviews.length,
            data: reviews,
        };
    },
    // Tôi muốn biết tổng số lượt đánh giá tôi nhận được.
    get_review_statistics: async (args, ma_user) => {
        const result = await ratingService.getReviewStatisticsByDoctorID(ma_user);

        return {
            message: "get_review_statistics",
            data: result,
        };
    },
    // Tôi muốn tắt chia sẻ kết quả khám bệnh của bệnh nhân Nguyễn Thị Hiền.
    turn_off_sharing_status_patient: async (args, ma_user) => {
        try {
            const { patient_name } = args;

            const result = await diagnosisService.updateHiddenStateByName(
                ma_user,
                patient_name,
                true // ✅ turn OFF => an_kq = true
            );

            return {
                message: "turn_off_sharing_status_patient",
                data: result,
            };
        } catch (error) {
            console.error("❌ turn_off_sharing_status_patient error:", error);
            return {
                message: "turn_off_sharing_status_patient",
                error: error.message,
            };
        }
    },
    // Tôi muốn mở chia sẻ kết quả khám bệnh của bệnh nhân Nguyễn Thị Hiền.
    turn_on_sharing_status_patient: async (args, ma_user) => {
        try {
            const { patient_name } = args;

            const result = await diagnosisService.updateHiddenStateByName(
                ma_user,
                patient_name,
                false // ✅ turn OFF => an_kq = false
            );

            return {
                message: "turn_on_sharing_status_patient",
                data: result,
            };
        } catch (error) {
            console.error("❌ turn_on_sharing_status_patient error:", error);
            return {
                message: "turn_on_sharing_status_patient",
                error: error.message,
            };
        }
    },

};

async function handleLLMResponse(parsed, ma_user) {
  const { function: fn, args, message, reply } = parsed; 

  const handler = FUNCTION_MAP[fn];

  if (!handler) {
    return "⚠️ Không hiểu yêu cầu bạn vừa gửi.";
  }

  try {
    return await handler(args, ma_user);
  } catch (err) {
    console.error(`❌ Lỗi khi gọi hàm ${fn}:`, err);
    return "⚠️ Có lỗi xảy ra khi xử lý yêu cầu.";
  }
}

module.exports = { handleLLMResponse };
