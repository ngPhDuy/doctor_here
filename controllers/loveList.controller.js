const loveListService = require("../services/loveList.service");

exports.getLoveListByPatient = async (req, res) => {
  try {
    const loveList = await loveListService.getLoveListByPatient(
      req.params.ptID
    );
    res.status(200).json(loveList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addDoctorToLoveList = async (req, res) => {
  try {
    const ptID = req.body.ptID;
    const drID = req.body.drID;

    if (!ptID || !drID) {
      return res.status(400).json({
        message: "Vui lòng cung cấp mã bệnh nhân và mã bác sĩ",
      });
    }

    const result = await loveListService.addDoctorToLoveList(ptID, drID);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeDoctorFromLoveList = async (req, res) => {
  try {
    const result = await loveListService.removeDoctorFromLoveList(
      req.params.ptID,
      req.params.drID
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports;
