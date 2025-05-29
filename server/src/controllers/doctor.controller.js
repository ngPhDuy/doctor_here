const doctorService = require("../services/doctor.service");
const notiService = require("../services/pushNotification.service");

exports.getAllDoctor = async (req, res) => {
  try {
    const doctor = await doctorService.getAllDoctor();
    // notiService.sendMessNotification(
    //   "BS0000003",
    //   "BN0000053",
    //   {
    //     title: "test",
    //     body: "test",
    //   },
    //   0
    // );
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoctorInfo = async (req, res) => {
  try {
    console.log(req.params["doctorID"]);
    const doctor = await doctorService.getDoctorInfo(req.params["doctorID"]);
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.changeInfo = async (req, res) => {
  try {
    const result = await doctorService.changeInfo(req.body);

    if (result.userUpdated || result.doctorUpdated) {
      return res.status(200).json({
        message: "Cập nhật thông tin thành công",
        userChangedColumns: result.userChangedColumns,
        doctorChangedColumns: result.doctorChangedColumns,
      });
    } else {
      return res.status(200).json({
        message: "Không có thông tin nào được cập nhật",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.insertDoctor = async (req, res) => {
  try {
    const result = await doctorService.insertDoctor(req.body);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.insertWeeklyWork = async (req, res) => {
  try {
    const result = await doctorService.insertWeeklyWork(req.body);
    res.status(200).json({ message: "Thêm lịch làm việc thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSpecialization = async (req, res) => {
  try {
    console.log("get all specialization");
    const spec = await doctorService.getAllSpecialization();
    res.status(200).json(spec);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.haveWorking = async (req, res) => {
  try {
    const { drID } = req.params;
    console.log("drID in controller ", drID);
    const result = await doctorService.haveWorking(drID);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.generateTimeSlotsForDoctors = async (req, res) => {
  try {
    const { drID } = req.params;
    const result = await doctorService.generateTimeSlotsForDoctors([drID]);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
