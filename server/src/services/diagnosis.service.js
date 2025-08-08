const {
  Diagnosis,
  Appointment,
  Timeslot,
  User,
  Doctor,
  ImageResult,
  Prescription,
  Medicine,
  PrescriptionContainsMedicine,
  MedicationSchedule,
  sequelize,
  Ingredient,
  MedicineInSingleDose,
  ConfidentialDoctor,
  Patient,
} = require("../models");
const { Op, where } = require("sequelize");
const cloudService = require("./cloud.service.js");

exports.getDiagnosisByPatient = async (ptID) => {
  const diagnosis = await Diagnosis.findAll({
    include: [
      {
        model: Appointment,
        as: "Cuoc_hen",
        where: { ma_benh_nhan_dat_hen: ptID },
        attributes: ["dia_chi_phong_kham"],
        include: [
          {
            model: Timeslot,
            as: "Gio_hen",
            attributes: ["thoi_diem_bat_dau", "thoi_diem_ket_thuc"],
          },
        ],
      },
      {
        model: Doctor,
        as: "Bac_si",
        attributes: ["chuyen_khoa"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "avt_url"],
          },
        ],
      },
    ],
  });

  return diagnosis.map((item) => {
    const { Cuoc_hen, Bac_si, ...rest } = item.dataValues;
    const { dia_chi_phong_kham, Gio_hen } = Cuoc_hen;
    const { thoi_diem_bat_dau, thoi_diem_ket_thuc } = Gio_hen;
    const { Nguoi_dung } = Bac_si;
    //Bỏ Cuoc_hen và Bac_si đi
    return {
      ...rest,
      dia_chi_phong_kham,
      thoi_diem_bat_dau,
      thoi_diem_ket_thuc,
      chuyen_khoa: Bac_si.chuyen_khoa,
      ho_va_ten: Nguoi_dung.ho_va_ten,
      avt_url: Nguoi_dung.avt_url,
    };
  });
};

exports.getDiagnosisDetail = async (diagnosisID) => {
  // Tìm kiếm chẩn đoán với ID đã cho
  const diagnosis = await Diagnosis.findOne({
    where: { id: diagnosisID },
    include: [
      {
        model: Appointment,
        as: "Cuoc_hen",
        attributes: ["dia_chi_phong_kham"],
        include: [
          {
            model: Timeslot,
            as: "Gio_hen",
            attributes: ["thoi_diem_bat_dau", "thoi_diem_ket_thuc"],
          },
        ],
      },
      {
        model: Doctor,
        as: "Bac_si",
        attributes: ["chuyen_khoa"],
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "avt_url"],
          },
        ],
      },
      {
        model: ImageResult,
        as: "Hinh_anh_ket_qua",
      },
      {
        model: Prescription,
        as: "Don_thuoc",
        attributes: ["ngay_bat_dau", "ngay_ket_thuc", "id", "ghi_chu"],
        required: false, // Chỉ join Prescription nếu có
        include: [
          {
            model: PrescriptionContainsMedicine,
            as: "Don_chua_thuoc",
            attributes: ["tong_so"],
            include: [
              {
                model: Medicine,
                as: "Thuoc",
                attributes: ["id", "ten_thuoc", "don_vi"],
              },
            ],
          },
        ],
      },
    ],
  });

  // Nếu không tìm thấy diagnosis, trả về null hoặc lỗi tùy ý
  if (!diagnosis) {
    throw new Error("Diagnosis not found");
  }

  // Lấy dữ liệu từ Sequelize và chuyển thành plain object
  const diagnosisData = diagnosis.get({ plain: true });

  // Định dạng lại kết quả, kiểm tra null trước khi xử lý
  const formattedDiagnosis = {
    ...diagnosisData,
    Bac_si: {
      ho_va_ten: diagnosisData.Bac_si?.Nguoi_dung?.ho_va_ten || null,
      avt_url: diagnosisData.Bac_si?.Nguoi_dung?.avt_url || null,
      chuyen_khoa: diagnosisData.Bac_si?.chuyen_khoa || null,
    },
    Don_thuoc: diagnosisData.Don_thuoc
      ? {
          ...diagnosisData.Don_thuoc,
          Don_chua_thuoc:
            diagnosisData.Don_thuoc?.Don_chua_thuoc?.map((item) => ({
              ...item.Thuoc,
              tong_so: item.tong_so,
            })) || [],
        }
      : null, // Nếu không có Don_thuoc thì trả về null
  };

  return formattedDiagnosis;
};

