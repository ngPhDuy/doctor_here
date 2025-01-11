const {Patient, User} = require('../models');

exports.getAllPatient = async () => {
    const patient = await Patient.findAll({
        include: {
            model: User,
            as: 'Nguoi_dung',
            attributes: {
                exclude: ['id']
            }
        }
    });
    return patient;
}

exports.getPatientInfo = async (patientID) => {
    const patient = await Patient.findOne({
        where: {
            "ma_benh_nhan": patientID
        },
        include: {
            model: User,
            as: 'Nguoi_dung',
            attributes: {
                exclude: ['id']
            }
        }
    });
    return patient;
}