# llm_engine/question_suggestions.py
import json, re
import random
from llm_engine.llama_chatbot_gguf import hybrid_retriever, ask_tllama 

STATIC_SUGGESTIONS_USER = {
    "book_appointment": [
        "Tôi muốn xem danh sách lịch khám đã đặt",
        "Có thể thay đổi thời gian hẹn khám không?",
        "Làm sao để xem thông tin chi tiết của bác sĩ.",
        "Tôi muốn hủy cuộc hẹn đã đặt thì làm sao?",
        "Hệ thống có chức năng nhắc nhở tôi trước giờ hẹn không?"
    ],
    "cancel_appointment": [
        "Tôi có thể đặt lại lịch khám sau khi đã hủy không?",
        "Làm sao để kiểm tra lịch hẹn đã bị hủy?",
        "Có tốn phí khi hủy lịch không?",
        "Tôi muốn xem lại các lịch hẹn đã đặt",
        "Hủy lịch hẹn xong có nhận được thông báo từ hệ thống không?"
    ],
    "add_love_list": [
        "Làm sao để xem thông tin chi tiết bác sĩ yêu thích?",
        "Tôi muốn xem danh sách bác sĩ yêu thích.",
        "Hãy hướng dẫn tôi gỡ một bác sĩ khỏi danh sách yêu thích.",
        "Hướng dẫn tôi trò chuyện với bác sĩ yêu thích",
        "Hướng dẫn để đặt lịch hẹn khám với bác sĩ."
    ],
    "add_relative": [
        "Hướng dẫn tôi cách xem thông tin người thân trong gia đình",
        "Tôi muốn xem danh sách người thân trong gia đình",
        "Làm sao để thay đổi vai trò của người thân trong gia đình?",
        "Hướng dẫn tôi xóa người thân trong gia đình.",
        "Xem thông tin sức khỏe của người thân như thế nào?"
    ],
    "connect_to_chat":[
        "Tôi có thể trò chuyện video call với bác sĩ được không?",
        "Cách đặt lịch hẹn khám với bác sĩ.",
        "Làm sao để xem thông tin chi tiết của bác sĩ trên hệ thống?",
        "Hướng dẫn cách thêm bác sĩ vào danh sách yêu thích",
        "Hướng dẫn tôi xem các đánh giá về bác sĩ cụ thể."
    ],
    "get_review_doctor":[
        "Cách xem thông tin chi tiết của bác sĩ cụ thể",
        "Làm sao đặt lịch khám với bác sĩ?",
        "Tôi có thể thêm bác sĩ vào danh sách yêu thích không?",
        "Cách xem lịch uống thuốc của tôi",
        "Cách cập nhật hồ sơ cá nhân của tôi"
    ],
    "create_reminder":[
        "Làm sao để xem lịch uống thuốc của tôi.",
        "Cách xóa lịch uống thuốc",
        "Hướng dẫn tôi cài đặt tính năng nhắc nhở sau khoảng thời gian.",
        "Tôi có những lịch uống thuốc nào?",
        "Hướng dẫn tôi thay đổi thời gian uống thuốc"
    ],
    "delete_relative":[
        "Hướng dẫn xem danh sách người thân",
        "Cách thay đổi vai trò người thân trong gia đình",
        "Cách thêm người thân trong gia đình",
        "Làm sao để theo dõi sức khỏe người thân",
        "Cách xem thông tin chi tiết của người thân"
    ],
    "delete_love_list": [
        "Xóa bác sĩ khỏi danh sách yêu thích như thế nào?",
        "Tôi muốn thêm một bác sĩ vào danh sách yêu thích phải làm sao",
        "Có cách nào xem lại danh sách yêu thích sau khi xóa không?",
        "Cách xem thông tin của một bác sĩ trên hệ thống",
        "Danh sách yêu thích của tôi."
    ],
    "delete_relative": [
        "Thêm người thân trong gia đình như thế nào?",
        "Tôi muốn xem danh sách người thân trong gia đình",
        "Có thể thêm lại người thân sau khi xóa không?",
        "Danh sách người thân của tôi còn những ai?",
        "Hướng dẫn cách thay đổi vai trò của người thân."
    ],
    "get_all_diagnosis_results": [
        "Hãy chỉ tôi xem chi tiết một kết quả chẩn đoán",
        "Có thể tải về kết quả khám bệnh không?",
        "Làm sao để chia sẻ kết quả chẩn đoán cho người thân?",
        "Tôi muốn bật chia sẻ kết quả khám bệnh của mình",
        "Tôi muốn xem lại lịch khám gần đây"
    ],
    "get_all_specializations": [
        "Hệ thống có thể xem được danh sách chuyên khoa không?",
        "Tôi muốn xem danh sách bác sĩ của một chuyên khoa Nội",
        "Làm sao để đặt lịch khám với một bác sĩ chuyên khoa tim mạch?",
        "Hệ thống có cho phép tư vấn trực tuyến không?",
        "Hướng dẫn tôi cách tìm kiếm bác sĩ khoa Tim mạch"
    ],
    "get_appointment_by_time": [
        "Hệ thống hỗ trợ đặt nhắc nhở cho lịch hẹn sắp tới không?",
        "Tôi muốn thay đổi thời gian của lịch hẹn phải làm sao?",
        "Hướng dẫn chi tiết thông tin bác sĩ trong lịch hẹn",
        "Tôi có thể hủy lịch hẹn không?",
        "Tôi muốn thay đổi thời gian hẹn cho lịch hẹn"
    ],
    "get_appointment_canceled": [
        "Tôi xem các cuộc hẹn sắp tới",
        "Có thể đặt lại lịch hẹn đã hủy không?",
        "Hệ thống có gửi thông báo khi lịch bị hủy không?",
        "Tôi muốn xem lịch sử hủy hẹn của tôi",
        "Có phí khi hủy lịch không?"
    ],
    "get_appointment_done": [
        "Tôi muốn xem kết quả khám của cuộc hẹn thì làm sao?",
        "Tôi muốn đánh giá một bác sĩ thì phải làm sao?",
        "Tôi muốn xem thông tin chi tiết cuộc hẹn",
        "Có cách nào xem toa thuốc từ cuộc hẹn đã xong?",
        "Tôi muốn đặt lịch tái khám sau khi hoàn thành"
    ],
    "get_appointment_undone": [
        "Xem danh sách cuộc hẹn đã hoàn thành",
        "Tôi muốn thay đổi thời gian hẹn khám thì làm sao",
        "Hệ thống có hỗ trợ đặt nhắc nhở cho lịch hẹn khám không?",
        "Tôi muốn xem chi tiết bác sĩ của lịch hẹn sắp tới",
        "Tôi có thể hủy cuộc hẹn khám không?"
    ],
    "get_appointment": [
        "Tôi muốn xem lịch hẹn gần nhất của mình",
        "Có thể đặt nhắc nhở cho các lịch hẹn không?",
        "Làm sao để thay đổi thời gian một lịch hẹn?",
        "Có cách nào hủy một lịch hẹn đã đặt không?",
        "Tôi muốn xem chi tiết bác sĩ trong lịch hẹn thì làm sao"
    ],
    "get_detail_appointment": [
        "Tôi có thể đổi giờ của lịch hẹn không?",
        "Có thể hủy lịch hẹn đã đặt không?",
        "Tôi muốn thêm ghi chú cho lịch hẹn",
        "Có thể chia sẻ thông tin lịch hẹn khám cho người thân không?",
        "Có thể thay đổi cuộc hẹn cụ thể thành trực tuyến/ trực tiếp không?"
    ],
    "get_detail_diagnosis_patient": [
        "Tôi muốn xem lịch uống thuốc của tôi.",
        "Cách xem ghi chú của bác sĩ sau buổi khám",
        "Làm sao để đặt lịch tái khám sau chẩn đoán?",
        "Tôi muốn chia sẻ chẩn đoán với người thân thì làm sao?",
        "Tôi có thể xem kết quả khám bệnh của người thân không?"
    ],
    "get_detail_result_relative": [
        "Tôi muốn xem lịch sử khám bệnh của người thân thì làm sao",
        "Tôi muốn xem lịch uống thuốc của người thân thì làm sao",
        "Tôi muốn thay đổi vai trò của người thân trong gia đình",
        "Có cách nào đặt lịch tái khám cho người thân không?",
        "Tôi muốn xem đơn thuốc của tôi"
    ],
    "get_doctor_info": [
        "Tôi muốn đặt lịch khám với bác sĩ thì làm sao?",
        "Có thể đặt lịch khám trực tuyến với bác sĩ không?",
        "Tôi muốn xem đánh giá của bệnh nhân về bác sĩ",
        "Có thể thêm bác sĩ vào danh sách yêu thích không?",
        "Hướng dẫn tôi xem chuyên khoa của bác sĩ"
    ],
    "get_doctor_list": [
        "Tôi muốn lọc danh sách bác sĩ theo chuyên khoa Nội",
        "Cách đặt lịch hẹn khám với bác sĩ?",
        "Cách cài đặt nhắc nhở uống thuốc",
        "Cách xem đánh giá của bác sĩ trên hệ thống",
        "Làm sao để nhắn tin với bác sĩ?"
    ],
    "get_doctor_specialization": [
        "Hướng dẫn tôi đặt lịch khám với bác sĩ",
        "Có thể xem danh sách bác sĩ trong chuyên khoa cụ thể không?",
        "Cách xem danh sách chuyên khoa trên hệ thống",
        "Tôi muốn xem đánh giá của bác sĩ thì làm sao?",
        "Tôi muốn liên lạc với bác sĩ trên hệ thống"
    ],
    "get_love_list": [
        "Hướng dẫn đặt lịch hẹn với một bác sĩ trong danh sách yêu thích",
        "Có thể xóa bác sĩ khỏi danh sách yêu thích không?",
        "Tôi muốn xem thông tin chi tiết của một bác sĩ yêu thích",
        "Có thể thêm ghi chú cho bác sĩ yêu thích không?",
        "Tôi muốn thêm một bác sĩ khác vào danh sách yêu thích làm sao?"
    ],
    "get_medicine_schedule_relative": [
        "Có thể thêm lịch uống thuốc cho người thân không?",
        "Có thể chỉnh giờ uống thuốc của người thân không?",
        "Làm sao để xóa lịch uống thuốc của người thân?",
        "Tôi muốn được nhắc nhở khi đến giờ uống thuốc thì làm sao?",
        "Có thể xem chi tiết thuốc trong lịch của người thân không?"
    ],
    "get_medicine_schedule": [
        "Tôi muốn thêm lịch uống thuốc mới thì làm sao?",
        "Có thể thay đổi giờ uống thuốc không?",
        "Làm sao để xóa một lịch uống thuốc?",
        "Tôi muốn được nhắc trước khi đến giờ uống thuốc",
        "Có thể xem danh sách tất cả thuốc trong tuần không?"
    ],
    "get_medicine": [
        "Tôi muốn xem thông tin chi tiết của thuốc.",
        "Có thể xem hướng dẫn sử dụng thuốc không?",
        "Tôi có thể đặt lịch tư vấn với bác sĩ được không?",
        "Cách đặt lịch nhắc nhở uống thuốc",
        "Cách xem lịch uống thuốc của người thân"
    ],
    "get_relatives": [
        "Tôi muốn thêm người thân mới vào danh sách thì làm sao?",
        "Có thể chỉnh thông tin người thân không?",
        "Làm sao để xóa một người thân?",
        "Tôi muốn xem hồ sơ sức khỏe của người thân",
        "Tôi muốn xem lịch uống thuốc của người thân"
    ],
    "get_upcoming_appointment": [
        "Có thể đặt nhắc nhở cho lịch hẹn sắp tới không?",
        "Tôi muốn đổi giờ hẹn sắp tới thì làm sao",
        "Làm sao để xem thông tin bác sĩ của lịch hẹn?",
        "Có thể hủy lịch hẹn sắp tới không?",
        "Tôi muốn hủy cuộc hẹn thì làm sao?"
    ],
    "rate_appointment": [
        "Tôi muốn xem lại đánh giá của mình về bác sĩ thì làm sao?",
        "Có thể chỉnh sửa đánh giá sau khi đã gửi không?",
        "Tôi muốn xem các đánh giá khác về bác sĩ cụ thể",
        "Cách thêm một bác sĩ vào danh sách yêu thích của tôi",
        "Tôi muốn nhắn tin với bác sĩ cụ thể thì làm sao?."
    ],
    "turn_on_sharing_diagnosis_result": [
        "Tôi muốn tắt chia sẻ kết quả khám bệnh của mình",
        "Tôi muốn xem lại hồ sơ sức khỏe của mình thì làm sao?",
        "Cách cập nhật lại thông tin y tế của mình.",
        "Tôi muốn xem lịch uống thuốc của mình",
        "Xem kết quả khám bệnh của người thân thì làm sao"
    ],
    "turn_on_sharing_diagnosis_result": [
        "Tôi muốn bật chia sẻ kết quả khám bệnh của mình",
        "Tôi muốn xem lại hồ sơ sức khỏe của mình thì làm sao?",
        "Tôi muốn cập nhật lại thông tin y tế của mình thì vào đâu?",
        "Tôi muốn xem lịch uống thuốc của mình",
        "Xem kết quả khám bệnh của người thân thì làm sao"
    ],
    "update_medical_profile": [
        "Tôi cập nhật hồ sơ cá nhân của mình thì làm sao?",
        "Tôi muốn xem lịch khám bệnh gần đây",
        "Xem thông tin hồ sơ cá nhân của mình",
        "Xem hồ sơ y tế của người thân được không?",
        "Xem lịch uống thuốc của tôi"
    ],
    "update_profile": [
        "Tôi muốn thay đổi thông tin hồ sơ y tế.",
        "Có thể thay đổi số điện thoại liên hệ không?",
        "Làm sao để cập nhật địa chỉ email?",
        "Tôi muốn đổi mật khẩu đăng nhập",
        "Có thể chỉnh sửa địa chỉ cá nhân không?"
    ],
    "update_role_relative": [
        "Tôi muốn xem xem danh sách người thân",
        "Có thể phân quyền cho người thân truy cập hồ sơ không?",
        "Làm sao để thêm người thân mới vào gia đình?",
        "Tôi muốn xóa người thân khỏi danh sách gia đình",
        "Có thể thêm người thân vào danh sách gia đình không?"
    ]
}


