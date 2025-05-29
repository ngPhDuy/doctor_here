const { Sequelize } = require("sequelize");
const defineAccount = require("./account.model");
const defineUser = require("./user.model");
const defineDoctor = require("./doctor.model");
const defineAdmin = require("./admin.model");
const definePatient = require("./patient.model");
const defineUpdateRequest = require("./updateRequest.model");
const defineWeeklyWork = require("./weeklyWork.model");
const defineTimeslot = require("./timeslot.model");
const defineDiagnosis = require("./diagnosis.model");
const defineAppointment = require("./appointment.model");
const defineCall = require("./call.model");
const defineCallNoti = require("./callNoti.model");
const defineConversation = require("./conversation.model");
const defineMessage = require("./message.model");
const defineMessageNoti = require("./messageNoti.model");
const defineDailyStep = require("./dailyStep.model");
const defineBMI = require("./bmi.model");
const defineHeartBeat = require("./heartBeat.model");
const defineBreathBeat = require("./breathBeat.model");
const defineRequestHandle = require("./requestHandle.model");
const defineLoveList = require("./loveList.model");
const defineRating = require("./rating.model");
const defineComment = require("./comment.model");
const defineDoctorSpecialization = require("./doctorSpecialization.model");
// const defineOldSpecializationRequest = require('./oldSpecializationRequest.model');
// const defineNewSpecializationRequest = require('./newSpecializationRequest.model');
const defineImageAppointment = require("./imageAppointment.model");
const defineImageResult = require("./imageResult.model");
const definePrescription = require("./prescription.model");
const defineMedicine = require("./medicine.model");
const definePrescriptionContainsMedicine = require("./prescriptionContainsMedicine.model");
const defineMedicationSchedule = require("./medicationSchedule.model");
// const defineTimeslotAppointment = require('./timeslotAppointment.model');
const defineMedicineInSingleDose = require("./medicineInSingleDose.model");
const defineInsurance = require("./insurance.model");
const defineImageRequest = require("./imageRequest.model");
const defineRelatives = require("./relatives.model");
const defineSpecialization = require("./specialization.model");
const defineBloodPressure = require("./bloodPressure.model");
const defineSugarBlood = require("./sugarBlood.model");
const defineOxygenBlood = require("./oxygenBlood.model");
const defineBodyTemperature = require("./bodyTemperature.model");
const defineIngredient = require("./ingredient.model");
const defineNotificationToken = require("./notificationToken.model");
const defineDistance = require("./distance.model");
const defineHeight = require("./height.model");
const defineWeight = require("./weight.model");
const defineConfidentialDoctor = require("./confidentialDoctor.model");

