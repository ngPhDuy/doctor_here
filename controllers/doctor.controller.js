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

exports.changeInfo = async (req, res) => {
    try {
        const result = await doctorService.changeInfo(req.body);

        if (result.userUpdated || result.doctorUpdated) {
            return res.status(200).json({
                message: 'Cập nhật thông tin thành công',
                userChangedColumns: result.userChangedColumns,
                doctorChangedColumns: result.doctorChangedColumns,
            });
        } else {
            return res.status(200).json({
                message: 'Không có thông tin nào được cập nhật',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
