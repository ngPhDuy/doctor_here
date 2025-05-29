const { Relatives, sequelize, Patient, User } = require("../models");
const { Op } = require("sequelize");

exports.createRelative = async (ptDI, phone, relationship) => {
  // Tìm ptID từ số điện thoại
  const patient = await User.findOne({
    where: {
      sdt: phone,
    },
    include: [
      {
        model: Patient,
        as: "Benh_nhan",
        attributes: ["ma_benh_nhan"],
      },
    ],
  });

  if (!patient) {
    throw new Error("Không tìm thấy bệnh nhân với số điện thoại này");
  }

  const patientId1 = ptDI; // ID của bệnh nhân hiện tại
  const patientId2 = patient.Benh_nhan.ma_benh_nhan; // ID của bệnh nhân từ số điện thoại

  // Kiểm tra xem đã có mối quan hệ này chưa
  const existingRelationship = await Relatives.findOne({
    where: {
      [Op.or]: [
        {
          ma_benh_nhan_1: patientId1,
          ma_benh_nhan_2: patientId2,
        },
        {
          ma_benh_nhan_1: patientId2,
          ma_benh_nhan_2: patientId1,
        },
      ],
    },
  });

  if (existingRelationship) {
    throw new Error("Mối quan hệ đã có sẵn");
  }

  const relative = new Relatives({
    ma_benh_nhan_1: patientId1,
    ma_benh_nhan_2: patientId2,
    than_phan: relationship,
    da_xac_nhan: false,
  });

  try {
    await relative.save();
    return relative;
  } catch (error) {
    throw new Error(error);
  }
};

exports.getAllRelatives = async (patientID) => {
  try {
    console.log(patientID); // Kiểm tra kiểu dữ liệu của patientID

    const query = await sequelize.query(
      `
        SELECT nd.*, nt."than_phan", bn."ma_benh_nhan" AS "ma_benh_nhan_2"
        FROM "Nguoi_than" nt
        JOIN "Benh_nhan" bn
          ON bn."ma_benh_nhan" = CASE
                                    WHEN nt."ma_benh_nhan_1" = :patientID THEN nt."ma_benh_nhan_2"
                                    ELSE nt."ma_benh_nhan_1"
                                 END
        JOIN "Nguoi_dung" nd ON nd."id" = bn."id"
        WHERE :patientID IN (nt."ma_benh_nhan_1", nt."ma_benh_nhan_2")
          AND nt."da_xac_nhan" = true;
   `,
      {
        replacements: { patientID },
        type: sequelize.QueryTypes.SELECT,
      }
    );
    return query;
  } catch (error) {
    throw new Error(error);
  }
};

exports.changeRoleRelative = async (
  patientId1,
  patientId2,
  newRelationship
) => {
  if (patientId1 === patientId2) {
    throw new Error("Không thể thay đổi mối quan hệ với chính mình");
  }

  const relative = await Relatives.findOne({
    where: {
      [Op.or]: [
        {
          ma_benh_nhan_1: patientId1,
          ma_benh_nhan_2: patientId2,
        },
        {
          ma_benh_nhan_1: patientId2,
          ma_benh_nhan_2: patientId1,
        },
      ],
    },
  });

  if (!relative) {
    throw new Error("Không tìm thấy mối quan hệ này");
  }

  try {
    relative.than_phan = newRelationship;
    await relative.save();
    return relative;
  } catch (error) {
    throw new Error(error);
  }
};

exports.confirmRelative = async (patientId1, patientId2) => {
  if (patientId1 === patientId2) {
    throw new Error("Không thể xác nhận mối quan hệ với chính mình");
  }

  const relative = await Relatives.findOne({
    where: {
      [Op.or]: [
        {
          ma_benh_nhan_1: patientId1,
          ma_benh_nhan_2: patientId2,
        },
        {
          ma_benh_nhan_1: patientId2,
          ma_benh_nhan_2: patientId1,
        },
      ],
    },
  });

  if (!relative) {
    throw new Error("Không tìm thấy mối quan hệ này");
  }

  try {
    relative.da_xac_nhan = true;
    await relative.save();
    return relative;
  } catch (error) {
    throw new Error(error);
  }
};

//ptID1 là người gửi, ptID2 là người nhận
exports.getPendingRelatives = async (ptID) => {
  const pendingRelatives = await Relatives.findAll({
    where: {
      ma_benh_nhan_2: ptID,
      da_xac_nhan: false,
    },
    attributes: {
      exclude: ["da_xac_nhan", "ma_benh_nhan_2"],
    },
    include: [
      {
        model: Patient,
        as: "Benh_nhan_1",
        include: [
          {
            model: User,
            as: "Nguoi_dung",
            attributes: ["ho_va_ten", "sdt", "avt_url"],
          },
        ],
        attributes: ["id"],
      },
    ],
    nest: true, // Thêm tham số này để cấu trúc nested objects
    raw: false, // Đảm bảo trả về instances thay vì plain objects
  });

  return pendingRelatives.map((relative) => {
    const plainRelative = relative.get({ plain: true });

    // Tạo đối tượng mới với cấu trúc mong muốn
    return {
      than_phan: plainRelative.than_phan,
      ma_benh_nhan_1: plainRelative.ma_benh_nhan_1,
      ho_va_ten: plainRelative.Benh_nhan_1?.Nguoi_dung?.ho_va_ten || null,
      sdt: plainRelative.Benh_nhan_1?.Nguoi_dung?.sdt || null,
      avt_url: plainRelative.Benh_nhan_1?.Nguoi_dung?.avt_url || null,
    };
  });
};

exports.deleteRelative = async (ptID1, ptID2) => {
  const relative = await Relatives.findOne({
    where: {
      [Op.or]: [
        {
          ma_benh_nhan_1: ptID1,
          ma_benh_nhan_2: ptID2,
        },
        {
          ma_benh_nhan_1: ptID2,
          ma_benh_nhan_2: ptID1,
        },
      ],
    },
  });

  if (!relative) {
    throw new Error("Không tìm thấy mối quan hệ này");
  }

  try {
    await relative.destroy();
    return { message: "Xóa mối quan hệ thành công" };
  } catch (error) {
    throw new Error(error);
  }
};
