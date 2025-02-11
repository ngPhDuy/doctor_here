const {UpdateRequest, sequelize, ImageRequest, RequestHandle, Doctor, User} = require('../models/index');

exports.getAllNewRequest = async () => {
    try {
        const newRequest = await sequelize.query(
            `SELECT YC.ma_yeu_cau, YC.ma_bac_si, ND.ho_va_ten, YC.thoi_diem_yeu_cau, YC.trang_thai
            FROM "Yeu_cau_cap_nhat_thong_tin" YC
            JOIN "Bac_si" BS ON YC.ma_bac_si = BS.ma_bac_si
            JOIN "Nguoi_dung" ND ON BS.id = ND.id
            WHERE YC.trang_thai = 'Chờ duyệt';`,
            { type: sequelize.QueryTypes.SELECT }
        );

        return newRequest;
    } catch (error) {
        console.log(error);
    }
}

exports.getOldRequest = async () => {
    try {
        const oldRequest = await sequelize.query(
            `SELECT YC.ma_yeu_cau, YC.ma_bac_si, ND.ho_va_ten, YC.thoi_diem_yeu_cau, YC.trang_thai
            FROM "Yeu_cau_cap_nhat_thong_tin" YC
            JOIN "Bac_si" BS ON YC.ma_bac_si = BS.ma_bac_si
            JOIN "Nguoi_dung" ND ON BS.id = ND.id
            WHERE YC.trang_thai != 'Chờ duyệt';`,
            { type: sequelize.QueryTypes.SELECT }
        );

        return oldRequest;
    } catch (error) {
        console.log(error);
    }
}

exports.getRequestDetail = async (requestID) => {
    try {
        requestID = String(requestID);
        const requestDetail = await UpdateRequest.findOne({
            where: { ma_yeu_cau: requestID },
            include: [
                {
                    model: Doctor,
                    as: 'Bac_si',
                    attributes: {
                        exclude: ['id']
                    },
                    include: [{
                        model: User,
                        as: 'Nguoi_dung',
                        attributes: {
                            exclude: ['id']
                        }
                    }]
                }, {
                    model: ImageRequest,
                    as: 'Anh_minh_chung',
                    attributes: ['url']
                }, {
                    model: RequestHandle,
                    as: 'Duyet_yeu_cau_cap_nhat',
                }
            ]
        });

        return requestDetail;
    } catch (error) {
        console.log(error);
    }
}

exports.getRequestByDoctorID = async (doctorID) => {
    try {
        doctorID = String(doctorID);
        const requests = await UpdateRequest.findAll({
            where: { ma_bac_si: doctorID },
            include: {
                    model: Doctor,
                    as: 'Bac_si',
                    attributes: {
                        exclude: ['id']
                    },
                    include: [{
                        model: User,
                        as: 'Nguoi_dung',
                        attributes: {
                            exclude: ['id']
                        }
                    }]
                }
        });

        return requests;
    } catch (error) {
        console.log(error);
    }
}

exports.handleRequest = async (requestID, approved, adminID) => {
    try {
        requestID = String(requestID);
        const request = await UpdateRequest.findOne({
            where: { ma_yeu_cau: requestID }
        });

        if (approved) {
            await request.update({ trang_thai: 'Đã duyệt' });
        } else {
            await request.update({ trang_thai: 'Từ chối' });
        }

        await RequestHandle.create({
            yeu_cau_cap_nhat: requestID,
            ma_qtv: adminID,
            thoi_diem_duyet: new Date()
        });

    } catch (error) {
        console.log(error);
    }
}

