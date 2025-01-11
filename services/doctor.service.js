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
/*props:
doctorID:
email
fullName
phoneNumber
birthDay: yyyy-mm-dd
gender
description
*/
exports.changeInfo = async (props) => {
    const userID = +props.doctorID.substring(2);
    const user = await User.findOne({
        where: {
            "id": userID
        }
    });
    const doctor = await Doctor.findOne({
        where: {
            "ma_bac_si": props.doctorID
        }
    });

    if (!user || !doctor) {
        throw new Error('User or Doctor not found');
    }

    user['email'] = props.email;
    user['ho_va_ten'] = props.fullName;
    user['sdt'] = props.phoneNumber;
    user['ngay_sinh'] = new Date(props.birthDay);
    user['gioi_tinh'] = props.gender;
    doctor['mo_ta'] = props.description;

    const userChangedColumns = user.changed() || [];
    const doctorChangedColumns = doctor.changed() || [];

    await user.save();
    await doctor.save();

    return {
        userUpdated: userChangedColumns.length > 0,
        doctorUpdated: doctorChangedColumns.length > 0,
        userChangedColumns,
        doctorChangedColumns,
    };
}