//startDate, endDate: YYYY-MM-DD
exports.getMedicineSchedule = async (ptID, startDate, endDate) => {
  const schedules = await Prescription.findAll({
    where: {
      ma_benh_nhan: ptID,
    },
    include: [
      {
        model: MedicationSchedule,
        as: "Lan_uong",
        where: {
          ngay: {
            [Op.between]: [startDate, endDate],
          },
        },
      },
    ],
    order: [["ngay_bat_dau", "ASC"]],
  });

  return schedules;
};

//NewTime: "09:30:00"
exports.updateMedicineSchedule = async (scheduleID, newTime) => {
  const schedule = await MedicationSchedule.findOne({
    where: {
      id: scheduleID,
    },
  });

  if (!schedule || schedule.thoi_diem_da_uong) {
    return null; // Nếu lịch đã được uống hoặc không tồn tại, trả về null.
  }

  // Kiểm tra định dạng thời gian HH:MM:SS
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
  if (!timeRegex.test(newTime)) {
    throw new Error("Thời gian không hợp lệ. Vui lòng nhập lại.");
  }

  // Chuyển newTime thành đối tượng Date
  const [hours, minutes, seconds] = newTime.split(":").map(Number);
  const newDate = new Date(); // Sử dụng ngày hiện tại để tạo đối tượng Date
  newDate.setHours(hours, minutes, seconds, 0); // Đặt giờ, phút, giây cho newDate

  // Tạo các giới hạn thời gian cho mỗi buổi uống thuốc
  const morningStart = new Date();
  morningStart.setHours(6, 0, 0, 0); // 06:00:00

  const morningEnd = new Date();
  morningEnd.setHours(11, 59, 59, 999); // 11:59:59

  const afternoonStart = new Date();
  afternoonStart.setHours(12, 0, 0, 0); // 12:00:00

  const afternoonEnd = new Date();
  afternoonEnd.setHours(17, 59, 59, 999); // 17:59:59

  const eveningStart = new Date();
  eveningStart.setHours(18, 0, 0, 0); // 18:00:00

  const eveningEnd = new Date();
  eveningEnd.setHours(23, 59, 59, 999); // 23:59:59

  // Kiểm tra xem thời gian có phù hợp với buổi uống thuốc không
  let validTimeForSession = false;

  if (
    schedule.buoi_uong === "Sáng" &&
    newDate >= morningStart &&
    newDate <= morningEnd
  ) {
    validTimeForSession = true;
  } else if (
    schedule.buoi_uong === "Trưa" &&
    newDate >= afternoonStart &&
    newDate <= afternoonEnd
  ) {
    validTimeForSession = true;
  } else if (
    schedule.buoi_uong === "Chiều" &&
    newDate >= eveningStart &&
    newDate <= eveningEnd
  ) {
    validTimeForSession = true;
  }

  if (!validTimeForSession) {
    throw new Error(
      `Thời gian ${newTime} không phù hợp với buổi ${schedule.buoi_uong}.`
    );
  }

  // Cập nhật thời gian mới cho lịch uống thuốc
  schedule.gio = newTime;
  schedule.nhac_nho = true; // Đặt nhắc nhở thành true
  await schedule.save();
  return schedule;
};