STATIC_SUGGESTIONS_DOCTOR = {
    "add_work_schedule": [
        "Làm sao để xem lịch làm việc đã tạo?",
        "Có thể chỉnh sửa lịch làm việc sau khi thêm không?",
        "Tôi muốn xóa lịch làm việc",
        "Có thể đặt lịch làm việc lặp lại hằng tuần không?",
        "Tôi muốn kiểm tra trùng lịch trong thời gian đã thêm"
    ],
    "connect_to_chat": [
        "Có thể xem lịch sử trò chuyện với bệnh nhân không?",
        "Tôi muốn gửi kết quả khám cho bệnh nhân",
        "Có gọi video call được cho bệnh nhân không?",
        "Tôi muốn xem hồ sơ y tế của bệnh nhân",
        "Tôi muốn xem thông tin sức khỏe của bệnh nhân"
    ],
    "delete_work_schedule": [
        "Làm sao để kiểm tra lịch làm việc đã bị xóa?",
        "Tôi muốn chỉnh sửa thay vì xóa lịch làm việc",
        "Có thể khôi phục lịch làm việc đã xóa không?",
        "Tôi muốn xem lịch làm việc còn lại sau khi xóa",
        "Có cách nào xóa nhiều lịch làm việc cùng lúc không?"
    ],
    "get_all_diagnosis_results": [
        "Tôi muốn xem chi tiết một kết quả chẩn đoán",
        "Có thể lọc kết quả theo bệnh nhân không?",
        "Làm sao để liên lạc với bệnh nhân",
        "Tôi muốn xem tất cả đánh giá của bệnh nhân",
        "Có thể tìm kiếm kết quả theo ngày khám không?"
    ],
    "get_all_patient_by_doctor": [
        "Tôi muốn xem thông tin chi tiết của bệnh nhân",
        "Có thể lọc danh sách bệnh nhân theo ngày khám không?",
        "Tôi muốn xem hồ sơ y tế của một bệnh nhân cụ thể",
        "Tôi muốn xem các đánh giá về tôi",
        "Tôi muốn xem lịch hẹn sắp tới của tôi"
    ],
    "get_all_reviews": [
        "Tôi muốn xem điểm trung bình đánh giá của mình",
        "Có thể lọc đánh giá theo khoảng thời gian không?",
        "Tôi muốn xem chi tiết từng đánh giá của bệnh nhân",
        "Có thể trả lời lại đánh giá của bệnh nhân không?",
        "Tôi muốn thống kê số lượt đánh giá."
    ],
    "get_appointment_by_time": [
        "Tôi muốn xem danh sách bệnh nhân theo khung giờ cụ thể",
        "Tôi muốn kết nối trò chuyện với một bệnh nhân",
        "Tôi muốn biết số lượng lịch hẹn trong ngày mai",
        "Có thể xem chi tiết lịch hẹn với một bệnh nhân không?",
        "Tôi muốn xem thông tin chi tiết của bệnh nhân"
    ],
    "get_appointment_canceled":[
        "Có thể đặt lại lịch khám sau khi đã hủy không?",
        "Danh sách lịch sắp tới",
        "Tôi muốn đặt lịch khám với một bác sĩ.",
        "Cập nhật hồ sơ cá nhân",
        "Xem lịch uống thuốc"
    ],
    "get_appointment_history_by_patient":[
        "Xem các lịch khám sắp tới",
        "Cách đặt lịch khám với bác sĩ",
        "Cách hủy lịch khám với bác sĩ",
        "Cách dùng tính năng nhắc nhở uống thuốc",
        "Danh sách cuộc hẹn sắp tới"
    ],
    "get_appointment_done":[
        "Danh sách cuộc hẹn chưa hoàn thành",
        "Danh sách các cuộc hẹn đã bị hủy",
        "Cách xem thông tin thuốc trên hệ thống",
        "Cách cập nhật hồ sơ cá nhân",
        "Danh sách cuộc hẹn sắp tới"
    ],
    "get_appointment_undone":[
        "Cách xem các cuộc hẹn đã bị hủy",
        "Xem các cuộc hẹn đã hoàn thành",
        "Xem lịch sử hẹn khám",
        "Cách cài đặt nhắc nhở uống thuốc",
        "Xem thông tin sức khỏe của bản thân"
    ],
    "get_appointment":[
        "Cho tôi xem tất cả lịch hẹn sắp tới tôi",
        "Tôi muốn kiểm tra các lịch hẹn đã bị hủy",
        "Tôi muốn gửi kết quả khám bệnh thì làm sao",
        "Lịch làm việc của tôi xem ở đâu?",
        "Tôi muốn cập nhật thông tin hồ sơ"
    ],
    "get_detail_appointment": [
        "Tôi muốn đổi thời gian của lịch hẹn này",
        "Có thể hủy lịch hẹn này không?",
        "Tôi muốn xem thông tin chi tiết của bệnh nhân trong lịch",
        "Có thể thêm ghi chú cho lịch hẹn này không?",
        "Tôi muốn xem hồ sơ của bệnh nhân này"
    ],
    "get_detail_diagnosis_patient": [
        "Tôi muốn xem thông tia của bệnh nhân này",
        "Cách thêm lịch uống thuốc cho bệnh nhân",
        "Xem đánh giá của bệnh nhân này",
        "Làm sao để nhắc bệnh nhân đặt lịch tái khám?",
        "Xem hồ sơ y tế của bệnh nhân"
    ],
    "get_diagnosis_done": [
        "Tôi muốn xem danh sách kết quả chẩn đoán đã hoàn thành",
        "Có thể lọc chẩn đoán đã xong theo bệnh nhân không?",
        "Tôi muốn xem hồ sơ y tế của bệnh nhân",
        "Xem đánh giá các cuộc hẹn",
        "Cách kê đơn thuốc cho bệnh nhân"
    ],
    "get_diagnosis_undone": [
        "Tôi muốn xem bệnh nhân nào đang chờ chẩn đoán",
        "Tôi muốn xem thông tin chi tiết bệnh nhân",
        "Tôi muốn gửi kết quả chẩn đoán cho bệnh nhân",
        "Hướng dẫn cách gửi kết quả chẩn đoán cho bệnh nhân",
        "Cách kê đơn thuốc trên hệ thống cho bệnh nhân"
    ],
    "get_diagnosis_patient_by_all": [
        "Tôi muốn xem chẩn đoán của một bệnh nhân cụ thể",
        "Có thể lọc chẩn đoán theo chuyên khoa không?",
        "Tôi muốn biết thông tin của bệnh nhân này",
        "Hướng dẫn cách xem đánh giá của bệnh nhân",
        "Xem hồ sơ của bệnh nhân"
    ],
    "get_medicine_by_condition": [
        "Tôi muốn xem thuốc thường dùng cho bệnh tim mạch",
        "Cách tìm kiếm thuốc trên hệ thống",
        "Tôi muốn xem tác dụng phụ của thuốc",
        "Có thể xem đơn thuốc nào đang dùng loại thuốc này không?",
        "Tôi muốn xem thuốc được kê nhiều nhất"
    ],
    "get_patient_info_by_doctor": [
        "Tôi muốn xem lịch sử khám của bệnh nhân này",
        "Có thể xem các kết quả chẩn đoán gần đây không?",
        "Tôi muốn nhắn tin với bệnh nhân",
        "Có thể xem hồ sơ bệnh nhân về máy không?",
        "Tôi muốn xem thông tin liên hệ của bệnh nhân"
    ],
    "get_patient_shared_info": [
        "Cách muốn xem bệnh nhân nào đã cho phép chia sẻ thông tin",
        "Xem thông tin chi tiết của một bệnh nhân",
        "Xem kết quả khám bệnh của một bệnh nhân",
        "Xem tất cả bệnh nhân của tôi",
        "Tôi có những bệnh nhân nào?"
    ],
    "get_review_by_patient": [
        "Tôi muốn xem đánh giá mới nhất từ bệnh nhân này",
        "Có thể lọc đánh giá theo thời gian không?",
        "Tôi muốn biết điểm trung bình đánh giá của tôi",
        "Tôi có bao nhiêu lượt đánh giá?",
        "Cách phản hồi lại đánh giá của bệnh nhân"
    ],
    "get_review_statistics": [
        "Tôi muốn xem chi tiết đánh giá của bệnh nhân",
        "Có thể xem thống kê đánh giá theo tháng không?",
        "Hệ thống có hỗ trợ thống kê đánh giá không?",
        "Có thể xuất biểu đồ thống kê đánh giá không?",
        "Tôi muốn biết số lượng đánh giá trong tuần này"
    ],
    "get_upcoming_appointment": [
        "Tôi muốn xem danh sách bệnh nhân sẽ khám hôm nay",
        "Có thể lọc lịch hẹn sắp tới theo khung giờ không?",
        "Tôi muốn biết bệnh nhân nào chưa xác nhận lịch hẹn",
        "Có thể gửi nhắc nhở cho bệnh nhân không?",
        "Tôi muốn xem danh sách bệnh nhân của tôi"
    ],
    "get_work_schedule": [
        "Tôi muốn xem lịch làm việc của tuần này",
        "Có thể lọc lịch làm việc theo ngày không?",
        "Tôi muốn chỉnh sửa thời gian trong lịch làm việc",
        "Hệ thống có hỗ trợ nhắc nhở lịch làm việc không?",
        "Tôi muốn thay đổi lịch làm việc thì làm sao"
    ],
    "turn_off_sharing_status_patient": [
        "Tôi muốn bật chia sẻ kết quả khám",
        "Xem danh sách bệnh nhân của tôi",
        "Tôi muốn xem các cuộc hẹn khám gần đây",
        "Xem thông tin chi tiết của một bệnh nhân",
        "Tôi muốn xem lại lịch làm việc."
    ],
    "turn_on_sharing_status_patient": [
        "Tôi muốn tắt chia sẻ kết quả khám",
        "Xem danh sách bệnh nhân của tôi",
        "Tôi muốn xem các cuộc hẹn khám gần đây",
        "Xem thông tin chi tiết của một bệnh nhân",
        "Tôi muốn xem lại lịch làm việc."
    ],
    "update_profile": [
        "Tôi muốn cập nhật lại hồ sơ của mình",
        "Có thể chỉnh sửa số điện thoại liên hệ không?",
        "Tôi muốn cập nhật địa chỉ email",
        "Có thể đổi mật khẩu đăng nhập không?",
        "Tôi muốn thay đổi lịch làm việc"
    ],
    "update_work_schedule": [
        "Tôi muốn thay đổi thời gian trong lịch làm việc",
        "Có thể thêm buổi mới vào lịch không?",
        "Tôi muốn xóa một buổi trong lịch làm việc",
        "Có thể sao chép lịch từ tuần trước không?",
        "Tôi muốn xem lại lịch làm việc sau khi cập nhật"
    ],
    "upload_diagnosis_result": [
        "Tôi muốn xem lại kết quả đã tải lên",
        "Có thể chỉnh sửa kết quả chẩn đoán sau khi tải không?",
        "Tôi muốn chia sẻ kết quả này cho bệnh nhân",
        "Có thể xem lại tất cả các kết quả khám không?",
        "Tôi muốn xem lịch sử các lần tải kết quả chẩn đoán"
    ]

}

