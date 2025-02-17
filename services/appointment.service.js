const {Appointment, Patient, Doctor, Timeslot, User, sequelize} = require('../models');
const { Op, or } = require('sequelize');

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

exports.countAppointmentByMethod = async (onlMethod, doctorID) => {
    console.log("Service hit: countAppointmentByStatus");
    console.log("Received parameters:", onlMethod, doctorID);

    const query = sequelize.query(`
        select count(*) as count
        from "Cuoc_hen" ch join "Gio_hen" gh on ch."id_gio_hen" = gh."id"
        join "Ca_lam_viec_trong_tuan" clv on gh."id_ca_lam_viec" = clv."id"
        where clv."lam_viec_onl" = :onlMethod and ch."ma_bac_si" = :doctorID
    `, {
        replacements: {
            onlMethod,
            doctorID
        },
        type: sequelize.QueryTypes.SELECT
    });

    return query;
};

//Lấy thông tin các cuộc hẹn sắp diễn ra từ [ngày bắt đầu; ngày kết thúc] có trạng thái = "Đang chờ" và ma_bac_si = input
exports.getAppointmentSchedule = async (startDate, endDate, doctorID) => {
    //sắp xếp theo ngày làm việc và thời điểm bắt đầu
    const appointments = await Appointment.findAll({
        where: {
            trang_thai: 'Đang chờ',
            ma_bac_si: doctorID
        },
        attributes: ['id', 'dia_chi_phong_kham', 'thoi_diem_tao'], 
        include: [
            {
                model: Timeslot,
                as: 'Gio_hen',
                attributes: ['thoi_diem_bat_dau', 'thoi_diem_ket_thuc', 'ngay_lam_viec'],
                where: {
                    ngay_lam_viec: {
                        [Op.between]: [startDate, endDate]
                    }
                }
            }, {
                model: Patient,
                as: 'Benh_nhan',
                attributes: ['ma_benh_nhan'],
                include: [
                    {
                        model: User,
                        as: 'Nguoi_dung',
                        attributes: ['gioi_tinh', 'ho_va_ten']
                    }
                ]
            }
        ],
        order: [
            [{ model: Timeslot, as: 'Gio_hen' }, 'ngay_lam_viec', 'ASC'],
            [{ model: Timeslot, as: 'Gio_hen' }, 'thoi_diem_bat_dau', 'ASC']
        ]
    });
    return appointments;
}