exports.updateAllMedicineScheduleByDoseTime = async (
  prescriptionID,
  doseTime,
  newTime
) => {
  // Cập nhật lại tất cả các hàng thỏa điều kiện
  const schedules = await MedicationSchedule.update(
    { gio: newTime },
    {
      where: {
        don_thuoc: prescriptionID,
        buoi_uong: doseTime,
        thoi_diem_da_uong: null,
      },
    }
  );

  return schedules;
};

exports.toggleMedicineScheduleStatus = async (scheduleID) => {
  const schedule = await MedicationSchedule.findOne({
    where: {
      id: scheduleID,
    },
  });

  if (!schedule) {
    return null;
  }

  const usedTime = schedule.thoi_diem_da_uong;
  const currentTime = new Date().getTime();

  if (usedTime) {
    schedule.thoi_diem_da_uong = null;

    await schedule.save();
    return schedule;
  }

  //Lấy thời điểm uống đã đặt từ ngay và gio
  const timeToTake = new Date(schedule.ngay + " " + schedule.gio).getTime();

  //Định dạng thời gian đã uống: 2025-03-18 15:42:33.059
  const formattedTime = new Date();
  console.log("formattedTime", formattedTime);
  schedule.thoi_diem_da_uong = formattedTime;
  await schedule.save();

  return schedule;
};

exports.getMedicineScheduleByID = async (scheduleID) => {
  const schedule = await MedicationSchedule.findOne({
    where: {
      id: scheduleID,
    },
    include: [
      {
        model: MedicineInSingleDose,
        as: "Thuoc_trong_mot_lan_uong",
        attributes: ["so_luong"],
        include: [
          {
            model: Medicine,
            as: "Thuoc",
            attributes: ["id", "ten_thuoc", "don_vi", "url", "truoc_an"],
          },
        ],
      },
      {
        model: Prescription,
        as: "Don_thuoc",
        attributes: [
          "id",
          "ngay_bat_dau",
          "ngay_ket_thuc",
          "ten_don_thuoc",
          "ghi_chu",
        ],
      },
    ],
  });

  if (!schedule) {
    throw new Error("Không tìm thấy lịch trình thuốc với ID đã cho.");
  }

  // Chuyển đổi cấu trúc dữ liệu
  const result = {
    id: schedule.id,
    gio: schedule.gio,
    ngay: schedule.ngay,
    don_thuoc: schedule.don_thuoc,
    nhac_nho: schedule.nhac_nho,
    thoi_diem_da_uong: schedule.thoi_diem_da_uong,
    buoi_uong: schedule.buoi_uong,
    Thuoc_uong: schedule.Thuoc_trong_mot_lan_uong.map((thuoc) => ({
      so_luong: thuoc.so_luong,
      id: thuoc.Thuoc.id,
      ten_thuoc: thuoc.Thuoc.ten_thuoc,
      don_vi: thuoc.Thuoc.don_vi,
      url: thuoc.Thuoc.url,
      truoc_an: thuoc.Thuoc.truoc_an,
    })),
    Don_thuoc: {
      id: schedule.Don_thuoc.id,
      ngay_bat_dau: schedule.Don_thuoc.ngay_bat_dau,
      ngay_ket_thuc: schedule.Don_thuoc.ngay_ket_thuc,
      ten_don_thuoc: schedule.Don_thuoc.ten_don_thuoc,
      ghi_chu: schedule.Don_thuoc.ghi_chu,
    },
  };

  return result;
};

