const {
  UpdateRequest,
  sequelize,
  ImageRequest,
  RequestHandle,
  Doctor,
  User,
} = require("../models/index");

exports.getAllNewRequest = async () => {
  try {
    const newRequest = await sequelize.query(
      `SELECT YC.ma_yeu_cau, YC.ma_bac_si, ND.ho_va_ten, YC.thoi_diem_yeu_cau, YC.trang_thai
            FROM "Yeu_cau_cap_nhat_thong_tin" YC
            JOIN "Bac_si" BS ON YC.ma_bac_si = BS.ma_bac_si
            JOIN "Nguoi_dung" ND ON BS.id = ND.id
            WHERE YC.trang_thai = 'Chờ duyệt'
            ORDER BY YC.thoi_diem_yeu_cau DESC;`,
      { type: sequelize.QueryTypes.SELECT }
    );

    return newRequest;
  } catch (error) {
    console.log(error);
  }
};

exports.getOldRequest = async () => {
  try {
    const oldRequest = await sequelize.query(
      `SELECT YC.ma_yeu_cau, YC.ma_bac_si, ND.ho_va_ten, YC.thoi_diem_yeu_cau, YC.trang_thai
            FROM "Yeu_cau_cap_nhat_thong_tin" YC
            JOIN "Bac_si" BS ON YC.ma_bac_si = BS.ma_bac_si
            JOIN "Nguoi_dung" ND ON BS.id = ND.id
            WHERE YC.trang_thai != 'Chờ duyệt'
            ORDER BY YC.thoi_diem_yeu_cau DESC;`,
      { type: sequelize.QueryTypes.SELECT }
    );

    return oldRequest;
  } catch (error) {
    console.log(error);
  }
};

exports.getRequestDetail = async (requestID) => {
  try {
    requestID = String(requestID);
    const requestDetail = await UpdateRequest.findOne({
      where: { ma_yeu_cau: requestID },
      include: [
        {
          model: Doctor,
          as: "Bac_si",
          attributes: {
            exclude: ["id"],
          },
          include: [
            {
              model: User,
              as: "Nguoi_dung",
              attributes: {
                exclude: ["id"],
              },
            },
          ],
        },
        {
          model: ImageRequest,
          as: "Anh_minh_chung",
          attributes: ["url"],
        },
        {
          model: RequestHandle,
          as: "Duyet_yeu_cau_cap_nhat",
        },
      ],
    });

    return requestDetail;
  } catch (error) {
    console.log(error);
  }
};

exports.getRequestByDoctorID = async (doctorID) => {
  try {
    doctorID = String(doctorID);
    const requests = await UpdateRequest.findAll({
      where: { ma_bac_si: doctorID },
      include: {
        model: Doctor,
        as: "Bac_si",
        attributes: {
          exclude: ["id"],
        },
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: {
              exclude: ["id"],
            },
          },
        ],
      },
      order: [["thoi_diem_yeu_cau", "DESC"]],
    });

    return requests;
  } catch (error) {
    console.log(error);
  }
};

exports.handleRequest = async (requestID, approved, reason, adminID) => {
  try {
    requestID = String(requestID);
    const request = await UpdateRequest.findOne({
      where: { ma_yeu_cau: requestID },
    });

    if (approved) {
      await request.update({ trang_thai: "Đã duyệt" });

      //Cập nhật các thông tin mới vào bảng Doctor
      const doctor = await Doctor.findOne({
        where: { ma_bac_si: request.ma_bac_si },
      });

      await doctor.update({
        dia_chi_pk: request.dia_chi_pk_moi,
        trinh_do_hoc_van: request.trinh_do_hoc_van_moi,
        chuyen_khoa: request.chuyen_khoa_moi,
      });
    } else {
      await request.update({ trang_thai: "Từ chối" });
    }

    await RequestHandle.create({
      yeu_cau_cap_nhat: requestID,
      ma_qtv: adminID,
      ly_do: reason,
      thoi_diem_duyet: new Date(),
    });
  } catch (error) {
    console.log(error);
  }
};

/*
Input Pros: mã bác sĩ, chuyên khoa, địa chỉ, trình độ học vấn
- doctorID
- speciality
- address
- education
- urls
*/
exports.createUpdateRequest = async (pros) => {
  try {
    // cái nào rỗng cho bằng null
    if (pros.education === "") {
      pros.education = null;
    }
    if (pros.address === "") {
      pros.address = null;
    }
    if (pros.speciality === "") {
      pros.speciality = null;
    }
    console.log("createUpdateRequest function:");
    console.log(pros);
    const result = await sequelize.query(
      `CALL create_update_request(:education, :address, :speciality, :doctorID, :out_ma_yeu_cau);`,
      {
        replacements: {
          education: pros.education,
          address: pros.address,
          speciality: pros.speciality,
          doctorID: pros.doctorID,
          out_ma_yeu_cau: null,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    console.log("result: ", result);
    const requestID = result[0].out_ma_yeu_cau;
    console.log("out_ma_yeu_cau: ", result[0].out_ma_yeu_cau);

    //upload ảnh minh chứng
    if (pros.urls && pros.urls.length > 0) {
      // Đảm bảo các file được upload đồng bộ
      const uploadPromises = pros.urls.map(async (url) => {
        await ImageRequest.create({
          ma_yeu_cau: requestID, // Truyền giá trị hợp lệ vào ma_yeu_cau
          url: url,
        });
      });

      await Promise.all(uploadPromises); // Đảm bảo tất cả promise hoàn tất
    }

    return {
      ma_yeu_cau: requestID,
    };
  } catch (error) {
    console.log(error);
  }
};

//Bác sĩ thu hồi yêu cầu của mình
exports.cancelRequest = async (requestID, doctorID) => {
  try {
    const request = await UpdateRequest.findOne({
      where: {
        ma_yeu_cau: requestID.toString(),
        ma_bac_si: doctorID.toString(),
      },
    });

    if (request) {
      //chỉnh trang_thai thành 'Thu hồi'
      await request.update({
        trang_thai: "Thu hồi",
        thoi_diem_thu_hoi: new Date(),
      });

      return {
        message: "Yêu cầu đã được thu hồi",
        success: true,
      };
    } else {
      return {
        message: "Yêu cầu không tồn tại",
        success: false,
      };
    }
  } catch (error) {
    console.log(error);
  }
};
