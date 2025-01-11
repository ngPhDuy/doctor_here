const {Appointment, Patient, Doctor} = require('../models');

exports.getAllAppointments = async () => {
    const appointments = await Appointment.findAll();
    return appointments;
}

exports.getAppointmentByID = async (appointmentID) => {
    const appointment = await Appointment.findOne({
        where: {
            id: appointmentID
        },
        include: [
            {
                model: Patient,
                as: 'Benh_nhan',
                attributes: {
                    exclude: ['id']
                }
            },
            {
                model: Doctor,
                as: 'Bac_si',
                attributes: {
                    exclude: ['id']
                }
            }
        ]
    });
    return appointment;
}