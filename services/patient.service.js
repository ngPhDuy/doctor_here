const {
  Patient,
  User,
  Doctor,
  Appointment,
  sequelize,
  Account,
  Insurance,
} = require("../models");

exports.getAllPatient = async () => {
  const patient = await Patient.findAll({
    include: {
      model: User,
      as: "Nguoi_dung",
      attributes: {
        exclude: ["id"],
      },
      include: {
        model: Account,
        as: "Tai_khoan",
        attributes: {
          exclude: ["mat_khau"],
        },
      },
    },
    order: [["ma_benh_nhan", "ASC"]],
  });
  return patient;
};

exports.getPatientInfo = async (patientID) => {
  const patient = await Patient.findOne({
    where: {
      ma_benh_nhan: patientID,
    },
    include: [
      {
        model: User,
        as: "Nguoi_dung",
        attributes: {
          exclude: ["id"],
        },
        include: {
          model: Account,
          as: "Tai_khoan",
          attributes: {
            exclude: ["mat_khau"],
          },
        },
      },
      {
        model: Insurance,
        as: "Bao_hiem_y_te",
        attributes: {
          exclude: ["ma_benh_nhan"],
        },
      },
    ],
  });
  return patient;
};

exports.getAllByDoctorID = async (doctorID) => {
  const query = sequelize.query(
    `select distinct nd.*, bn.*, bh.*
        from "Benh_nhan" bn join "Nguoi_dung" nd on bn."id" = nd.id 
        join "Cuoc_hen" ch on bn."ma_benh_nhan" = ch."ma_benh_nhan_dat_hen"
        join "Bao_hiem_y_te" bh on bn."ma_benh_nhan" = bh."ma_benh_nhan"
        where ch."ma_bac_si" = :doctorID
        order by bn."ma_benh_nhan" asc;`,
    {
      replacements: { doctorID },
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return query;
};
