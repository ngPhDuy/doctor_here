const e = require("express");
const service = require("../services/diagnosis.service.js");

exports.getDiagnosisByPatient = async (req, res) => {
  try {
    const ptID = req.params.ptID;
    const diagnosis = await service.getDiagnosisByPatient(ptID);
    if (!diagnosis) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chẩn đoán cho bệnh nhân này" });
    }
    res.status(200).json(diagnosis);
  } catch (error) {
    console.error("Error fetching diagnosis:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin chẩn đoán" });
  }
};

exports.getDiagnosisDetail = async (req, res) => {
  try {
    const diagnosisID = req.params.id;
    const diagnosis = await service.getDiagnosisDetail(diagnosisID);
    if (!diagnosis) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin chẩn đoán này" });
    }
    res.status(200).json(diagnosis);
  } catch (error) {
    console.error("Error fetching diagnosis detail:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin chẩn đoán" });
  }
};

exports.getMedicineSchedule = async (req, res) => {
  try {
    const { ptID, startDate, endDate } = req.query;
    const schedule = await service.getMedicineSchedule(
      ptID,
      startDate,
      endDate
    );
    if (!schedule) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch trình thuốc" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching medicine schedule:", error);
    res.status(500).json({ message: "Lỗi khi lấy lịch trình thuốc" });
  }
};

exports.updateMedicineSchedule = async (req, res) => {
  try {
    const scheduleID = req.params.id;
    const { newTime } = req.body;
    const updatedSchedule = await service.updateMedicineSchedule(
      scheduleID,
      newTime
    );
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch trình này" });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Error updating medicine schedule:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật lịch trình thuốc" });
  }
};

// Thay đổi toàn bộ giờ uống thuốc dựa trên id đơn thuốc và buổi uống
exports.updateAllMedicineScheduleByDoseTime = async (req, res) => {
  try {
    //Lấy từ query string
    const { prescriptionID, doseTime } = req.query;
    const { newTime } = req.body;

    if (!prescriptionID || !doseTime || !newTime) {
      return res.status(400).json({
        message: "Thiếu thông tin đơn thuốc, buổi uống hoặc thời gian mới",
      });
    }

    const updatedSchedule = await service.updateAllMedicineScheduleByDoseTime(
      prescriptionID,
      doseTime,
      newTime
    );

    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Error updating all medicine schedule by dose time:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật lịch trình thuốc theo thời gian uống",
    });
  }
};

exports.toggleMedicineScheduleStatus = async (req, res) => {
  try {
    const scheduleID = req.params.id;
    const updatedSchedule =
      await service.toggleMedicineScheduleStatus(scheduleID);
    if (!updatedSchedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch trình này" });
    }
    res.status(200).json(updatedSchedule);
  } catch (error) {
    console.error("Error toggling medicine schedule status:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái lịch trình" });
  }
};

exports.getMedicineScheduleByID = async (req, res) => {
  try {
    const scheduleID = req.params.id;
    const schedule = await service.getMedicineScheduleByID(scheduleID);
    if (!schedule) {
      return res.status(404).json({ message: "Không tìm thấy lịch trình này" });
    }
    res.status(200).json(schedule);
  } catch (error) {
    console.error("Error fetching medicine schedule by ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy lịch trình thuốc" });
  }
};

exports.updateDiagnosis = async (req, res) => {
  try {
    const appID = req.params.appID;
    const diagnosisDetails = req.body;
    const updatedDiagnosis = await service.updateDiagnosis(
      appID,
      diagnosisDetails
    );
    res.status(200).json(updatedDiagnosis);
  } catch (error) {
    console.error("Error updating diagnosis:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin chẩn đoán" });
  }
};

exports.createPrescription = async (req, res) => {
  try {
    const prescriptionDetails = req.body;
    const newPrescription =
      await service.createPrescription(prescriptionDetails);
    res.status(201).json(newPrescription);
  } catch (error) {
    console.error("Error creating prescription:", error);
    res.status(500).json({ message: "Lỗi khi tạo đơn thuốc" });
  }
};

exports.getMedicineList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const keyword = req.query.search || "";

    const result = await service.getMedicineList(limit, offset, keyword);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching medicine list:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách thuốc" });
  }
};

exports.getMedicineByID = async (req, res) => {
  try {
    const medicineID = req.params.id;
    const medicine = await service.getMedicineByID(medicineID);
    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc này" });
    }
    res.status(200).json(medicine);
  } catch (error) {
    console.error("Error fetching medicine by ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin thuốc" });
  }
};

