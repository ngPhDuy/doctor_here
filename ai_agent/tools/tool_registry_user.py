from tools.user_tool import (
    book_appointment,
    cancel_appointment,
    get_doctor_info,
    add_love_list,
    delete_love_list,
    get_love_list,
    add_relative,
    delete_relative,
    get_relatives,
    connect_to_chat,
    create_reminder,
    get_all_diagnosis_results,
    get_appointment_by_time,
    get_appointment,
    get_detail_appointment,
    get_detail_diagnosis_patient,
    get_doctor_list,
    get_doctor_specialization,
    get_medicine_schedule,
    get_medicine,
    get_upcoming_appointments,
    update_profile,
    get_all_specializations,
    get_medicine_schedule_relative,
    get_diagnosis_result_relative,
    update_role_relative,
    get_appointment_done,
    get_appointment_undone,
    get_appointment_canceled,
    turn_on_sharing_diagnosis_result,
    turn_off_sharing_diagnosis_result,
    rate_appointment,
    update_medical_profile
)


TOOL_REGISTRY_USER = {
    "add_love_list": {
        "name": "add_love_list",
        "description": "Thêm bác sĩ cụ thể vào danh sách bác sĩ yêu thích của người dùng",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"}
            },
            "required": ["doctor_name"]
        },
        "function": add_love_list,
        "example": "Thêm bác sĩ Nguyễn Văn Khánh vào danh sách bác sĩ yêu thích của tôi",
        "json": {
            "function:": "add_love_list",
            "args": {
                "doctor_name": "Nguyễn Văn Khánh"
            }
        }
    },
    "add_relative": {
        "name": "add_relative",
        "description": "Thêm người dùng khác vào danh sách người thân, gia đình của người dùng",
        "parameters": {
            "type": "object",
            "properties": {
                "relative_name": {"type": "string", "description": "Họ và tên đầy đủ của người thân"},
                "role": {"type": "string", "description": "Vai trò trong gia đình, ví dụ: Chồng, Vợ, Con trai, Con gái, Ông, Bà, Anh, Chị, Em"}
            },
            "required": ["relative_name", "role"]
        },
        "function": add_relative,
        "example": "Thêm người thân của tôi là Nguyễn Văn B, vai trò là Anh.",
        "json": {
            "function": "add_relative",
            "args": {
                "relative_name": "Nguyễn Văn B",
                "role": "Anh"
            }
        }
    },
    "book_appointment": {
        "name": "book_appointment",
        "description": "Đặt lịch hẹn khám với bác sĩ cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"},
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
                "reason": {"type": "string", "description": "Lý do khám hoặc triệu chứng"},
                "method": {"type": "string", "description": "Hình thức khám, ví dụ: 'Trực tiếp' hoặc 'Trực tuyến'"}
            },
            "required": ["doctor_name", "time", "reason", "method"]
        },
        "function": book_appointment,
        "example": "Đặt lịch khám cho tôi với bác sĩ Nguyễn Văn Hùng vào lúc 7 giờ 30 sáng 26/5/2025 để khám đau đầu, hình thức Trực tiếp",
        "json": {
            "function": "book_appointment",
            "args": {
                "doctor_name": "Nguyễn Văn Hùng",
                "time": "2025-05-26T07:30:00",
                "reason": "Khám đau đầu",
                "method": "Trực tiếp"
            }
        }
    },
    "cancel_appointment": {
        "name": "cancel_appointment",
        "description": "Hủy lịch hẹn khám với bác sĩ cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"},
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
            },
            "required": ["doctor_name", "time"]
        },
        "function": cancel_appointment,
        "json": {
            "function": "cancel_appointment",
            "args": {
                "doctor_name": "An",
                "time": "2025-06-28T08:00:00"
            }
        }
    },
    "connect_to_chat": {
        "name": "connect_to_chat",
        "description": "Kết nối trò chuyện với một bác sĩ cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"}
            },
            "required": ["doctor_name"]
        },
        "function": connect_to_chat,
        "example": "Kết nối trò chuyện với bác sĩ Võ Tấn Tài",
        "json": {
            "function":"connect_to_chat",
            "args": {
                "doctor_name": "Võ Tấn Tài"
            }
        }
    },
    "create_reminder": {
        "name": "create_reminder",
        "description": "Tạo lịch nhắc nhở uống thuốc cho người dùng",
        "parameters": {
            "type": "object",
            "properties": {
                "medicine_name": {"type": "string"},
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
                # "dosage": {"type": "string"}
            },
            "required": ["medicine_name", "time"]
        },
        "function": create_reminder,
        "example": "Nhắc tôi uống thuốc Paracetamol 500mg vào lúc 10 giờ tối ngày 25/6",
        "json": {
            "function": "create_reminder",
            "args": {
                "medicine_name": "Paracetamol 500mg",
                "time": "2025-06-25T22:00:00"
            }
        }
    },
    "delete_love_list": {
        "name": "delete_love_list",
        "description": "Xóa bác sĩ cụ thể khỏi danh sách bác sĩ yêu thích của người dùng",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"}
            },
            "required": ["doctor_name"]
        },
        "function": delete_love_list,
        "example": "Xóa bác sĩ Võ Tấn Tài khỏi danh sách bác sĩ yêu thích của tôi",
        "json": {
            "function": "delete_love_list",
            "args": {
                "doctor_name": "Võ Tấn Tài"
            }
        }
        
    },
    "delete_relative": {
        "name": "delete_relative",
        "description": "Xóa người thân khỏi danh sách người thân, gia đình của người dùng",
        "parameters": {
            "type": "object",
            "properties": {
                "relative_name": {"type": "string"}
            },
            "required": ["relative_name"]
        },
        "function": delete_relative,
        "example": "Xóa Nguyễn Quang Minh khỏi danh sách người thân của tôi",
        "json": {
            "function": "delete_relative",
            "args": {
                "doctor_name": "Nguyễn Quang Minh"
            }
        }
    },
    "get_all_diagnosis_results": {
        "name": "get_all_diagnosis_results",
        "description": "Lấy danh sách tất cả kết quả chẩn đoán của người dùng",
        "parameters": {"type": "object", "properties": {}},
        "required": [],
        "function": get_all_diagnosis_results,
        "example": "Lấy danh sách tất cả kết quả khám bệnh của tôi",
        "json": {
            "function": "get_all_diagnosis_results",
            "args": {}
        }
    },
    "get_appointment_by_time": {
        "name": "get_appointment_by_time",
        "description": "Lấy thông tin các cuộc hẹn nằm trong khoảng thời gian được chỉ định",
        "parameters": {
            "type": "object",
            "properties": {
                "start_time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Thời gian bắt đầu tìm kiếm, định dạng ISO 8601 (ví dụ: '2025-06-25T14:00:00')"
                },
                "end_time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Thời gian kết thúc tìm kiếm, định dạng ISO 8601 (ví dụ: '2025-06-25T15:00:00')"
                }
            },
            "required": ["start_time", "end_time"]
        },
        "function": get_appointment_by_time,
        "example": "Tìm tất cả cuộc hẹn từ 14 giờ đến 15 giờ ngày 25 tháng 6 năm 2025",
        "json": {
            "function": "get_appointment_by_time",
            "args": {
                "start_time": "2025-06-25T14:00:00",
                "end_time": "2025-06-25T15:00:00"
            }
        }
    },
    "get_appointment": {
        "name": "get_appointment",
        "description": "Lấy thông tin danh sách tất cả các cuộc hẹn của người dùng",
        "parameters": {"type": "object", "properties": {}},
        "required": [],
        "function": get_appointment,
        "example": "Cho tôi xem tất cả các cuộc hẹn đã đặt",
        "json": {
            "function": "get_appointment",
            "args": {}
        }
    },
    "get_detail_appointment": {
        "name": "get_detail_appointment",
        "description": "Lấy thông tin chi tiết về một cuộc hẹn với một bác sĩ cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"},
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
            },
            "required": ["doctor_name", "time"]
        },
        "function": get_detail_appointment,
        "example": "Hiển thị chi tiết lịch hẹn với bác sĩ Lê Trung Hiếu vào lúc 14 giờ 30 ngày 25 tháng 6 năm 2025",
        "json": {
            "function": "get_detail_appointment",
            "args": {
                "doctor_name": "Lê Trung Hiếu",
                "time": "2025-06-25T14:30:00"
            }
        }
    },
    "get_detail_diagnosis_patient": {
        "name": "get_detail_diagnosis_patient",
        "description": "Lấy thông tin chi tiết về kết quả chẩn đoán bệnh sau buổi khám cụ thể với bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"},
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
            },
            "required": ["doctor_name", "time"]
        },
        "function": get_detail_diagnosis_patient,
        "example": "Tôi muốn xem kết quả chẩn đoán sau khi khám với bác sĩ Võ Tấn Tài lúc 14 giờ 30 ngày 25 tháng 6 năm 2025",
        "json": {
            "function": "get_detail_diagnosis_patient",
            "args": {
                "doctor_name": "Võ Tấn Tài",
                "time": "2025-06-25T14:30:00"
            }
        }
    },
    "get_doctor_info": {
        "name": "get_doctor_info",
        "description": "Lấy thông tin chi tiết về một bác sĩ cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_name": {"type": "string"}
            },
            "required": ["doctor_name"]
        },
        "function": get_doctor_info,
        "example": "Tôi muốn xem thông tin của bác sĩ Nguyễn Văn An",
        "json": {
            "function": "get_doctor_info",
            "args": {
                "doctor_name": "Nguyễn Văn An"
            }
        }
    },
    "get_doctor_list": {
        "name": "get_doctor_list",
        "description": "Lấy thông tin chi tiết danh sách tất cả bác sĩ",
        "parameters": {"type": "object", "properties": {}},
        "required": [],
        "function": get_doctor_list,
        "example": "Hiển thị danh sách tất cả bác sĩ trong hệ thống",
        "json": {
            "function": "get_doctor_list",
            "args": {}
        }
    },
    "get_doctor_specialization": {
        "name": "get_doctor_specialization",
        "description": "Lấy thông tin chi tiết danh sách các bác sĩ dựa trên chuyên ngành của bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {
                "specialization": {"type": "string"}
            },
            "required": ["specialization"]
        },
        "function": get_doctor_specialization,
        "example": "Cho tôi xem danh sách các bác sĩ chuyên khoa nội tổng hợp",
        "json": {
            "function": "get_doctor_specialization",
            "args": {
                "specialization": "Nội tổng hợp"
            }
        }
    },
    "get_love_list": {
        "name": "get_love_list",
        "description": "Lấy thông tin danh sách bác sĩ yêu thích của người dùng",
        "parameters": {"type": "object", "properties": {}},
        "required": [],
        "function": get_love_list,
        "example": "Cho tôi xem danh sách bác sĩ tôi đã đánh dấu yêu thích",
        "json": {
            "function": "get_love_list",
            "args": {}
        }
    },
    "get_medicine_schedule": {
        "name": "get_medicine_schedule",
        "description": "Lấy thông tin về lịch uống thuốc của người dùng",
        "parameters": {"type": "object", "properties": {}},
        "required": [],
        "function": get_medicine_schedule,
        "example": "Tôi muốn xem lịch uống thuốc hôm nay của mình",
        "json": {
            "function": "get_medicine_schedule",
            "args": {}
        }
    },
    "get_medicine": {
        "name": "get_medicine",
        "description": "Lấy thông tin chi tiết về một loại thuốc cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "medicine_name": {"type": "string"}
            },
            "required": ["medicine_name"]
        },
        "function": get_medicine,
        "example": "Cho tôi biết thông tin thuốc Panadol",
        "json": {
            "function": "get_medicine",
            "args": {
                "medicine_name": "Panadol"
            }
        }
    },
    "get_relatives": {
        "name": "get_relatives",
        "description": "Lấy thông tin danh sách người thân, gia đình của người dùng",
        "parameters": {"type": "object", "properties": {}},
        "required": [],
        "function": get_relatives,
        "example": "Hiển thị danh sách người thân của tôi trong hệ thống",
        "json": {
            "function": "get_relatives",
            "args": {}
        }
    },
    "get_upcoming_appointments": {
        "name": "get_upcoming_appointments",
        "description": "Lấy thông tin về các lịch hẹn khám sắp tới, chưa diễn ra của người dùng",
        "parameters": {"type": "object", "properties": {}},
        "required": [],
        "function": get_upcoming_appointments,
        "example": "Cho tôi biết các lịch khám sắp tới",
        "json": {
            "function": "get_upcoming_appointments",
            "args": {}
        }
    },
    "update_profile": {
        "name": "update_profile",
        "description": "Cập nhật thông tin hồ sơ người dùng bao gồm username, email, số điện thoại, ngày sinh hoặc họ tên",
        "parameters": {
            "type": "object",
            "properties": {
                "username": { "type": "string" },
                "email": { "type": "string" },
                "phone_number": { "type": "string" },
                "date_of_birth": { "type": "string", "format": "date" },
                "full_name": { "type": "string" }
            }
        },
        "function": update_profile,
        "example": "Cập nhật thông tin cá nhân của tôi: email là nguyenvana@gmail.com, số điện thoại 0909123456 và ngày sinh 01/01/2000",
        "json": {
            "function": "update_profile",
            "args": {
                "email": "nguyenvana@gmail.com",
                "phone_number": "0909123456",
                "date_of_birth": "2000-01-01"
            }
        }
    },
    "get_all_specializations": {
        "name": "get_all_specializations",
        "description": "Lấy tất cả danh sách chuyên khoa hiện có trên hệ thống",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "required": [],
        "function": get_all_specializations,
            "example": "Cho tôi danh sách tất cả các chuyên khoa hiện có",
            "json": {
                "function": "get_all_specializations",
                "args": {}
            }
    },
    "get_medicine_schedule_relative": {
        "name": "get_medicine_schedule_relative",
        "description": "Lấy lịch uống thuốc của một thành viên trong gia đình theo vai trò",
        "parameters": {
            "type": "object",
            "properties": {
            "role": {
                "type": "string",
                "description": "Vai trò của thành viên trong gia đình",
                "enum": ["Chồng", "Vợ", "Con trai", "Con gái", "Ông", "Bà", "Anh", "Chị", "Em"]
            }
            },
            "required": ["role"]
        },
        "function": get_medicine_schedule_relative,
            "example": "Xem lịch uống thuốc của mẹ/vợ tôi.",
            "json": {
                "function": "get_medicine_schedule_relative",
                "args": {
                "role": "Vợ"
            }
        }
    },
    "get_diagnosis_result_relative": {
        "name": "get_diagnosis_result_relative",
        "description": "Lấy kết quả khám bệnh của một người thân trong gia đình",
        "parameters": {
            "type": "object",
            "properties": {
            "role": {
                "type": "string",
                "description": "Vai trò của người thân, ví dụ: Chồng, Vợ, Con trai, Con gái, Ông, Bà, Anh, Chị, Em"
            }
            },
            "required": ["role"]
        },
        "function": get_diagnosis_result_relative,
        "example": "Xem kết quả khám bệnh của Mẹ tôi",
        "json": {
            "function": "get_diagnosis_result_relative",
            "args": {
            "role": "Mẹ"
            }
        }
    },
    "update_role_relative": {
        "name": "update_role_relative",
        "description": "Cập nhật vai trò của một người thân trong danh sách gia đình",
        "parameters": {
            "type": "object",
            "properties": {
            "relative_name": {
                "type": "string",
                "description": "Họ và tên của người thân"
            },
            "new_role": {
                "type": "string",
                "description": "Vai trò mới, ví dụ: Chồng, Vợ, Con trai, Con gái, Ông, Bà, Anh, Chị, Em"
            }
            },
            "required": ["relative_name", "new_role"]
        },
        "function": update_role_relative,
        "example": "Cập nhật vai trò của Nguyễn Văn A thành Anh",
        "json": {
            "function": "update_role_relative",
            "args": {
            "relative_name": "Nguyễn Văn A",
            "new_role": "Anh"
            }
        }
    },
    "get_appointment_done": {
        "name": "get_appointment_done",
        "description": "Lấy danh sách các cuộc hẹn khám đã hoàn thành",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_appointment_done,
        "example": "Xem tất cả các cuộc hẹn đã hoàn thành",
        "json": {
            "function": "get_appointment_done",
            "args": {}
        }
    },
    "get_appointment_undone": {
        "name": "get_appointment_undone",
        "description": "Lấy danh sách các cuộc hẹn khám đã lên lịch nhưng chưa diễn ra",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_appointment_undone,
        "example": "Xem các cuộc hẹn chưa diễn ra",
        "json": {
            "function": "get_appointment_undone",
            "args": {}
        }
    },
    "get_appointment_canceled": {
        "name": "get_appointment_canceled",
        "description": "Lấy danh sách các cuộc hẹn đã bị hủy",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_appointment_canceled,
        "example": "Xem các cuộc hẹn đã bị hủy",
        "json": {
            "function": "get_appointment_canceled",
            "args": {}
        }
    },
    "turn_on_sharing_diagnosis_result": {
        "name": "turn_on_sharing_diagnosis_result",
        "description": "Bật chia sẻ kết quả khám bệnh của hồ sơ bệnh nhân",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": turn_on_sharing_diagnosis_result,
        "example": "Bật chia sẻ kết quả khám bệnh của tôi",
        "json": {
            "function": "turn_on_sharing_diagnosis_result",
            "args": {}
        }
    },
    "turn_off_sharing_diagnosis_result": {
        "name": "turn_off_sharing_diagnosis_result",
        "description": "Tắt chia sẻ kết quả khám bệnh của hồ sơ bệnh nhân",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": turn_off_sharing_diagnosis_result,
        "example": "Tắt chia sẻ kết quả khám bệnh của tôi",
        "json": {
            "function": "turn_off_sharing_diagnosis_result",
            "args": {}
        }
    },
    "rate_appointment": {
        "name": "rate_appointment",
        "description": "Đánh giá một cuộc hẹn khám với bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {
            "doctor_name": {
                "type": "string",
                "description": "Họ và tên bác sĩ"
            },
            "time": {
                "type": "string",
                "format": "date-time",
                "description": "Thời gian hẹn (ISO 8601)"
            },
            "rating": {
                "type": "integer",
                "minimum": 1,
                "maximum": 5,
                "description": "Số sao đánh giá từ 1 đến 5"
            },
            "comment": {
                "type": "string",
                "description": "Nhận xét về cuộc hẹn"
            }
            },
            "required": ["doctor_name", "time", "rating", "comment"]
        },
        "function": rate_appointment,
        "example": "Đánh giá cuộc hẹn với bác sĩ Nguyễn Văn A lúc 14h ngày 25/6/2025, 5 sao, rất hài lòng.",
        "json": {
            "function": "rate_appointment",
            "args": {
            "doctor_name": "Nguyễn Văn A",
            "time": "2025-06-25T14:00:00",
            "rating": 5,
            "comment": "Rất hài lòng"
            }
        }
    },
    "update_medical_profile": {
        "name": "update_medical_profile",
        "description": "Cập nhật thông tin y tế của hồ sơ bệnh nhân",
        "parameters": {
            "type": "object",
            "properties": {
            "medical_history": { "type": "string", "description": "Tiền sử bệnh" },
            "blood_type": { "type": "string", "description": "Nhóm máu" },
            "health_insurance_id": { "type": "string", "description": "Mã BHYT" },
            "registered_hospital": { "type": "string", "description": "Bệnh viện đăng ký" },
            "issue_date": { "type": "string", "format": "date", "description": "Ngày cấp BHYT (ví dụ: 2025-08-15)" },
            "expiry_date": { "type": "string", "format": "date", "description": "Ngày hết hạn BHYT (ví dụ: 2026-08-15)" }
            },
            "required": ["medical_history", "blood_type", "health_insurance_id", "registered_hospital", "issue_date", "expiry_date"]
        },
        "function": update_medical_profile,
        "example": "Cập nhật hồ sơ y tế của tôi: nhóm máu O, mã BHYT 123456789, bệnh viện đăng ký Trung tâm Y tế Quận 1.",
        "json": {
            "function": "update_medical_profile",
            "args": {
            "blood_type": "O",
            "health_insurance_id": "123456789",
            "registered_hospital": "Trung tâm Y tế Quận 1"
            }
        }
    }











}
