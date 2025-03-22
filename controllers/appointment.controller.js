const appointmentService = require("../services/appointment.service");

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllAppointmentByID = async (req, res) => {
  try {
    const appointmentID = req.params.id;
    console.log(appointmentID);
    const appointment = await appointmentService.getAppointmentByID(
      appointmentID
    );
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.countAppointmentByMethod = async (req, res) => {
  try {
    console.log("Controller hit: countAppointmentByStatus");

    // Kiểm tra tham số từ request
    const onlMethod = req.query.onlMethod;
    const doctorID = req.query.doctorID;

    console.log("Received query params:", onlMethod, doctorID);

    // Kiểm tra nếu thiếu tham số
    if (!onlMethod || !doctorID) {
      return res
        .status(400)
        .json({ message: "Thiếu tham số bắt buộc: status và doctorID" });
    }

    // Gọi service để lấy số lượng cuộc hẹn
    let count = await appointmentService.countAppointmentByMethod(
      onlMethod,
      doctorID
    );
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
      return res.status(400).json({
        message: "Thiếu tham số bắt buộc: startDate, endDate và doctorID",
      });
    }

    // Gọi service để lấy thông tin lịch hẹn
    const appointments = await appointmentService.getAppointmentSchedule(
      startDate,
      endDate,
      doctorID
    );

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllByDoctorID = async (req, res) => {
  try {
    const doctorID = req.query.doctorID;
    const appointments = await appointmentService.getAllByDoctorID(doctorID);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentID = req.body.appointmentID;
    const status = req.body.status;
    const appointment = await appointmentService.updateAppointmentStatus(
      appointmentID,
      status
    );
    res
      .status(200)
      .json("Cập nhật thành công " + appointment + " với " + status);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllByPatientAndDoctor = async (req, res) => {
  try {
    const patientID = req.query.patientID;
    const doctorID = req.query.doctorID;
    const appointments = await appointmentService.getAllByPatientAndDoctor(
      patientID,
      doctorID
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllByStatusAndPtID = async (req, res) => {
  try {
    let status = req.params.status;
    let ptID = req.params.ptID;

    if (!status || !ptID) {
      return res.status(400).json({ message: "Thiếu tham số bắt buộc" });
    }

    if (+status === 1) {
      status = "Đang chờ";
    } else if (+status === 2) {
      status = "Hoàn thành";
    } else if (+status === 3) {
      status = "Đã hủy";
    } else {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const appointments = await appointmentService.getAllByStatusAndPtID(
      status,
      ptID
    );
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
