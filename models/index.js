const { Sequelize } = require('sequelize');
const defineAccount = require('./account.model');
const defineUser = require('./user.model');
const defineDoctor = require('./doctor.model');
const defineAdmin = require('./admin.model');
const definePatient = require('./patient.model');
const defineUpdateRequest = require('./updateRequest.model');
const defineWeeklyWork = require('./weeklyWork.model');
const defineTimeslot = require('./timeslot.model');
const defineDiagnosis = require('./diagnosis.model');
const defineAppointment = require('./appointment.model');
const defineCall = require('./call.model');
const defineCallNoti = require('./callNoti.model');
const defineConversation = require('./conversation.model');
const defineMessage = require('./message.model');
const defineMessageNoti = require('./messageNoti.model');
const defineDailyStep = require('./dailyStep.model');
const defineBMI = require('./bmi.model');
const defineHeartBeat = require('./heartBeat.model');
const defineBreathBeat = require('./breathBeat.model');
const defineRequestHandle = require('./requestHandle.model');
const defineLoveList = require('./lovelist.model');
const defineRating = require('./rating.model');
const defineComment = require('./comment.model');
const defineDoctorSpecialization = require('./doctorSpecialization.model');
// const defineOldSpecializationRequest = require('./oldSpecializationRequest.model');
// const defineNewSpecializationRequest = require('./newSpecializationRequest.model');
const defineImageAppointment = require('./imageAppointment.model');
const defineImageResult = require('./imageResult.model');
const definePrescription = require('./prescription.model');
const defineMedicine = require('./medicine.model');
const definePrescriptionContainsMedicine = require('./prescriptionContainsMedicine.model');
const defineMedicationSchedule = require('./medicationSchedule.model');
// const defineTimeslotAppointment = require('./timeslotAppointment.model');
const defineMedicineInSingleDose = require('./medicineInSingleDose.model');
const defineInsurance = require('./insurance.model');
const defineImageRequest = require('./imageRequest.model');
const defineRelatives = require('./relatives.model');

//Kết nối đến neon.tech
const sequelize = new Sequelize({
  dialect: 'postgres',
  timezone: "+07:00", // Múi giờ Việt Nam (GMT+7),
  host: "ep-jolly-art-a1redfmo-pooler.ap-southeast-1.aws.neon.tech",
  database: 'neondb', // Tên database bạn đã tạo trên Neon
  username: 'neondb_owner', // Thường là 'postgres'
  password: 'npg_j6MbW5nxetcZ', // Mật khẩu của bạn
  port: 5432, // Port mặc định của PostgreSQL
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

//Kết nối
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the Neon database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
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
// const OldSpecializationRequest = defineOldSpecializationRequest(sequelize);
// const NewSpecializationRequest = defineNewSpecializationRequest(sequelize);
const ImageAppointment = defineImageAppointment(sequelize);
const ImageResult = defineImageResult(sequelize);
const Prescription = definePrescription(sequelize);
const Medicine = defineMedicine(sequelize);
const PrescriptionContainsMedicine = definePrescriptionContainsMedicine(sequelize);
const MedicationSchedule = defineMedicationSchedule(sequelize);
// const TimeslotAppointment = defineTimeslotAppointment(sequelize);
const MedicineInSingleDose = defineMedicineInSingleDose(sequelize);
const Insurance = defineInsurance(sequelize);
const ImageRequest = defineImageRequest(sequelize);
const Relatives = defineRelatives(sequelize);

// Định nghĩa mối quan hệ giữa các model
User.belongsTo(Account, {
  foreignKey: 'ten_dang_nhap',
  as: 'Tai_khoan',
});

Admin.belongsTo(User, {
  foreignKey: 'id',
  as: 'Nguoi_dung',
});

Doctor.belongsTo(User, {
  foreignKey: 'id',
  as: 'Nguoi_dung',
});

Patient.belongsTo(User, {
  foreignKey: 'id',
  as: 'Nguoi_dung',
});

UpdateRequest.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si',
  targetKey: 'ma_bac_si',
  as: 'Bac_si',
});

WeeklyWork.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si',
  as: 'Bac_si',
});

Timeslot.belongsTo(WeeklyWork, {
  foreignKey: 'id_ca_lam_viec',
  as: 'Ca_lam_viec_trong_tuan',
});

Diagnosis.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si',
  as: 'Bac_si',
});

Diagnosis.belongsTo(Appointment, {
  foreignKey: 'ma_cuoc_hen',
  as: 'Cuoc_hen',
});

Appointment.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan_dat_hen',
  targetKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

Appointment.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si',
  targetKey: 'ma_bac_si',
  as: 'Bac_si',
});