require("dotenv").config();
//Kết nối đến neon.tech
const sequelize = new Sequelize({
  dialect: "postgres",
  timezone: process.env.DB_TIMEZONE, // Lấy timezone từ .env
  host: process.env.DB_HOST, // Lấy host từ .env
  database: process.env.DB_NAME, // Lấy tên database từ .env
  username: process.env.DB_USERNAME, // Lấy username từ .env
  password: process.env.DB_PASSWORD, // Lấy password từ .env
  port: process.env.DB_PORT, // Lấy port từ .env
  dialectModule: require("pg"),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

//Kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the Neon database has been established successfully."
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

// Định nghĩa model Account
const Account = defineAccount(sequelize);
const User = defineUser(sequelize);
const Doctor = defineDoctor(sequelize);
const Admin = defineAdmin(sequelize);
const Patient = definePatient(sequelize);
const UpdateRequest = defineUpdateRequest(sequelize);
const WeeklyWork = defineWeeklyWork(sequelize);
const Timeslot = defineTimeslot(sequelize);
const Diagnosis = defineDiagnosis(sequelize);
const Appointment = defineAppointment(sequelize);
const Call = defineCall(sequelize);
const CallNoti = defineCallNoti(sequelize);
const Conversation = defineConversation(sequelize);
const Message = defineMessage(sequelize);
const MessageNoti = defineMessageNoti(sequelize);
const DailyStep = defineDailyStep(sequelize);
const BMI = defineBMI(sequelize);
const HeartBeat = defineHeartBeat(sequelize);
const BreathBeat = defineBreathBeat(sequelize);
const RequestHandle = defineRequestHandle(sequelize);
const LoveList = defineLoveList(sequelize);
const Rating = defineRating(sequelize);
const Comment = defineComment(sequelize);
const DoctorSpecialization = defineDoctorSpecialization(sequelize);
const Height = defineHeight(sequelize);
const Weight = defineWeight(sequelize);
// const OldSpecializationRequest = defineOldSpecializationRequest(sequelize);
// const NewSpecializationRequest = defineNewSpecializationRequest(sequelize);
const ImageAppointment = defineImageAppointment(sequelize);
const ImageResult = defineImageResult(sequelize);
const Prescription = definePrescription(sequelize);
const Medicine = defineMedicine(sequelize);
const PrescriptionContainsMedicine =
  definePrescriptionContainsMedicine(sequelize);
const MedicationSchedule = defineMedicationSchedule(sequelize);
// const TimeslotAppointment = defineTimeslotAppointment(sequelize);
const MedicineInSingleDose = defineMedicineInSingleDose(sequelize);
const Insurance = defineInsurance(sequelize);
const ImageRequest = defineImageRequest(sequelize);
const Relatives = defineRelatives(sequelize);
const Specialization = defineSpecialization(sequelize);
const BloodPressure = defineBloodPressure(sequelize);
const SugarBlood = defineSugarBlood(sequelize);
const OxygenBlood = defineOxygenBlood(sequelize);
const BodyTemperature = defineBodyTemperature(sequelize);
const Ingredient = defineIngredient(sequelize);
const NotificationToken = defineNotificationToken(sequelize);
const Distance = defineDistance(sequelize);
const ConfidentialDoctor = defineConfidentialDoctor(sequelize);
// Định nghĩa mối quan hệ giữa các model
User.belongsTo(Account, {
  foreignKey: "ten_dang_nhap",
  as: "Tai_khoan",
});

Admin.belongsTo(User, {
  foreignKey: "id",
  as: "Nguoi_dung",
});

Doctor.belongsTo(User, {
  foreignKey: "id",
  as: "Nguoi_dung",
});

Doctor.hasMany(Appointment, {
  foreignKey: "ma_bac_si",
  sourceKey: "ma_bac_si",
  as: "Cuoc_hen",
});

Doctor.hasMany(Rating, {
  foreignKey: "ma_bac_si",
  sourceKey: "ma_bac_si",
  as: "Danh_gia",
});

Patient.belongsTo(User, {
  foreignKey: "id",
  as: "Nguoi_dung",
});

UpdateRequest.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  targetKey: "ma_bac_si",
  as: "Bac_si",
});

WeeklyWork.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  as: "Bac_si",
});

WeeklyWork.hasMany(Timeslot, {
  foreignKey: "id_ca_lam_viec",
  sourceKey: "id",
  as: "Gio_hen",
});

Timeslot.belongsTo(WeeklyWork, {
  foreignKey: "id_ca_lam_viec",
  targetKey: "id",
  as: "Ca_lam_viec_trong_tuan",
});

Appointment.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan_dat_hen",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Appointment.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  targetKey: "ma_bac_si",
  as: "Bac_si",
});

Appointment.belongsTo(Timeslot, {
  foreignKey: "id_gio_hen",
  as: "Gio_hen",
});

Appointment.hasOne(Rating, {
  foreignKey: "id_cuoc_hen",
  sourceKey: "id",
  as: "Danh_gia",
});

Appointment.hasOne(Diagnosis, {
  foreignKey: "ma_cuoc_hen",
  sourceKey: "id",
  as: "Ket_qua_kham_benh",
});

Diagnosis.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  targetKey: "ma_bac_si",
  as: "Bac_si",
});

Diagnosis.belongsTo(Appointment, {
  foreignKey: "ma_cuoc_hen",
  targetKey: "id",
  as: "Cuoc_hen",
});

Diagnosis.hasMany(ImageResult, {
  foreignKey: "id_ket_qua",
  sourceKey: "id",
  as: "Hinh_anh_ket_qua",
});

Diagnosis.hasOne(Prescription, {
  foreignKey: "id_ket_qua",
  sourceKey: "id",
  as: "Don_thuoc",
});

ImageResult.belongsTo(Diagnosis, {
  foreignKey: "id_ket_qua",
  targetKey: "id",
  as: "Ket_qua_kham_benh",
});

Call.belongsTo(Appointment, {
  foreignKey: "id_cuoc_hen",
  as: "Cuoc_hen",
});

CallNoti.belongsTo(Call, {
  foreignKey: "cuoc_goi",
  as: "Cuoc_goi",
});

Conversation.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  targetKey: "ma_bac_si",
  as: "Bac_si",
});

Conversation.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Conversation.hasMany(Message, {
  foreignKey: "cuoc_hoi_thoai",
  sourceKey: "id",
  as: "Tin_nhan",
});

Message.belongsTo(Conversation, {
  foreignKey: "cuoc_hoi_thoai",
  targetKey: "id",
  as: "Cuoc_hoi_thoai",
});

MessageNoti.belongsTo(Message, {
  foreignKey: "id_tin_nhan",
  as: "Tin_nhan",
});

//Các chỉ số sức khỏe

