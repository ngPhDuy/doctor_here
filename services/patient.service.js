const {Patient, User, Doctor, Appointment, sequelize} = require('../models');

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

exports.getAllByDoctorID = async (doctorID) => {
    const query = sequelize.query(
        `select distinct nd.*, bn.*
        from "Benh_nhan" bn join "Nguoi_dung" nd on bn."id" = nd.id 
        join "Cuoc_hen" ch on bn."ma_benh_nhan" = ch."ma_benh_nhan_dat_hen"
        where ch."ma_bac_si" = :doctorID`,
        {
            replacements: { doctorID },
            type: sequelize.QueryTypes.SELECT
        }
    );

    return query;
}