def _clean_json(text: str) -> list[str]:
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.MULTILINE).strip()
    try:
        return json.loads(cleaned)
    except:
        return [l.strip("-• ").strip() for l in text.splitlines() if l.strip()]

def suggest_app_guide(role:str, user_message: str, k: int = 3) -> list[str]:
    docs = hybrid_retriever.invoke(user_message)
    context = "\n".join([d.page_content for d in docs[:5]])
    prompt = f"""Sinh {k} câu hỏi mà người dùng có thể hỏi tiếp theo về cách sử dụng app chăm sóc sức khỏe, 
dựa trên hướng dẫn sau:

[Ngữ cảnh]
{context}

[Câu hỏi hiện tại]
{user_message}

Yêu cầu:
- Chỉ trả về một JSON array các câu hỏi (chuỗi).
- Các câu hỏi, gợi ý sinh ra phải liên quan đến câu hỏi mà người dùng vừa hỏi.
- Không thêm lời dẫn, không giải thích, không văn bản ngoài JSON.

Định dạng ví dụ:
["Câu hỏi 1", "Câu hỏi 2", "Câu hỏi 3"]"""
    raw = ask_tllama(prompt)
    return _clean_json(raw)[:k]


# def suggest_api_intent(role: str, intent: str, user_message: str, k: int = 3) -> list[str]:
#     if role == "bs":
#         STATIC_SUGGESTIONS = STATIC_SUGGESTIONS_DOCTOR
#     elif role == "bn":
#         STATIC_SUGGESTIONS = STATIC_SUGGESTIONS_USER
#     base = random.sample(STATIC_SUGGESTIONS.get(intent, []), min(k, len(STATIC_SUGGESTIONS.get(intent, []))))
#     prompt = f"""Bạn là người đưa ra các câu hỏi gợi ý cho hệ thống Doctorhere. Hãy chèn thông tin ngữ cảnh vào câu hỏi nhưng không được làm thay đổi nội dung của câu hỏi:
# Ngữ cảnh: "{user_message}"
# Danh sách câu hỏi: {base}

# Yêu cầu: 
# - Không được thay đổi nội dung, mục đích, ý nghĩa danh sách câu hỏi.
# - Trả lại đúng {len(base)} câu hỏi đã được điều chỉnh, ở dạng JSON array.
# """
#     raw = ask_tllama(prompt)
#     return _clean_json(raw)[:k]

def suggest_api_intent(role: str, intent: str, user_message: str, k: int = 3) -> list[str]:
    if role == "bs":
        STATIC_SUGGESTIONS = STATIC_SUGGESTIONS_DOCTOR
    elif role == "bn":
        STATIC_SUGGESTIONS = STATIC_SUGGESTIONS_USER
    else:
        return []

    base = STATIC_SUGGESTIONS.get(intent, [])
    return random.sample(base, min(k, len(base)))


def suggest_medical(role: str, user_message: str, k: int = 3) -> list[str]:
    prompt = f"""Người dùng mô tả triệu chứng: "{user_message}"

Hãy sinh {k} câu hỏi tiếp theo để khai thác thêm triệu chứng và tình trạng sức khỏe, 
giúp tư vấn chính xác hơn. 
Chỉ trả về JSON array.
"""
    raw = ask_tllama(prompt)
    return _clean_json(raw)[:k]