DailyStep.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

BMI.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

HeartBeat.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

BreathBeat.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

BloodPressure.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

SugarBlood.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

OxygenBlood.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

BodyTemperature.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Distance.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Height.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Weight.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

//Liên kết Bệnh nhân với Chỉ số sức khỏe
Patient.hasMany(DailyStep, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "So_buoc_di_trong_ngay",
});

Patient.hasMany(BMI, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "BMI",
});

Patient.hasMany(HeartBeat, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Nhip_tim",
});

Patient.hasMany(BreathBeat, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Nhip_tho",
});

Patient.hasMany(BloodPressure, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Huyet_ap",
});

Patient.hasMany(SugarBlood, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Duong_huyet",
});

Patient.hasMany(OxygenBlood, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Oxy_mau",
});

Patient.hasMany(BodyTemperature, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Than_nhiet",
});

Patient.hasMany(Distance, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Khoang_cach",
});

Patient.hasMany(Height, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Chieu_cao",
});

Patient.hasMany(Weight, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Can_nang",
});

RequestHandle.belongsTo(UpdateRequest, {
  foreignKey: "yeu_cau_cap_nhat",
  targetKey: "ma_yeu_cau",
  as: "Yeu_cau_cap_nhat_thong_tin",
});

RequestHandle.belongsTo(Admin, {
  foreignKey: "ma_qtv",
  targetKey: "ma_qtv",
  as: "Quan_tri_vien",
});

LoveList.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

LoveList.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  targetKey: "ma_bac_si",
  as: "Bac_si",
});

Rating.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan_danh_gia",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Rating.belongsTo(Appointment, {
  foreignKey: "id_cuoc_hen",
  as: "Cuoc_hen",
});

Rating.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  targetKey: "ma_bac_si",
  as: "Bac_si",
});

Rating.hasMany(Comment, {
  foreignKey: "id_danh_gia",
  sourceKey: "id",
  as: "Binh_luan",
});

Comment.belongsTo(Doctor, {
  foreignKey: "ma_bac_si_binh_luan",
  as: "Bac_si",
});

Comment.belongsTo(Rating, {
  foreignKey: "id_danh_gia",
  as: "Danh_gia",
});

DoctorSpecialization.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  as: "Bac_si",
});

// OldSpecializationRequest.belongsTo(UpdateRequest, {
//   foreignKey: 'ma_yeu_cau',
//   as: 'Yeu_cau_cap_nhat_thong_tin',
// });

// NewSpecializationRequest.belongsTo(UpdateRequest, {
//   foreignKey: 'ma_yeu_cau',
//   as: 'Yeu_cau_cap_nhat_thong_tin',
// });

ImageAppointment.belongsTo(Appointment, {
  foreignKey: "id_cuoc_hen",
  as: "Cuoc_hen",
});

Appointment.hasMany(ImageAppointment, {
  foreignKey: "id_cuoc_hen",
  sourceKey: "id",
  as: "Hinh_anh_bo_sung_cuoc_hen",
});

Prescription.belongsTo(Appointment, {
  foreignKey: "id_ket_qua",
  as: "Ket_qua_kham_benh",
});

Prescription.hasMany(PrescriptionContainsMedicine, {
  foreignKey: "id_don_thuoc",
  sourceKey: "id",
  as: "Don_chua_thuoc",
});

Prescription.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Prescription.hasMany(MedicationSchedule, {
  foreignKey: "don_thuoc",
  sourceKey: "id",
  as: "Lan_uong",
});

PrescriptionContainsMedicine.belongsTo(Prescription, {
  foreignKey: "id_don_thuoc",
  targetKey: "id",
  as: "Don_thuoc",
});

PrescriptionContainsMedicine.belongsTo(Medicine, {
  foreignKey: "id_thuoc",
  as: "Thuoc",
});

MedicationSchedule.belongsTo(Prescription, {
  foreignKey: "don_thuoc",
  targetKey: "id",
  as: "Don_thuoc",
});

MedicationSchedule.hasMany(MedicineInSingleDose, {
  foreignKey: "id_lan_uong",
  sourceKey: "id",
  as: "Thuoc_trong_mot_lan_uong",
});

MedicineInSingleDose.belongsTo(MedicationSchedule, {
  foreignKey: "id_lan_uong",
  targetKey: "id",
  as: "Lan_uong",
});

MedicineInSingleDose.belongsTo(Medicine, {
  foreignKey: "thuoc",
  as: "Thuoc",
});

Medicine.hasMany(Ingredient, {
  foreignKey: "thuoc_id",
  sourceKey: "id",
  as: "Thanh_phan",
});

Ingredient.belongsTo(Medicine, {
  foreignKey: "thuoc_id",
  targetKey: "id",
  as: "Thuoc",
});

