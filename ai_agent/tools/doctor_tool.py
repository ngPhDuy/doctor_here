
def add_work_schedule(weekday: str, start_time: str, end_time: str, work_type: str) -> str:
    return f"✅ Đã thêm lịch làm việc vào {weekday}, từ {start_time} đến {end_time}, hình thức {work_type.lower()}."

def delete_work_schedule(weekday: str, start_time: str, end_time: str) -> str:
    return f"🗑️ Đã xóa lịch làm việc vào {weekday}, từ {start_time} đến {end_time}."

def get_work_schedule() -> str:
    return "📅 Lịch làm việc của bạn gồm: [Mock data: \n- Thứ Hai: 08:00 - 12:00 (trực tiếp)\n- Thứ Ba: 14:00 - 17:00 (trực tuyến)]"

def get_all_patient_by_doctor() -> str:
    return "👩‍⚕️ Danh sách bệnh nhân bạn đã từng khám gồm: [Mock data]"

def get_appointment_history_by_patient(patient_name: str) -> str:
    return f"📖 Lịch sử cuộc hẹn với bệnh nhân {patient_name} gồm: [Mock data]"

def get_diagnosis_done() -> str:
    return "✅ Danh sách các buổi khám đã xử lý gồm: [Mock data]"

def get_diagnosis_undone() -> str:
    return "⚠️ Các buổi khám chưa gửi kết quả:\n- [Mock data]"

def get_patient_info_by_doctor(patient_name: str) -> str:
    return f"🧾 Thông tin bệnh nhân {patient_name}: [Mock data]"

def turn_on_sharing_status_patient(patient_name: str) -> str:
    return f"🔓 Đã bật chia sẻ kết quả khám cho bệnh nhân {patient_name}."

def turn_off_sharing_status_patient(patient_name: str) -> str:
    return f"🔒 Đã tắt chia sẻ kết quả khám cho bệnh nhân {patient_name}."

def connect_to_chat(patient_name: str) -> str:
    return f"🔗 Đã kết nối trò chuyện với bệnh nhân {patient_name}."

def get_all_diagnosis_results() -> str:
    return "📋 Hiển thị tất cả kết quả khám bệnh của bạn. [Mock data]"

def get_all_reviews() -> str:
    return "⭐ Hiển thị tất cả đánh giá của bệnh nhân dành cho bạn."

def get_appointment_by_time(start_time: str, end_time: str) -> str:
    return f"📅 Chi tiết cuộc hẹn từ {start_time} đến {end_time} được hiển thị dưới đây."

def get_appointment() -> str:
    return "📑 Danh sách toàn bộ cuộc hẹn của bạn."

def get_detail_appointment(patient_name: str, time: str) -> str:
    return f"📌 Chi tiết cuộc hẹn với bệnh nhân {patient_name} vào {time}: [Mock chi tiết]."

def get_detail_diagnosis_patient(patient_name: str, time: str) -> str:
    return f"🩺 Kết quả chẩn đoán chi tiết của bệnh nhân {patient_name} vào {time} sẽ được hiển thị dưới đây."

def get_review_by_patient(patient_name: str) -> str:
    return f"📝 Các đánh giá của bệnh nhân {patient_name} về bạn sẽ được hiển thị."

def get_review_statistics() -> str:
    return "📊 Bạn có tổng cộng 35 lượt đánh giá, điểm trung bình là 4.8."

def get_upcoming_appointment() -> str:
    return "⏰ Danh sách các cuộc hẹn sắp tới của bạn được hiển thị dưới đây."

def update_profile(
    email: str = None,
    full_name: str = None,
    phone_number: str = None,
    gender: str = None,
    date_of_birth: str = None,
    start_date: str = None,
    degree: str = None,
    description: str = None,
    clinic_address: str = None,
    specialization: str = None,
) -> str:
    return (
        f"✅ Hồ sơ đã cập nhật:\n"
        f"- Email: {email}\n"
        f"- Họ và tên: {full_name}\n"
        f"- Số điện thoại: {phone_number}\n"
        f"- Giới tính: {gender}\n"
        f"- Ngày sinh: {date_of_birth}\n"
        f"- Ngày vào nghề: {start_date}\n"
        f"- Trình độ học vấn: {degree}\n"
        f"- Chuyên khoa: {specialization}\n"
        f"- Địa chỉ phòng khám: {clinic_address}\n"
        f"- Mô tả: {description}\n"
    )


def upload_diagnosis_result(patient_name: str, exam_time: str, diagnosis: str, medicine_name: str = None, dosage: str =None, usage_time: str =None, note:str =None) -> str:
    result = f"📤 Gửi kết quả khám cho bệnh nhân {patient_name} lúc {exam_time}: {diagnosis}."
    if medicine_name:
        result += f" Đơn thuốc: {medicine_name}, liều lượng {dosage}, thời gian uống {usage_time}."
    if note:
        result += f" Ghi chú: {note}."
    return result

def get_appointment_canceled() -> str:
    return "Danh sách các cuộc hẹn đã bị hủy của bạn: [giả lập - chưa có dữ liệu thật]."

def get_appointment_done() -> str:
    return "Danh sách các cuộc hẹn đã hoàn thành của bạn: [giả lập - chưa có dữ liệu thật]."

def get_appointment_undone() -> str:
    return "Danh sách các cuộc hẹn chưa hoàn thành của bạn: [giả lập - chưa có dữ liệu thật]."

def get_diagnosis_done() -> str:
    return "Danh sách kết quả khám bệnh đã xử lý và gửi lên hệ thống của bạn: [giả lập - chưa có dữ liệu thật]."

def get_diagnosis_undone() -> str:
    return "Danh sách kết quả khám bệnh chưa được bạn xử lý: [giả lập - chưa có dữ liệu thật]."

def get_diagnosis_patient_by_all(patient_name: str) -> str:
    return f"Tất cả kết quả khám bệnh của bệnh nhân {patient_name}, bao gồm từ các bác sĩ khác: [giả lập - chưa có dữ liệu thật]."

def get_medicine_by_condition(disease_name: str, target_user: str, caution: str) -> str:
    return (
        f"Thuốc điều trị {disease_name} phù hợp cho {target_user} "
        f"với lưu ý đặc biệt '{caution}': [giả lập - chưa có dữ liệu thật]."
    )

def update_work_schedule(week_day: str, start_time: str, end_time: str, work_type: str) -> str:
    return (
        f"Đã cập nhật lịch làm việc ngày {week_day}, từ {start_time} đến {end_time}, "
        f"theo hình thức {work_type}."
    )

def get_patient_shared_info(patient_name: str = None) -> str:
    if patient_name:
        return f"📄 Danh sách bệnh nhân cho phép chia sẻ kết quả khám (lọc theo '{patient_name}'): [giả lập - chưa có dữ liệu thật]."
    return "📄 Danh sách tất cả bệnh nhân cho phép chia sẻ kết quả khám: [giả lập - chưa có dữ liệu thật]."
