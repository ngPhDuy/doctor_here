const appointmentService = require('../services/appointment.service');

exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentService.getAllAppointments();
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllAppointmentByID = async (req, res) => {
    try {
        const appointmentID = req.query['appointmentID'];
        console.log(appointmentID);
        const appointment = await appointmentService.getAppointmentByID(appointmentID);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.countAppointmentByMethod = async (req, res) => {
    try {
        console.log("Controller hit: countAppointmentByStatus");

        // Kiểm tra tham số từ request
        const onlMethod = req.query.onlMethod;
        const doctorID = req.query.doctorID;

        console.log("Received query params:", onlMethod, doctorID);

        // Kiểm tra nếu thiếu tham số
        if (!onlMethod || !doctorID) {
            return res.status(400).json({ message: "Thiếu tham số bắt buộc: status và doctorID" });
        }

        // Gọi service để lấy số lượng cuộc hẹn
        let count = await appointmentService.countAppointmentByMethod(onlMethod, doctorID);
        count = count[0].count;
        
        console.log("Query result:", count);
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getAppointmentSchedule = async (req, res) => {
    try {
        console.log("Controller hit: getAppointmentSchedule");

        // Kiểm tra tham số từ request
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const doctorID = req.query.doctorID;

        console.log("Received query params:", startDate, endDate, doctorID);

        // Kiểm tra nếu thiếu tham số
        if (!startDate || !endDate || !doctorID) {
            return res.status(400).json({ message: "Thiếu tham số bắt buộc: startDate, endDate và doctorID" });
        }

        // Gọi service để lấy thông tin lịch hẹn
        const appointments = await appointmentService.getAppointmentSchedule(startDate, endDate, doctorID);

        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: error.message });
    }
}
