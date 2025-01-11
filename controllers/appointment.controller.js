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
        const appointmentID = req.params['appointmentID'];
        console.log(appointmentID);
        const appointment = await appointmentService.getAppointmentByID(appointmentID);
        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}