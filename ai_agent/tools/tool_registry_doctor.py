from tools.doctor_tool import (
    connect_to_chat,
    get_all_diagnosis_results,
    get_all_reviews,
    get_appointment_by_time,
    get_appointment,
    get_detail_appointment,
    get_detail_diagnosis_patient,
    get_review_by_patient,
    get_review_statistics,
    get_upcoming_appointment,
    update_profile,
    upload_diagnosis_result,
    add_work_schedule,
    delete_work_schedule,
    get_work_schedule,
    get_all_patient_by_doctor,
    get_appointment_history_by_patient,
    get_diagnosis_done,
    get_diagnosis_undone,
    get_patient_info_by_doctor,
    turn_off_sharing_status_patient,
    turn_on_sharing_status_patient,
    get_diagnosis_patient_by_all,
    get_medicine_by_condition,
    get_appointment_undone,
    get_appointment_canceled,
    get_appointment_done,
    update_work_schedule,
    get_patient_shared_info
)

TOOL_REGISTRY_DOCTOR = {
    "connect_to_chat": {
        "name": "connect_to_chat",
        "description": "Kết nối trò chuyện với một bệnh nhân cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {"type": "string"}
            },
            "required": ["patient_name"]
        },
        "function": connect_to_chat,
        "example": "Kết nối trò chuyện với bệnh nhân Võ Tấn Tài",
        "json": {
            "function":"connect_to_chat",
            "args": {
                "patient_name": "Võ Tấn Tài"
            }
        }
    },
    "get_all_diagnosis_results": {
        "name": "get_all_diagnosis_results",
        "description": "Xem tất cả kết quả khám bệnh mà bác sĩ đã từng thực hiện khám",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": get_all_diagnosis_results,
        "example": "Hiển thị toàn bộ kết quả chẩn đoán tôi đã khám trước đây",
        "json": {
            "function": "get_all_diagnosis_results",
            "args": {}
        }
    },
    "get_all_reviews": {
        "name": "get_all_reviews",
        "description": "Xem tất cả đánh giá của bệnh nhân dành cho bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": get_all_reviews,
        "example": "Tôi muốn xem tất cả các đánh giá của bệnh nhân về tôi",
        "json": {
            "function": "get_all_reviews",
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
                "start_time": "14 giờ ngày 25 tháng 6 năm 2025",
                "end_time": "15 giờ ngày 25 tháng 6 năm 2025"
            }
        }
    },
    "get_appointment": {
        "name": "get_appointment",
        "description": "Lấy tất cả các cuộc hẹn khám bệnh đã hoàn thành của bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_appointment,
        "example": "Hiển thị danh sách tất cả cuộc hẹn đã hoàn thành của tôi",
        "json": {
            "function": "get_appointment",
            "args": {}
        }
    },
    "get_detail_appointment": {
        "name": "get_detail_appointment",
        "description": "Lấy chi tiết một cuộc hẹn cụ thể của bác sĩ với bệnh nhân.",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {"type": "string"},
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
            },
            "required": ["patient_name", "time"]
        },
        "function": get_detail_appointment,
        "example": "Tôi muốn biết chi tiết cuộc hẹn với bệnh nhân Nguyễn Văn A lúc 14h ngày 12/07/2025",
        "json": {
            "function": "get_detail_appointment",
            "args": {
                "patient_name": "Nguyễn Văn A",
                "time": "14h ngày 12/07/2025"
            }
        }
    },
    "get_detail_diagnosis_patient": {
        "name": "get_detail_diagnosis_patient",
        "description": "Lấy chi tiết kết quả chẩn đoán, khám bệnh của một bệnh nhân cụ thể tại một thời điểm cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {"type": "string"},
                "time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
            },
            "required": ["patient_name", "time"]
        },
        "function": get_detail_diagnosis_patient,
        "example": "Tôi muốn xem chi tiết kết quả khám bệnh của bệnh nhân Trần Thị Mai vào 10h sáng ngày 20/07/2025",
        "json": {
            "function": "get_detail_diagnosis_patient",
            "args": {
                "patient_name": "Trần Thị Mai",
                "time": "10h sáng ngày 20/07/2025"
            }
        }
    },
    "get_review_by_patient": {
        "name": "get_review_by_patient",
        "description": "Lấy danh sách đánh giá của một bệnh nhân cụ thể đã từng khám với bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {"type": "string"}
            },
            "required": ["patient_name"]
        },
        "function": get_review_by_patient,
        "example": "Hiển thị đánh giá của bệnh nhân Nguyễn Thị Kim đối với tôi",
        "json": {
            "function": "get_review_by_patient",
            "args": {
                "patient_name": "Nguyễn Thị Kim"
            }
        }
    },
    "get_review_statistics": {
        "name": "get_review_statistics",
        "description": "Lấy thống kê tổng số lượt đánh giá và điểm trung bình của bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_review_statistics,
        "example": "Cho tôi biết tổng số lượt đánh giá và điểm trung bình của tôi",
        "json": {
            "function": "get_review_statistics",
            "args": {}
        }
    },
    "get_upcoming_appointment": {
        "name": "get_upcoming_appointment",
        "description": "Lấy danh sách các cuộc hẹn sắp tới mà bác sĩ đã lên lịch",
        "parameters": {
            "type": "object",
            "properties": {
                "doctor_id": {
                    "type": "string",
                    "description": "ID của bác sĩ đang đăng nhập"
                }
            }
        },
        "function": get_upcoming_appointment, 
        "example": "Cho tôi xem các cuộc hẹn sắp tới của tôi",
        "json": {
            "function": "get_upcoming_appointments",
            "args": {}
        }
    },
    "update_profile": {
        "name": "update_profile",
        "description": "Cập nhật hồ sơ cá nhân của bác sĩ bao gồm email, họ và tên, số điện thoại, giới tính, ngày sinh, ngày vào nghề, trình độ học vấn, mô tả, địa chỉ phòng khám, chuyên khoa",
        "parameters": {
            "type": "object",
            "properties": {
                "email": {"type": "string", "description": "Email làm việc của bác sĩ"},
                "full_name": {"type": "string", "description": "Họ và tên đầy đủ của bác sĩ"},
                "phone_number": {"type": "string", "description": "Số điện thoại liên hệ"},
                "gender": {"type": "string", "description": "Giới tính của bác sĩ (nam/nữ)"},
                "date_of_birth": {"type": "string", "description": "Ngày sinh, định dạng dd/mm/yyyy"},
                "start_date": {"type": "string", "description": "Ngày bắt đầu hành nghề, định dạng dd/mm/yyyy"},
                "degree": {"type": "string", "description": "Trình độ học vấn (ví dụ: Tiến sĩ, Thạc sĩ, Bác sĩ chuyên khoa I...)"},
                "description": {"type": "string", "description": "Mô tả về kinh nghiệm hoặc triết lý nghề nghiệp"},
                "clinic_address": {"type": "string", "description": "Địa chỉ phòng khám hiện tại"},
                "specialization": {"type": "string", "description": "Chuyên khoa mà bác sĩ đang hoạt động"},
            }
        },
        "function": update_profile,
        "example": "Tôi muốn cập nhật hồ sơ: email dr.minh@clinic.vn, họ tên Nguyễn Văn Minh, số điện thoại 0987123456, giới tính nam, ngày sinh 11/07/1980, vào nghề từ ngày 01/01/2010, học vị Thạc sĩ, mô tả 'tận tâm và trách nhiệm', chuyên khoa Nội, phòng khám tại 123 Lê Lợi, TP.HCM.",
        "json": {
            "function": "update_profile",
            "args": {
                "email": "dr.minh@clinic.vn",
                "full_name": "Nguyễn Văn Minh",
                "phone_number": "0987123456",
                "gender": "nam",
                "date_of_birth": "11/07/1980",
                "start_date": "01/01/2010",
                "degree": "Thạc sĩ",
                "description": "Tận tâm và trách nhiệm",
                "clinic_address": "123 Lê Lợi, TP.HCM",
                "specialization": "Nội",
            }
        }
    },
    "upload_diagnosis_result": {
        "name": "upload_diagnosis_result",
        "description": "Gửi kết quả khám bệnh bao gồm tên bệnh nhân, thời gian khám, chẩn đoán, đơn thuốc (tên thuốc, liều lượng, thời gian uống), và ghi chú",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {"type": "string", "description": "Họ tên đầy đủ của bệnh nhân"},
                "exam_time": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Thời gian khám dưới dạng ISO 8601 datetime string, ví dụ: '2025-06-25T14:30:00'"
                },
                "diagnosis": {"type": "string", "description": "Kết quả chẩn đoán"},
                "medicine_name": {"type": "string", "description": "Tên thuốc nếu có"},
                "dosage": {"type": "string", "description": "Liều lượng uống mỗi lần (vd: 1 viên, 5ml, ...)"},
                "usage_time": {"type": "string", "description": "Thời gian uống thuốc (vd: sáng-trưa-tối, sau ăn 30 phút...)"},
                "note": {"type": "string", "description": "Ghi chú thêm (nếu có)"}
            },
            "required": ["patient_name", "exam_time", "diagnosis", "medicine_name", "dosage", "usage_time", "note"]
        },
        "function": upload_diagnosis_result,
        "example": "Khám cho bệnh nhân Nguyễn Văn Tài lúc 10h ngày 20/7: viêm họng cấp. Đơn thuốc: Paracetamol 500mg, liều lượng 1 viên, uống sáng-trưa-tối.",
        "json": {
            "function": "upload_diagnosis_result",
            "args": {
                "patient_name": "Nguyễn Văn Tài",
                "exam_time": "10h ngày 20/7",
                "diagnosis": "Viêm họng cấp",
                "medicine_name": "Paracetamol 500mg",
                "dosage": "1 viên",
                "usage_time": "Sáng-trưa-tối",
                "note": "Theo dõi thêm nếu sốt cao"
            }
        }
    },
    "add_work_schedule": {
        "name": "add_work_schedule",
        "description": "Thêm lịch làm việc cho bác sĩ bao gồm thứ, giờ bắt đầu, giờ kết thúc và hình thức làm việc (trực tuyến hoặc trực tiếp)",
        "parameters": {
            "type": "object",
            "properties": {
                "weekday": {
                    "type": "string",
                    "description": "Ngày trong tuần (vd: Thứ Hai, Thứ Ba, ..., Chủ Nhật)"
                },
                "start_time": {
                    "type": "string",
                    "format": "time",
                    "description": "Giờ bắt đầu làm việc theo định dạng 24h, ví dụ: '08:00'"
                },
                "end_time": {
                    "type": "string",
                    "format": "time",
                    "description": "Giờ kết thúc làm việc theo định dạng 24h, ví dụ: '17:00'"
                },
                "work_type": {
                    "type": "string",
                    "enum": ["Trực tuyến", "Trực tiếp"],
                    "description": "Hình thức làm việc: 'Trực tuyến' hoặc 'Trực tiếp'"
                }
            },
            "required": ["weekday", "start_time", "end_time", "work_type"]
        },
        "function": add_work_schedule,
        "example": "Tôi muốn thêm lịch làm việc vào thứ ba từ 8 giờ đến 16 giờ, làm trực tiếp.",
        "json": {
            "function": "add_work_schedule",
            "args": {
                "weekday": "Thứ Ba",
                "start_time": "08:00",
                "end_time": "16:00",
                "work_type": "Trực tiếp"
            }
        }
    },
    "delete_work_schedule": {
        "name": "delete_work_schedule",
        "description": "Xóa một lịch làm việc cụ thể của bác sĩ dựa trên thứ, giờ bắt đầu và giờ kết thúc",
        "parameters": {
            "type": "object",
            "properties": {
                "weekday": {
                    "type": "string",
                    "description": "Ngày trong tuần (vd: Thứ Hai, Thứ Ba, ..., Chủ Nhật)"
                },
                "start_time": {
                    "type": "string",
                    "format": "time",
                    "description": "Giờ bắt đầu của lịch làm việc muốn xóa, định dạng 24h, ví dụ: '08:00'"
                },
                "end_time": {
                    "type": "string",
                    "format": "time",
                    "description": "Giờ kết thúc của lịch làm việc muốn xóa, định dạng 24h, ví dụ: '16:00'"
                }
            },
            "required": ["weekday", "start_time", "end_time"]
        },
        "function": delete_work_schedule,
        "example": "Tôi muốn xóa lịch làm việc vào thứ ba từ 8 giờ đến 16 giờ",
        "json": {
            "function": "delete_work_schedule",
            "args": {
                "weekday": "Thứ Ba",
                "start_time": "08:00",
                "end_time": "16:00"
            }
        }
    },
    "get_work_schedule": {
        "name": "get_work_schedule",
        "description": "Lấy danh sách toàn bộ lịch làm việc hiện tại của bác sĩ bao gồm thứ, giờ bắt đầu, giờ kết thúc và hình thức làm việc",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_work_schedule,
        "example": "Hiển thị toàn bộ lịch làm việc của tôi",
        "json": {
            "function": "get_work_schedule",
            "args": {}
        }
    },
    "get_all_patient_by_doctor": {
        "name": "get_all_patient_by_doctor",
        "description": "Lấy danh sách tất cả bệnh nhân đã từng được bác sĩ khám hoặc có lịch hẹn với bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_all_patient_by_doctor,
        "example": "Cho tôi xem danh sách các bệnh nhân tôi đã từng khám",
        "json": {
            "function": "get_all_patient_by_doctor",
            "args": {}
        }
    },
    "get_appointment_history_by_patient": {
        "name": "get_appointment_history_by_patient",
        "description": "Lấy toàn bộ lịch sử các cuộc hẹn giữa bác sĩ và một bệnh nhân cụ thể",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {
                    "type": "string",
                    "description": "Họ và tên đầy đủ của bệnh nhân"
                }
            },
            "required": ["patient_name"]
        },
        "function": get_appointment_history_by_patient,
        "example": "Cho tôi xem lịch sử hẹn khám với bệnh nhân Trần Thị Hồng",
        "json": {
            "function": "get_appointment_history_by_patient",
            "args": {
                "patient_name": "Trần Thị Hồng"
            }
        }
    },
    "get_diagnosis_done": {
        "name": "get_diagnosis_done",
        "description": "Lấy danh sách các buổi khám đã được bác sĩ xử lý và gửi kết quả chẩn đoán lên hệ thống",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_diagnosis_done,
        "example": "Hiển thị danh sách các buổi khám đã xử lý",
        "json": {
            "function": "get_diagnosis_done",
            "args": {}
        }
    },
    "get_diagnosis_undone": {
        "name": "get_diagnosis_undone",
        "description": "Lấy danh sách các buổi khám bác sĩ chưa gửi kết quả chẩn đoán lên hệ thống",
        "parameters": {
            "type": "object",
            "properties": {}
        },
        "function": get_diagnosis_undone,
        "example": "Cho tôi xem các buổi khám chưa chẩn đoán xong",
        "json": {
            "function": "get_diagnosis_undone",
            "args": {}
        }
    },
    "get_patient_info_by_doctor": {
        "name": "get_patient_info_by_doctor",
        "description": "Lấy thông tin chi tiết của một bệnh nhân mà bác sĩ đã từng khám hoặc có lịch hẹn với bác sĩ",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {
                    "type": "string",
                    "description": "Họ và tên đầy đủ của bệnh nhân"
                }
            },
            "required": ["patient_name"]
        },
        "function": get_patient_info_by_doctor,
        "example": "Tôi muốn xem thông tin bệnh nhân Nguyễn Thị Thu",
        "json": {
            "function": "get_patient_info_by_doctor",
            "args": {
                "patient_name": "Nguyễn Thị Thu"
            }
        }
    },
    "turn_on_sharing_status_patient": {
        "name": "turn_on_sharing_status_patient",
        "description": "Bật chế độ chia sẻ kết quả khám bệnh của một bệnh nhân cụ thể để cho phép người khác xem",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {
                    "type": "string",
                    "description": "Họ và tên đầy đủ của bệnh nhân cần bật chia sẻ kết quả"
                }
            },
            "required": ["patient_name"]
        },
        "function": turn_on_sharing_status_patient,
        "example": "Bật chia sẻ kết quả khám bệnh của bệnh nhân Nguyễn Văn Nam",
        "json": {
            "function": "turn_on_sharing_status_patient",
            "args": {
                "patient_name": "Nguyễn Văn Nam"
            }
        }
    },
    "turn_off_sharing_status_patient": {
        "name": "turn_off_sharing_status_patient",
        "description": "Tắt chế độ chia sẻ kết quả khám bệnh của một bệnh nhân cụ thể để không cho người khác xem",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {
                    "type": "string",
                    "description": "Họ và tên đầy đủ của bệnh nhân cần tắt chia sẻ kết quả"
                }
            },
            "required": ["patient_name"]
        },
        "function": turn_off_sharing_status_patient,
        "example": "Tắt chia sẻ kết quả khám bệnh của bệnh nhân Trần Thị Mai",
        "json": {
            "function": "turn_off_sharing_status_patient",
            "args": {
                "patient_name": "Trần Thị Mai"
            }
        }
    },
    "get_appointment_canceled": {
        "name": "get_appointment_canceled",
        "description": "Lấy danh sách tất cả các cuộc hẹn đã bị hủy của bác sĩ hiện tại",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": get_appointment_canceled,
        "example": "Cho tôi xem các cuộc hẹn đã bị hủy của tôi",
        "json": {
            "function": "get_appointment_canceled",
            "args": {}
        }
    },
    "get_appointment_done": {
        "name": "get_appointment_done",
        "description": "Lấy danh sách các cuộc hẹn đã hoàn thành của bác sĩ hiện tại",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": get_appointment_done,
        "example": "Hiển thị các cuộc hẹn tôi đã khám xong",
        "json": {
            "function": "get_appointment_done",
            "args": {}
        }
    },
    "get_appointment_undone": {
        "name": "get_appointment_undone",
        "description": "Lấy danh sách các cuộc hẹn chưa hoàn thành của bác sĩ hiện tại",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": get_appointment_undone,
        "example": "Tôi muốn xem các cuộc hẹn chưa hoàn thành",
        "json": {
            "function": "get_appointment_undone",
            "args": {}
        }
    },
    "get_diagnosis_done": {
        "name": "get_diagnosis_done",
        "description": "Lấy danh sách kết quả khám bệnh đã xử lý và gửi lên hệ thống của bác sĩ hiện tại",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": get_diagnosis_done,
        "example": "Hiển thị những kết quả khám bệnh tôi đã hoàn tất",
        "json": {
            "function": "get_diagnosis_done",
            "args": {}
        }
    },
    "get_diagnosis_undone": {
        "name": "get_diagnosis_undone",
        "description": "Lấy danh sách các kết quả khám bệnh chưa được bác sĩ xử lý và gửi lên hệ thống",
        "parameters": {
            "type": "object",
            "properties": {},
            "required": []
        },
        "function": get_diagnosis_undone,
        "example": "Cho tôi biết các ca khám bệnh tôi chưa xử lý",
        "json": {
            "function": "get_diagnosis_undone",
            "args": {}
        }
    },
    "get_diagnosis_patient_by_all": {
        "name": "get_diagnosis_patient_by_all",
        "description": "Lấy danh sách tất cả kết quả khám bệnh của một bệnh nhân cụ thể, bao gồm các bác sĩ khác",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {
                    "type": "string",
                    "description": "Họ và tên đầy đủ của bệnh nhân cần tra cứu kết quả khám bệnh"
                }
            },
            "required": ["patient_name"]
        },
        "function": get_diagnosis_patient_by_all,
        "example": "Tôi muốn xem toàn bộ kết quả khám bệnh của bệnh nhân Nguyễn Văn Long",
        "json": {
            "function": "get_diagnosis_patient_by_all",
            "args": {
                "patient_name": "Nguyễn Văn Long"
            }
        }
    },
    "get_medicine_by_condition": {
        "name": "get_medicine_by_condition",
        "description": "Tư vấn thuốc theo bệnh, đối tượng sử dụng và các lưu ý đặc biệt",
        "parameters": {
            "type": "object",
            "properties": {
                "disease_name": {
                    "type": "string",
                    "description": "Tên bệnh mà người dùng muốn tra cứu thuốc điều trị"
                },
                "target_user": {
                    "type": "string",
                    "description": "Đối tượng uống thuốc (ví dụ: trẻ em, người lớn, phụ nữ mang thai, nam giới, v.v.)"
                },
                "caution": {
                    "type": "string",
                    "description": "Lưu ý về tình trạng sức khỏe như dị ứng, chống chỉ định, bệnh nền"
                }
            },
            "required": ["disease_name", "target_user", "caution"]
        },
        "function": get_medicine_by_condition,
        "example": "Thuốc điều trị cảm cúm cho phụ nữ mang thai bị dị ứng paracetamol là gì?",
        "json": {
            "function": "get_medicine_by_condition",
            "args": {
                "disease_name": "cảm cúm",
                "target_user": "phụ nữ mang thai",
                "caution": "dị ứng paracetamol"
            }
        }
    },
    "update_work_schedule": {
        "name": "update_work_schedule",
        "description": "Cập nhật lịch làm việc của bác sĩ trên hệ thống theo ngày trong tuần, thời gian và hình thức làm việc",
        "parameters": {
            "type": "object",
            "properties": {
                "week_day": {
                    "type": "string",
                    "description": "Ngày trong tuần cần cập nhật (ví dụ: Thứ Hai, Thứ Ba, Chủ Nhật...)"
                },
                "start_time": {
                    "type": "string",
                    "description": "Thời gian bắt đầu làm việc (định dạng HH:MM, ví dụ: 08:00)"
                },
                "end_time": {
                    "type": "string",
                    "description": "Thời gian kết thúc làm việc (định dạng HH:MM, ví dụ: 17:00)"
                },
                "work_type": {
                    "type": "string",
                    "enum": ["Trực tiếp", "Trực tuyến"],
                    "description": "Hình thức làm việc trong khoảng thời gian đó: Trực tiếp hoặc Trực tuyến"
                }
            },
            "required": ["week_day", "start_time", "end_time", "work_type"]
        },
        "function": update_work_schedule,
        "example": "Cập nhật lịch làm việc vào Thứ Bảy từ 13h đến 17h theo hình thức trực tuyến",
        "json": {
            "function": "update_work_schedule",
            "args": {
                "week_day": "Thứ Bảy",
                "start_time": "13:00",
                "end_time": "17:00",
                "work_type": "Trực tuyến"
            }
        }
    },
    "get_patient_shared_info": {
        "name": "get_patient_shared_info",
        "description": "Lấy danh sách tất cả bệnh nhân cho phép chia sẻ kết quả khám bệnh của mình cho tất cả mọi người xem",
        "parameters": {
            "type": "object",
            "properties": {
                "patient_name": {
                    "type": "string",
                    "description": "Họ và tên đầy đủ của bệnh nhân (tùy chọn, nếu muốn lọc theo tên)"
                }
            }
        },
        "function": get_patient_shared_info,
        "example": "Cho tôi danh sách các bệnh nhân cho phép chia sẻ kết quả khám. Lọc theo bệnh nhân tên Nguyễn Văn Khánh.",
        "json": {
            "function": "get_patient_shared_info",
            "args": {
                "patient_name": "Nguyễn Văn Khánh"
            }
        }
    },

}