Appointment.belongsTo(Timeslot, {
  foreignKey: 'id_gio_hen',
  as: 'Gio_hen',
});

Call.belongsTo(Appointment, {
  foreignKey: 'id_cuoc_hen',
  as: 'Cuoc_hen',
});

CallNoti.belongsTo(Call, {
  foreignKey: 'cuoc_goi',
  as: 'Cuoc_goi',
});

Conversation.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si',
  as: 'Bac_si',
});

Conversation.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

Message.belongsTo(Conversation, {
  foreignKey: 'cuoc_hoi_thoai',
  as: 'Cuoc_hoi_thoai',
});

MessageNoti.belongsTo(Message, {
  foreignKey: 'id_tin_nhan',
  as: 'Tin_nhan',
});

DailyStep.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

BMI.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

HeartBeat.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

BreathBeat.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

RequestHandle.belongsTo(UpdateRequest, {
  foreignKey: 'yeu_cau_cap_nhat',
  targetKey: 'ma_yeu_cau',
  as: 'Yeu_cau_cap_nhat_thong_tin',
});

RequestHandle.belongsTo(Admin, {
  foreignKey: 'ma_qtv',
  targetKey: 'ma_qtv',
  as: 'Quan_tri_vien',
});

LoveList.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

LoveList.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si',
  as: 'Bac_si',
});

Rating.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan_danh_gia',
  targetKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

Rating.belongsTo(Appointment, {
  foreignKey: 'id_cuoc_hen',
  as: 'Cuoc_hen',
});

Comment.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si_binh_luan',
  as: 'Bac_si',
});

Comment.belongsTo(Rating, {
  foreignKey: 'id_danh_gia',
  as: 'Danh_gia',
});

DoctorSpecialization.belongsTo(Doctor, {
  foreignKey: 'ma_bac_si',
  as: 'Bac_si',
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
  foreignKey: 'id_cuoc_hen',
  as: 'Cuoc_hen',
});

ImageResult.belongsTo(ImageAppointment, {
  foreignKey: 'id_ket_qua',
  as: 'Ket_qua_kham_benh',
});

Prescription.belongsTo(Appointment, {
  foreignKey: 'id_ket_qua',
  as: 'Ket_qua_kham_benh',
});

PrescriptionContainsMedicine.belongsTo(Prescription, {
  foreignKey: 'id_don_thuoc',
  as: 'Don_thuoc',
});

PrescriptionContainsMedicine.belongsTo(Medicine, {
  foreignKey: 'id_thuoc',
  as: 'Thuoc',
});

MedicationSchedule.belongsTo(Prescription, {
  foreignKey: 'don_thuoc',
  as: 'Don_thuoc',
});

MedicineInSingleDose.belongsTo(MedicationSchedule, {
  foreignKey: ['gio', 'ngay', 'don_thuoc'], 
  as: 'Lan_uong',
});

MedicineInSingleDose.belongsTo(Medicine, {
  foreignKey: 'thuoc',
  as: 'Thuoc',
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
  foreignKey: 'ma_benh_nhan',
  as: 'Benh_nhan',
});

ImageRequest.belongsTo(UpdateRequest, {
  foreignKey: 'ma_yeu_cau',
  targetKey: 'ma_yeu_cau',
  as: 'Yeu_cau_cap_nhat_thong_tin',
});

UpdateRequest.hasMany(ImageRequest, {
  foreignKey: 'ma_yeu_cau',  // Khóa ngoại trong bảng ImageRequest
  sourceKey: 'ma_yeu_cau',   // Khóa chính trong bảng UpdateRequest
  as: 'Anh_minh_chung'       // Alias sử dụng trong include
});

UpdateRequest.hasOne(RequestHandle, {
  foreignKey: 'yeu_cau_cap_nhat',
  sourceKey: 'ma_yeu_cau',
  as: 'Duyet_yeu_cau_cap_nhat',
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
  foreignKey: 'ma_benh_nhan_1',
  as: 'Benh_nhan_1',
});

Relatives.belongsTo(Patient, {
  foreignKey: 'ma_benh_nhan_2',
  as: 'Benh_nhan_2',
});

module.exports = { sequelize, Account, User, Doctor, Admin, Patient, UpdateRequest, WeeklyWork, Timeslot, Diagnosis, Appointment, Call, CallNoti, Conversation, Message, MessageNoti, DailyStep, BMI, HeartBeat, BreathBeat, RequestHandle, LoveList, Rating, Comment, DoctorSpecialization, ImageAppointment, ImageResult, Prescription, Medicine, PrescriptionContainsMedicine, MedicationSchedule, MedicineInSingleDose, Insurance, ImageRequest, Relatives };