exports.deleteMedicineList = async (req, res) => {
  try {
    const { idList } = req.body;
    const deletedList = await service.deleteMedicineList(idList);
    return res.status(200).json(deletedList);
  } catch (error) {
    console.error("Error deleting medicine list:", error);
    res.status(500).json({ message: "Lỗi khi xóa danh sách thuốc" });
  }
};

exports.updateMedicine = async (req, res) => {
  try {
    const medicineID = req.params.id;
    const medicineDetails = req.body;
    const updatedMedicine = await service.updateMedicine(
      medicineID,
      medicineDetails
    );
    res.status(200).json(updatedMedicine);
  } catch (error) {
    console.error("Error updating medicine:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin thuốc" });
  }
};

exports.createMedicine = async (req, res) => {
  try {
    const medicineDetails = req.body;
    const newMedicine = await service.createMedicine(medicineDetails);
    res.status(201).json(newMedicine);
  } catch (error) {
    console.error("Error creating medicine:", error);
    res.status(500).json({ message: "Lỗi khi tạo thuốc" });
  }
};

exports.getDiagnosisDetailByAppointmentID = async (req, res) => {
  try {
    const appointmentID = req.params.appID;
    const detail =
      await service.getDiagnosisDetailByAppointmentID(appointmentID);
    res.status(200).json(detail);
  } catch (error) {
    console.error("Error fetching detail by appointment ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin" });
  }
};

exports.getDiagnosisFromOther = async (req, res) => {
  try {
    const ptID = req.params.ptID;
    const diagnosis = await service.getDiagnosisFromOther(ptID);
    res.status(200).json(diagnosis);
  } catch (error) {
    console.error("Error fetching diagnosis from other:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin chẩn đoán" });
  }
};

exports.getIsShared = async (req, res) => {
  try {
    const { appID } = req.params;
    const isShared = await service.getIsShared(appID);
    res.status(200).json(isShared);
  } catch (error) {
    console.error("Error fetching is shared:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin" });
  }
};

exports.getPatientsByDoctorID = async (req, res) => {
  try {
    const { drID } = req.params;
    const patients = await service.getPatientsByDoctorID(drID);
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients by doctor ID:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách bệnh nhân" });
  }
};

exports.getHiddenState = async (req, res) => {
  try {
    const { drID, ptID } = req.params;
    const hiddenState = await service.getHiddenState(drID, ptID);
    res.status(200).json(hiddenState);
  } catch (error) {
    console.error("Error fetching hidden state:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin" });
  }
};

exports.updateHiddenState = async (req, res) => {
  try {
    const { drID, ptID } = req.params;
    const { newState } = req.body;
    const updatedHiddenState = await service.updateHiddenState(
      drID,
      ptID,
      newState
    );
    res.status(200).json(updatedHiddenState);
  } catch (error) {
    console.error("Error updating hidden state:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin" });
  }
};

exports.updateShareAllForPatient = async (req, res) => {
  try {
    const { ptID } = req.params;
    const { newState } = req.body;
    const updatedShareAll = await service.updateShareAllForPatient(
      ptID,
      newState
    );
    res.status(200).json(updatedShareAll);
  } catch (error) {
    console.error("Error updating share all for patient:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin" });
  }
};

exports.updateShareAllForDoctor = async (req, res) => {
  try {
    const { drID } = req.params;
    const { newState } = req.body;
    const updatedShareAll = await service.updateShareAllForDoctor(
      drID,
      newState
    );
    res.status(200).json(updatedShareAll);
  } catch (error) {
    console.error("Error updating share all for doctor:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật thông tin" });
  }
};

exports.getShareAllForPatient = async (req, res) => {
  try {
    const { ptID } = req.params;
    const shareAll = await service.getShareAllForPatient(ptID);
    res.status(200).json(shareAll);
  } catch (error) {
    console.error("Error fetching share all for patient:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin" });
  }
};

exports.getShareAllForDoctor = async (req, res) => {
  try {
    const { drID } = req.params;
    const shareAll = await service.getShareAllForDoctor(drID);
    res.status(200).json(shareAll);
  } catch (error) {
    console.error("Error fetching share all for doctor:", error);
    res.status(500).json({ message: "Lỗi khi lấy thông tin" });
  }
};
