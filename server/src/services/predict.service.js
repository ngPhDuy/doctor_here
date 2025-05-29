const { Patient, User } = require("../models");
const trackerService = require("./tracker.service");

require("dotenv").config();

/*
data:
{
  "gender": "Female",              // Giới tính: "Male", "Female", "Other"
  "age": 80,                       // Tuổi (số nguyên)
  "hypertension": 1,              // Tăng huyết áp: 0 (Không), 1 (Có)
  "heart_disease": 1,             // Bệnh tim: 0 (Không), 1 (Có)
  "smoking_history": "current",     // Tiền sử hút thuốc: "never", "former", "current", "ever", "not current", "No Info"--
  "bmi": 80,                    // BMI (float)
  "HbA1c_level": 6.6,--              // Chỉ số HbA1c (float)
  "blood_glucose_level": 140     // Đường huyết (int hoặc float)
}
*/
exports.predictDiabetes = async (ptID, data) => {
  //Lấy ngày hôm nay, định dạng YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);

  const [patientData, bloodSugarData] = await Promise.all([
    Patient.findOne({
      where: { ma_benh_nhan: ptID },
      attributes: ["tien_su_benh", "chieu_cao", "can_nang"],
      include: [
        {
          model: User,
          as: "Nguoi_dung",
          attributes: ["ngay_sinh", "gioi_tinh"],
        },
      ],
    }),
    trackerService.getDailyBloodSugar(ptID, today, today),
  ]);

  console.log("patientData", patientData["tien_su_benh"]);
  console.log("bloodSugarData", bloodSugarData);

  if (!patientData || !bloodSugarData) {
    throw new Error("Không tìm thấy dữ liệu của bệnh nhân");
  }

  if (bloodSugarData.length === 0) {
    throw new Error("Không tìm thấy dữ liệu đường huyết trong ngày hôm nay");
  }

  let hasDiabetes = false;
  let hasHypertension = false;
  let hasHeartDisease = false;

  if (patientData["tien_su_benh"]) {
    // Lowerstring và tách patientData["tien_su_benh"] ra mảng
    const tienSuBenh = patientData["tien_su_benh"].toLowerCase().split(",");
    // Kiểm tra có phần tử nào chứa chuỗi 'tiểu đường' hay không
    hasDiabetes = tienSuBenh.some((item) => item.includes("tiểu đường"));

    if (hasDiabetes) {
      return 1.0;
    }

    // Kiểm tra có phần tử nào chứa chuỗi 'cao huyết áp' hay không
    hasHypertension = tienSuBenh.some((item) => item.includes("cao huyết áp"));

    // Kiểm tra có phần tử nào chứa chuỗi 'bệnh tim' hay không
    hasHeartDisease = tienSuBenh.some(
      (item) =>
        item.includes("động mạch vành") ||
        item.includes("suy tim") ||
        item.includes("rối loạn nhịp tim") ||
        item.includes("van tim") ||
        item.includes("cơ tim")
    );
  }

  if (patientData["can_nang"] === null || patientData["chieu_cao"] === null) {
    throw new Error("Thiếu dữ liệu cân nặng, chiều cao.");
  }

  const bmi =
    patientData["can_nang"] /
    ((patientData["chieu_cao"] / 100) * (patientData["chieu_cao"] / 100));

  if (patientData["Nguoi_dung"]["ngay_sinh"] === null) {
    throw new Error("Thiếu dữ liệu ngày sinh.");
  }

  const age =
    new Date().getFullYear() -
    new Date(patientData["Nguoi_dung"]["ngay_sinh"]).getFullYear();

  const bodyReq = {
    gender:
      patientData["Nguoi_dung"]["gioi_tinh"] === "Nam" ? "Male" : "Female",
    age: age,
    hypertension: hasHypertension ? 1 : 0,
    heart_disease: hasHeartDisease ? 1 : 0,
    smoking_history: data["smoking_history"],
    bmi: bmi,
    HbA1c_level: data["HbA1c_level"],
    blood_glucose_level: bloodSugarData[0]
      ? bloodSugarData[0].trung_binh_duong_huyet
      : null,
  };

  console.log(bodyReq);

  const response = await fetch(
    `${process.env.AI_SERVICE_URL}/predict/diabetes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyReq),
    }
  );
  const result = await response.json();

  return result.prediction;
};