/*props:
diagnosis: string,
note: string,
drID: string,
urls: string[],
deleteUrls: string[],
*/
exports.updateDiagnosis = async (appointmentID, data) => {
  console.log("data", data);
  let [thisAppointment, thisDiagnosis] = await Promise.all([
    Appointment.findOne({ where: { id: appointmentID } }),
    Diagnosis.findOne({ where: { ma_cuoc_hen: appointmentID } }),
  ]);

  if (thisAppointment.trang_thai !== "Đang chờ") {
    throw new Error("Cuộc hẹn không còn khả dụng. Vui lòng thử lại sau.");
  }

  if (!thisDiagnosis) {
    //Tạo mới dòng
    thisDiagnosis = await Diagnosis.create({
      ket_qua_chan_doan: data.diagnosis,
      ghi_chu_them: data.note,
      ma_bac_si: data.drID,
      ma_cuoc_hen: appointmentID,
    });

    //Thêm hình ảnh vào bảng ImageResult
    const imageResults = data.urls.map((url) => {
      return {
        id_ket_qua: thisDiagnosis.id,
        url: url,
      };
    });

    ImageResult.bulkCreate(imageResults);
  } else {
    //Cập nhật dòng
    thisDiagnosis.ket_qua_chan_doan = data.diagnosis;
    thisDiagnosis.ghi_chu_them = data.note;
    thisDiagnosis.save();

    //Thêm hình ảnh mới vào bảng ImageResult
    const imageResults = data.urls.map((url) => {
      return {
        id_ket_qua: thisDiagnosis.id,
        url: url,
      };
    });

    ImageResult.bulkCreate(imageResults);

    if (data.deleteUrls && data.deleteUrls.length > 0) {
      console.log(data.deleteUrls);

      // Xóa ảnh cũ ở Cloudinary
      const deletePromises = data.deleteUrls.map((url) => {
        return cloudService.deleteFile(url);
      });

      // Xóa hình ảnh cũ trong bảng ImageResult
      const deleteImageResults = data.deleteUrls.map((url) => {
        return {
          url: url,
          id_ket_qua: thisDiagnosis.id,
        };
      });

      // Thực hiện đồng thời cả hai tác vụ
      await Promise.all([
        // Xóa ảnh cũ ở Cloudinary
        Promise.all(deletePromises),

        // Xóa hình ảnh cũ trong bảng ImageResult
        ImageResult.destroy({
          where: {
            [Op.or]: deleteImageResults,
          },
        }),
      ]);
    }
  }

  return thisDiagnosis;
};

/*props:
  data: {
  appointmentID: string,
    resultID: string,
    startDate: string,
    endDate: string,
    note: string,
    name: string,
    ptID: string,
    medicines: [
      {
        medicineID: string,
        total: number,
        dose: string,
      },
    ],
  },
*/
exports.createPrescription = async (data) => {
  console.log(data);
  //Kiểm tra định dạng YYYY-MM-DD
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data.startDate) || !dateRegex.test(data.endDate)) {
    throw new Error("Ngày không hợp lệ. Vui lòng nhập lại.");
  }

  let [thisAppointment, existingPrescription] = await Promise.all([
    Appointment.findOne({ where: { id: data.appointmentID } }),
    Prescription.findOne({ where: { id_ket_qua: data.resultID } }),
  ]);

  if (thisAppointment.trang_thai !== "Đang chờ") {
    throw new Error("Cuộc hẹn không còn khả dụng. Vui lòng thử lại sau.");
  }

  if (existingPrescription) {
    // Xóa đơn thuốc cũ ở 2 bảng Prescription và PrescriptionContainsMedicine
    await PrescriptionContainsMedicine.destroy({
      where: {
        id_don_thuoc: existingPrescription.id,
      },
    });

    await Prescription.destroy({
      where: {
        id_ket_qua: data.resultID,
      },
    });
  }

  //Tạo đơn thuốc mới
  const prescription = await Prescription.create({
    id_ket_qua: data.resultID,
    ngay_bat_dau: data.startDate,
    ngay_ket_thuc: data.endDate,
    ghi_chu: data.note,
    ten_don_thuoc: data.name,
    ma_benh_nhan: data.ptID,
    trang_thai: "Đang chờ",
  });

  //Tạo đơn thuốc chứa thuốc
  const prescriptionContainsMedicines = data.medicines.map((item) => {
    return {
      id_don_thuoc: prescription.id,
      id_thuoc: item.medicineID,
      tong_so: item.total,
      buoi_uong: item.dose,
    };
  });

  PrescriptionContainsMedicine.bulkCreate(prescriptionContainsMedicines);
  return prescription;
};

