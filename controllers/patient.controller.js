const patientService = require('../services/patient.service');

exports.getAllPatient = async (req, res) => {
    try {
        const patient = await patientService.getAllPatient();
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getPatientInfo = async (req, res) => {
    try {
        console.log(req.params['patientID']);
        const patient = await patientService.getPatientInfo(req.params['patientID']);
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getAllByDoctorID = async (req, res) => {
    try {
        const doctorID = req.query['doctorID'];
        const patient = await patientService.getAllByDoctorID(doctorID);
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}