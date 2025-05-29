const patientService = require("../services/patient.service");

exports.getAllPatient = async (req, res) => {
  try {
    const patient = await patientService.getAllPatient();
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPatientInfo = async (req, res) => {
  try {
    console.log(req.params["patientID"]);
    const patient = await patientService.getPatientInfo(
      req.params["patientID"]
    );
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllByDoctorID = async (req, res) => {
  try {
    const doctorID = req.query["doctorID"];
    const patient = await patientService.getAllByDoctorID(doctorID);
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOne = async (req, res) => {
  try {
    const patient = await patientService.createOne(req.body);
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getUserDetail = async (req, res) => {
  try {
    const ptID = req.params["ptID"];
    const userDetail = await patientService.getUserDetail(ptID);
    res.status(200).json(userDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInsuranceInfo = async (req, res) => {
  try {
    const ptID = req.params["ptID"];
    const insuranceInfo = await patientService.getInsuranceInfo(ptID);
    res.status(200).json(insuranceInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserDetail = async (req, res) => {
  try {
    const ptID = req.params["ptID"];
    const userDetail = await patientService.updateUserDetail(ptID, req.body);
    res.status(200).json(userDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInsuranceInfo = async (req, res) => {
  try {
    const ptID = req.params["ptID"];
    const insuranceInfo = await patientService.updateInsuranceInfo(
      ptID,
      req.body
    );
    res.status(200).json(insuranceInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
