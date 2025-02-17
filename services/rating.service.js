const {sequelize, Rating, Appointment, Patient, User} = require('../models');

exports.getAllRatingsByDoctorID = async (doctorID) => {
    const ratings = await Rating.findAll({
        include: [
            {
                model: Appointment,
                as: 'Cuoc_hen',
                where: {
                    ma_bac_si: doctorID.toString()
                },
                attributes: ['id']
            }, {
                model: Patient,
                as: 'Benh_nhan',
                attributes: ['ma_benh_nhan'],
                include: [
                    {
                        model: User,
                        as: 'Nguoi_dung',
                        attributes: ['ho_va_ten']
                    }
                ]
            }
        ]
    });
    return ratings;
}