// TimeslotAppointment.belongsTo(Timeslot, {
//   foreignKey: 'id_gio_hen',
//   as: 'Gio_hen',
// });

// TimeslotAppointment.belongsTo(Appointment, {
//   foreignKey: 'id_cuoc_hen',
//   as: 'Cuoc_hen',
// });

Insurance.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Patient.hasOne(Insurance, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Bao_hiem_y_te",
});

Patient.hasMany(Relatives, {
  foreignKey: "ma_benh_nhan_1",
  sourceKey: "ma_benh_nhan",
  as: "Nguoi_than_1",
});

Patient.hasMany(Relatives, {
  foreignKey: "ma_benh_nhan_2",
  sourceKey: "ma_benh_nhan",
  as: "Nguoi_than_2",
});

Patient.hasMany(Prescription, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Don_thuoc",
});

ImageRequest.belongsTo(UpdateRequest, {
  foreignKey: "ma_yeu_cau",
  targetKey: "ma_yeu_cau",
  as: "Yeu_cau_cap_nhat_thong_tin",
});

UpdateRequest.hasMany(ImageRequest, {
  foreignKey: "ma_yeu_cau", // Khóa ngoại trong bảng ImageRequest
  sourceKey: "ma_yeu_cau", // Khóa chính trong bảng UpdateRequest
  as: "Anh_minh_chung", // Alias sử dụng trong include
});

UpdateRequest.hasOne(RequestHandle, {
  foreignKey: "yeu_cau_cap_nhat",
  sourceKey: "ma_yeu_cau",
  as: "Duyet_yeu_cau_cap_nhat",
});

// UpdateRequest.hasMany(OldSpecializationRequest, {
//   foreignKey: 'ma_yeu_cau',  // Khóa ngoại trong bảng OldSpecializationRequest
//   sourceKey: 'ma_yeu_cau',   // Khóa chính trong bảng UpdateRequest
//   as: 'Chuyen_khoa_cu'       // Alias sử dụng trong include
// });

// UpdateRequest.hasMany(NewSpecializationRequest, {
//   foreignKey: 'ma_yeu_cau',  // Khóa ngoại trong bảng NewSpecializationRequest
//   sourceKey: 'ma_yeu_cau',   // Khóa chính trong bảng UpdateRequest
//   as: 'Chuyen_khoa_moi'      // Alias sử dụng trong include
// });

Relatives.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan_1",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan_1",
});

Relatives.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan_2",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan_2",
});

NotificationToken.belongsTo(User, {
  foreignKey: "id_nguoi_dung",
  targetKey: "id",
  as: "Nguoi_dung",
});

User.hasMany(NotificationToken, {
  foreignKey: "id_nguoi_dung",
  sourceKey: "id",
  as: "Token_thong_bao",
});

User.hasOne(Patient, {
  foreignKey: "id",
  sourceKey: "id",
  as: "Benh_nhan",
});

ConfidentialDoctor.belongsTo(Doctor, {
  foreignKey: "ma_bac_si",
  targetKey: "ma_bac_si",
  as: "Bac_si",
});

ConfidentialDoctor.belongsTo(Patient, {
  foreignKey: "ma_benh_nhan",
  targetKey: "ma_benh_nhan",
  as: "Benh_nhan",
});

Patient.hasMany(ConfidentialDoctor, {
  foreignKey: "ma_benh_nhan",
  sourceKey: "ma_benh_nhan",
  as: "Chi_dinh_an_kq_cua_bac_si",
});

Doctor.hasMany(ConfidentialDoctor, {
  foreignKey: "ma_bac_si",
  sourceKey: "ma_bac_si",
  as: "Chi_dinh_an_kq_cua_bac_si",
});

module.exports = {
  sequelize,
  NotificationToken,
  Account,
  User,
  Doctor,
  Admin,
  Patient,
  UpdateRequest,
  WeeklyWork,
  Timeslot,
  Diagnosis,
  Appointment,
  Call,
  CallNoti,
  Conversation,
  Message,
  MessageNoti,
  DailyStep,
  BMI,
  HeartBeat,
  BreathBeat,
  BloodPressure,
  SugarBlood,
  BodyTemperature,
  Distance,
  Height,
  Weight,
  OxygenBlood,
  RequestHandle,
  LoveList,
  Rating,
  Comment,
  DoctorSpecialization,
  ImageAppointment,
  ImageResult,
  Prescription,
  Medicine,
  PrescriptionContainsMedicine,
  MedicationSchedule,
  MedicineInSingleDose,
  Insurance,
  ImageRequest,
  Relatives,
  Specialization,
  Ingredient,
  ConfidentialDoctor,
};
