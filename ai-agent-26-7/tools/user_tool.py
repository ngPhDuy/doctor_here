# appointment_tools.py
from tools.mock_data import doctor_db

def book_appointment(doctor_name: str, time: str, reason: str = "") -> str:
    return f"Đã đặt lịch khám với bác sĩ {doctor_name} lúc {time} thành công."

def cancel_appointment(doctor_name: str, time: str) -> str:
    return f"Đã hủy lịch khám với bác sĩ {doctor_name} lúc {time} thành công."

def get_doctor_info(doctor_name: str) -> str:
    info = doctor_db.get(doctor_name)
    if info:
        return (
            f"👩‍⚕️ Thông tin bác sĩ {info['name']}\n"
            f"- Tuổi: {info['age']}\n"
            f"- Giới tính: {info['gender']}\n"
            f"- Chuyên khoa: {info['specialty']}\n"
            f"- Kinh nghiệm: {info['experience']} năm\n"
            f"- Bệnh viện: {info['hospital']}\n"
            f"- Địa chỉ: {info['address']}"
        )
    else:
        return f"⚠️ Không tìm thấy thông tin về bác sĩ {doctor_name}."

def add_love_list(doctor_name: str) -> str:
    return f"Đã thêm bác sĩ {doctor_name} vào danh sách yêu thích của bạn."

def delete_love_list(doctor_name: str) -> str:
    return f"Đã xóa bác sĩ {doctor_name} khỏi danh sách yêu thích của bạn."

def get_love_list() -> str:
    return "Danh sách bác sĩ yêu thích của bạn: [giả lập - chưa có dữ liệu thật]."

def add_relative(relative_name: str) -> str:
    return f"Đã thêm {relative_name} vào danh sách người thân."

def delete_relative(relative_name: str) -> str:
    return f"Đã xóa {relative_name} khỏi danh sách người thân."

def get_relatives() -> str:
    return "Danh sách người thân: [giả lập - chưa có dữ liệu thật]."

def connect_to_chat(doctor_name: str) -> str:
    return f"Đã kết nối trò chuyện với bác sĩ {doctor_name}."

def create_reminder(medicine_name: str, time: str, dosage: str = "") -> str:
    return f"Đã tạo nhắc nhở uống thuốc {medicine_name} lúc {time}. Liều lượng: {dosage or 'Không có'}."

def get_all_diagnosis_results() -> str:
    return "Tất cả kết quả chẩn đoán của bạn: [giả lập - chưa có dữ liệu thật]."

def get_appointment_by_time(time: str) -> str:
    return f"Thông tin cuộc hẹn tại thời gian {time}: [giả lập - chưa có dữ liệu thật]."

def get_appointment() -> str:
    return "Danh sách tất cả các cuộc hẹn của bạn: [giả lập - chưa có dữ liệu thật]."

def get_detail_appointment(doctor_name: str, time: str) -> str:
    return f"Chi tiết cuộc hẹn với bác sĩ {doctor_name} lúc {time}: [giả lập - chưa có dữ liệu thật]."

def get_detail_diagnosis_patient(doctor_name: str, time: str) -> str:
    return f"Kết quả chẩn đoán của bạn sau khi khám với bác sĩ {doctor_name} lúc {time}: [giả lập - chưa có dữ liệu thật]."

def get_doctor_list() -> str:
    return "Danh sách tất cả bác sĩ: [giả lập - chưa có dữ liệu thật]."

def get_doctor_specialization(specialization: str) -> str:
    return f"Danh sách bác sĩ chuyên ngành {specialization}: [giả lập - chưa có dữ liệu thật]."

def get_medicine_schedule() -> str:
    return "Lịch uống thuốc của bạn: [giả lập - chưa có dữ liệu thật]."

def get_medicine(medicine_name: str) -> str:
    return f"Thông tin về thuốc {medicine_name}: [giả lập - chưa có dữ liệu thật]."

def get_upcoming_appointments() -> str:
    return "Danh sách các cuộc hẹn sắp tới: [giả lập - chưa có dữ liệu thật]."

def medical_advice(symptoms: str) -> str:
    return f"Dựa trên triệu chứng bạn cung cấp ({symptoms}), bạn nên đến gặp bác sĩ để kiểm tra chi tiết hơn."

def update_profile(username: str = None, email: str = None, phone_number: str = None,
                   date_of_birth: str = None, full_name: str = None) -> str:
    updated = []
    if username:
        updated.append(f"username = {username}")
    if email:
        updated.append(f"email = {email}")
    if phone_number:
        updated.append(f"phone_number = {phone_number}")
    if date_of_birth:
        updated.append(f"date_of_birth = {date_of_birth}")
    if full_name:
        updated.append(f"full_name = {full_name}")

    if not updated:
        return "update_profile: bạn chưa cung cấp thông tin nào để cập nhật. [giả lập - chưa có lưu thật]"

    return "update_profile: đã cập nhật " + ", ".join(updated) + " [giả lập - chưa có lưu thật]"