exports.getMedicineList = async (limit, offset, keyword) => {
  const { count, rows } = await Medicine.findAndCountAll({
    where: {
      bi_xoa: false,
      ten_thuoc: {
        [Op.iLike]: `%${keyword}%`, // tìm gần đúng, không phân biệt hoa thường
      },
    },
    order: [["id", "ASC"]],
    limit,
    offset,
  });

  return {
    medicines: rows,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
};

exports.getMedicineByID = async (medicineID) => {
  const medicine = await Medicine.findOne({
    where: { id: medicineID },
    include: [
      {
        model: Ingredient,
        as: "Thanh_phan",
      },
    ],
  });

  if (!medicine) {
    throw new Error("Không tìm thấy thuốc với ID đã cho.");
  }

  // console.log("medicine", medicine);

  return medicine;
};

exports.deleteMedicineList = async (idList) => {
  // đổi bi_xoa thành true
  const medicines = await Medicine.update(
    { bi_xoa: true },
    {
      where: {
        id: {
          [Op.in]: idList,
        },
      },
    }
  );

  return true;
};

exports.updateMedicine = async (medicineID, medicineDetails) => {
  console.log("medicineDetails: ", medicineDetails);

  const medicine = await Medicine.findOne({
    where: {
      id: medicineID,
    },
  });

  if (!medicine) {
    throw new Error("Không tìm thấy thuốc với ID đã cho.");
  }

  if (medicineDetails.ten_thuoc) {
    const existingMedicine = await Medicine.findOne({
      where: {
        ten_thuoc: medicineDetails.ten_thuoc,
        bi_xoa: false,
        id: {
          [Op.ne]: medicineID,
        },
      },
    });

    if (existingMedicine) {
      throw new Error("Tên thuốc đã tồn tại. Vui lòng chọn tên khác.");
    }

    medicine.ten_thuoc = medicineDetails.ten_thuoc;
  }

  if (medicineDetails.don_vi) {
    medicine.don_vi = medicineDetails.don_vi;
  }

  if (medicineDetails.mo_ta) {
    medicine.mo_ta = medicineDetails.mo_ta;
  }

  if (medicineDetails.cong_dung) {
    medicine.cong_dung = medicineDetails.cong_dung;
  }

  if (medicineDetails.cach_dung) {
    medicine.cach_dung = medicineDetails.cach_dung;
  }

  if (medicineDetails.chong_chi_dinh) {
    medicine.chong_chi_dinh = medicineDetails.chong_chi_dinh;
  }

  if (medicineDetails.url) {
    medicine.url = medicineDetails.url;
  }

  if (medicineDetails.truoc_an !== null) {
    console.log("Update truoc an: ", medicineDetails.truoc_an);
    medicine.truoc_an = medicineDetails.truoc_an;
  }

  //Sửa thành phần
  if (medicineDetails.Thanh_phan && medicineDetails.Thanh_phan.length > 0) {
    //Xóa các thành phần cũ
    Ingredient.destroy({
      where: {
        thuoc_id: medicineID,
      },
    });

    //Thêm các thành phần mới
    const ingredients = medicineDetails.Thanh_phan.map((item) => {
      return {
        thuoc_id: medicineID,
        ten_thanh_phan: item.ten_thanh_phan,
        ham_luong: item.ham_luong,
      };
    });

    await Ingredient.bulkCreate(ingredients);
  }

  medicine.save();

  return medicine;
};

exports.createMedicine = async (medicineDetails) => {
  const {
    ten_thuoc,
    don_vi,
    mo_ta,
    cong_dung,
    cach_dung,
    chong_chi_dinh,
    Thanh_phan,
    url,
  } = medicineDetails;

  //Kiểm tra thiếu dữ liệu
  if (
    !ten_thuoc ||
    !don_vi ||
    !mo_ta ||
    !cong_dung ||
    !cach_dung ||
    !chong_chi_dinh
  ) {
    throw new Error("Thiếu thông tin thuốc. Vui lòng kiểm tra lại.");
  }

  if (!Thanh_phan || Thanh_phan.length === 0) {
    throw new Error("Thiếu thông tin thành phần thuốc. Vui lòng kiểm tra lại.");
  }

  const existingMedicine = await Medicine.findOne({
    where: {
      ten_thuoc: ten_thuoc,
      bi_xoa: false,
    },
  });

  if (existingMedicine) {
    throw new Error("Tên thuốc đã tồn tại. Vui lòng chọn tên khác.");
  }

  const medicine = await Medicine.create({
    ten_thuoc,
    don_vi,
    mo_ta,
    cong_dung,
    cach_dung,
    chong_chi_dinh,
    url,
  });

  //Thêm thành phần thuốc vào bảng Ingredient
  const ingredients = Thanh_phan.map((item) => {
    return {
      thuoc_id: medicine.id,
      ten_thanh_phan: item.ten_thanh_phan,
      ham_luong: item.ham_luong,
    };
  });
  await Ingredient.bulkCreate(ingredients);

  return medicine;
};

exports.getDiagnosisDetailByAppointmentID = async (appointmentID) => {
  console.log("getDiagnosisDetailByAppointmentID: ", appointmentID);
  const diagnosis = await Diagnosis.findOne({
    where: {
      ma_cuoc_hen: appointmentID,
    },
    include: [
      {
        model: Prescription,
        as: "Don_thuoc",
        attributes: {
          exclude: ["id_ket_qua", "trang_thai"],
        },
        include: [
          {
            model: PrescriptionContainsMedicine,
            as: "Don_chua_thuoc",
            attributes: ["tong_so", "buoi_uong"],
            include: [
              {
                model: Medicine,
                as: "Thuoc",
                attributes: ["id", "ten_thuoc", "don_vi"],
              },
            ],
          },
        ],
      },
      {
        model: ImageResult,
        as: "Hinh_anh_ket_qua",
        attributes: ["url"],
      },
    ],
  });

  console.log("diagnosis", diagnosis);

  if (!diagnosis) {
    return null;
  }

  return diagnosis;
};

// Helper for push notification
exports.updatePushState = async (medicineScheduleIds, newState) => {
  await MedicationSchedule.update(
    { nhac_nho: newState },
    {
      where: {
        id: {
          [Op.in]: medicineScheduleIds,
        },
      },
    }
  );
  return true;
};

exports.getDiagnosisFromOther = async (ptID) => {
  const result = await sequelize.query(
    `select * from lay_ket_qua_cua_benh_nhan(?)`,
    {
      replacements: [ptID],
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return result;
};

exports.getDiagnosisByPatientName = async (name) => {
  const result = await sequelize.query(
    `SELECT * FROM lay_ket_qua_theo_ten_benh_nhan(?)`,
    {
      replacements: [name],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return result;
};

exports.getDiagnosisByDoctorID = async (doctorID) => {
  const result = await sequelize.query(
    `SELECT * FROM lay_ket_qua_cua_bac_si(?)`,
    {
      replacements: [doctorID],
      type: sequelize.QueryTypes.SELECT,
    }
  );
  return result;
};

exports.getIsShared = async (appID) => {
  const query = `
    SELECT
      CASE
        WHEN bn.chia_se_kq_cho_tat_ca = TRUE AND bs.chia_se_kq_cho_tat_ca = TRUE THEN
          CASE
            WHEN c.an_kq IS NULL THEN TRUE
            WHEN c.an_kq = FALSE THEN TRUE
            ELSE FALSE
          END
        ELSE FALSE
      END AS duoc_chia_se
    FROM "Cuoc_hen" ch
    JOIN "Benh_nhan" bn ON ch.ma_benh_nhan_dat_hen = bn.ma_benh_nhan
    JOIN "Bac_si" bs ON ch.ma_bac_si = bs.ma_bac_si
    LEFT JOIN "Chi_dinh_an_kq_cua_bac_si" c
      ON c.ma_benh_nhan = bn.ma_benh_nhan AND c.ma_bac_si = bs.ma_bac_si
    WHERE ch.id = :appID
    LIMIT 1
  `;

  const [results] = await sequelize.query(query, {
    replacements: { appID },
    type: sequelize.QueryTypes.SELECT,
  });

  return {
    duoc_chia_se: results?.duoc_chia_se ?? false,
  };
};

exports.getPatientsByDoctorID = async (drID) => {
  const result = await ConfidentialDoctor.findAll({
    where: {
      ma_bac_si: drID,
    },
    attributes: ["an_kq"],
    include: {
      model: Patient,
      as: "Benh_nhan",
      attributes: ["ma_benh_nhan"],
      include: {
        model: User,
        as: "Nguoi_dung",
        attributes: ["ho_va_ten", "avt_url"],
      },
    },
    order: [["ma_benh_nhan", "DESC"]],
  });

  // Flat result to desired structure
  const flatResult = result.map((item) => ({
    ma_benh_nhan: item.Benh_nhan?.ma_benh_nhan,
    ho_va_ten: item.Benh_nhan?.Nguoi_dung?.ho_va_ten,
    avt_url: item.Benh_nhan?.Nguoi_dung?.avt_url,
    an_kq: item.an_kq,
  }));

  return flatResult;
};

exports.getHiddenState = async (drID, ptID) => {
  const result = await ConfidentialDoctor.findOne({
    where: {
      ma_bac_si: drID,
      ma_benh_nhan: ptID,
    },
  });

  return result;
};

exports.updateHiddenState = async (drID, ptID, newState) => {
  console.log("updateHiddenState", drID, ptID, newState);
  const result = await ConfidentialDoctor.update(
    { an_kq: newState },
    {
      where: {
        ma_bac_si: drID,
        ma_benh_nhan: ptID,
      },
    }
  );

  return result;
};

exports.updateHiddenStateByName = async (doctorID, patientName, newState) => {

  const patient = await Patient.findOne({
    include: {
      model: User,
      as: "Nguoi_dung",
      where: {
        ho_va_ten: {
          [Op.iLike]: `%${patientName}%`,
        },
      },
      attributes: [],
    },
  });

  if (!patient) throw new Error("Không tìm thấy bệnh nhân với tên tương ứng");

  // ✅ Cập nhật trạng thái ẩn kết quả
  const result = await ConfidentialDoctor.update(
    { an_kq: newState },
    {
      where: {
        ma_bac_si: doctorID,
        ma_benh_nhan: patient.ma_benh_nhan,
      },
    }
  );
  const message = newState
  ? "Cập nhật trạng thái ẩn chia sẻ kết quả thành công"
  : "Cập nhật trạng thái mở chia sẻ kết quả thành công";
  return {
    message,
    affectedRows: result[0],
  };
};

exports.updateShareAllForDoctor = async (drID, newState) => {
  console.log("updateShareAllForDoctor", drID, newState);
  const result = await Doctor.update(
    { chia_se_kq_cho_tat_ca: newState },
    {
      where: {
        ma_bac_si: drID,
      },
    }
  );

  return result;
};

exports.updateShareAllForPatient = async (ptID, newState) => {
  const result = await Patient.update(
    { chia_se_kq_cho_tat_ca: newState },
    {
      where: {
        ma_benh_nhan: ptID,
      },
    }
  );

  return result;
};

exports.getShareAllForPatient = async (ptID) => {
  const result = await Patient.findOne({
    where: {
      ma_benh_nhan: ptID,
    },
  });

  return result;
};

exports.getShareAllForDoctor = async (drID) => {
  const result = await Doctor.findOne({
    where: {
      ma_bac_si: drID,
    },
  });
  return result;
};
