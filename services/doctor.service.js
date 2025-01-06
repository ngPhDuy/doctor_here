const {Doctor, User} = require('../models');

exports.getAllDoctor = async () => {
    const doctor = await Doctor.findAll({
        include: {
            model: User,
            as: 'Nguoi_dung',
            attributes: {
                exclude: ['id']
            }
        }
    });
    return doctor;
}

exports.getDoctorInfo = async (doctorID) => {
    const doctor = await Doctor.findOne({
        where: {
            "ma_bac_si": doctorID
        },
        include: {
            model: User,
            as: 'Nguoi_dung',
            attributes: {
                exclude: ['id']
            }
        }
    });
    return doctor;
}
