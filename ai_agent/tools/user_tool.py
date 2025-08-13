# appointment_tools.py

def book_appointment(doctor_name: str, time: str, reason: str, method: str) -> str:
    return (
        f"✅ Đã đặt lịch khám với bác sĩ {doctor_name} "
        f"vào {time} để {reason}, hình thức {method}."
    )

def cancel_appointment(doctor_name: str, time: str) -> str:
    return f"Đã hủy lịch khám với bác sĩ {doctor_name} lúc {time} thành công."

def get_doctor_info(doctor_name: str) -> str:
    return f"Thông tin chi tiết về bác sĩ {doctor_name}. [Mock]"

def add_love_list(doctor_name: str) -> str:
    return f"Đã thêm bác sĩ {doctor_name} vào danh sách yêu thích của bạn."

def delete_love_list(doctor_name: str) -> str:
    return f"Đã xóa bác sĩ {doctor_name} khỏi danh sách yêu thích của bạn."

def get_love_list() -> str:
    return "Danh sách bác sĩ yêu thích của bạn: [giả lập - chưa có dữ liệu thật]."

def add_relative(relative_name: str, role: str) -> str:
    return f"Đã thêm {relative_name} với vai trò {role} vào danh sách người thân của bạn."

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

def update_profile(full_name: str = None, phone: str = None, email: str = None,
                   date_of_birth: str = None, gender: str = None, address: str = None,
                   nationality: str = None, ethnicity: str = None, id_number: str = None) -> str:
    return "✅ Hồ sơ cá nhân đã được cập nhật thành công."


def get_all_specializations():
    """
    Mock: trả về danh sách TẤT CẢ chuyên khoa trên hệ thống.
    """
    chuyen_khoa = [
        "Nội tổng quát",
        "Ngoại tổng quát",
        "Tim mạch",
        "Hô hấp",
        "Tiêu hóa",
        "Nội tiết",
        "Thần kinh",
        "Cơ xương khớp",
        "Da liễu",
        "Mắt",
        "Tai Mũi Họng",
        "Răng Hàm Mặt",
        "Phụ sản",
        "Nhi",
        "Tiết niệu",
        "Nam học",
        "Huyết học",
        "Dị ứng - Miễn dịch",
        "Ung bướu",
        "Thận - Lọc máu",
        "Thấp khớp",
        "Tâm thần",
        "Phục hồi chức năng",
        "Vật lý trị liệu",
        "Chấn thương chỉnh hình",
        "Thần kinh cột sống",
        "Chẩn đoán hình ảnh",
        "Xét nghiệm",
        "Dinh dưỡng",
        "Y học cổ truyền",
        "Y học gia đình",
        "Hồi sức - Cấp cứu",
        "Nội soi",
        "Đau mạn tính",
        "Sức khỏe sinh sản",
        "Sức khỏe người cao tuổi"
    ]

    return {
        "TongSoChuyenKhoa": len(chuyen_khoa),
        "DanhSachChuyenKhoa": chuyen_khoa
    }

def get_medicine_schedule_relative(role: str) -> str:
    return f"✅ Lịch uống thuốc của {role}: [giả lập - chưa có dữ liệu thật]."

def get_diagnosis_result_relative(role: str) -> str:
    return f"✅ Kết quả khám bệnh của {role}: [giả lập - chưa có dữ liệu thật]."

def update_role_relative(relative_name: str, new_role: str) -> str:
    return f"✅ Đã cập nhật vai trò của {relative_name} thành {new_role}."

def get_appointment_done() -> str:
    return "✅ Danh sách các cuộc hẹn đã hoàn thành: [giả lập - chưa có dữ liệu thật]."

def get_appointment_undone() -> str:
    return "✅ Danh sách các cuộc hẹn chưa diễn ra: [giả lập - chưa có dữ liệu thật]."

def get_appointment_canceled() -> str:
    return "✅ Danh sách các cuộc hẹn đã bị hủy: [giả lập - chưa có dữ liệu thật]."

def turn_on_sharing_diagnosis_result() -> str:
    return "✅ Đã bật chia sẻ kết quả khám bệnh."

def turn_off_sharing_diagnosis_result() -> str:
    return "✅ Đã tắt chia sẻ kết quả khám bệnh."

def update_medical_profile(medical_history: str = None, blood_type: str = None,
                            health_insurance_id: str = None, registered_hospital: str = None,
                            issue_date: str = None, expiry_date: str = None) -> str:
    return "✅ Thông tin y tế đã được cập nhật thành công."

def rate_appointment(doctor_name: str, time: str, rating: int, comment: str = None) -> str:
    return f"✅ Đã đánh giá {rating} sao cho cuộc hẹn với bác sĩ {doctor_name} vào {time}."








