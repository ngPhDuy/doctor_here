const doctorService = require('../services/doctor.service');

exports.getAllDoctor = async (req, res) => {
    try {
        const doctor = await doctorService.getAllDoctor();
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getDoctorInfo = async (req, res) => {
    try {
        console.log(req.params['doctorID']);
        const doctor = await doctorService.getDoctorInfo(req.params['doctorID']);
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}