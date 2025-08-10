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
    update_profile
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
                "relative_name": {"type": "string"}
            },
            "required": ["relative_name"]
        },
        "function": add_relative,
        "example": "Thêm người thân của tôi là Nguyễn Văn B.",
        "json": {
            "function": "add_relative",
            "args": {
                "relative_name": "Nguyễn Văn B"
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
            },
            "required": ["doctor_name", "time"]
        },
        "function": book_appointment,
        "example": "Đặt lịch khám cho tôi với bác sĩ Hùng vào lúc 7 giờ 30 sáng 26/5/2025",
        "json": {
            "function": "book_appointment",
            "args": {
                "doctor_name": "Hùng",
                "time": "2025-06-26T07:30:00",
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
        "description": "Lấy thông tin chi tiết về một cuộc hẹn dựa trên thời gian hẹn",
        "parameters": {
            "type": "object",
            "properties": {
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
            },
            "required": ["time"]
        },
        "function": get_appointment_by_time,
        "example": "Cho tôi xem thông tin cuộc hẹn khám lúc 14 giờ 30 ngày 25 tháng 6 năm 2025",
        "json": {
            "function": "get_appointment_by_time",
            "args": {
                "time": "2025-06-25T14:30:00"
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
    }
}
