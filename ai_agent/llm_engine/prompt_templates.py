from tools.tool_registry_user import TOOL_REGISTRY_USER
from tools.tool_registry_doctor import TOOL_REGISTRY_DOCTOR
# from datetime import datetime
# from typing import Optional, Tuple

def build_function_call_prompt(intent: str, user_message: str, role: str) -> str:

    if role == 'bs':
        TOOL_REGISTRY = TOOL_REGISTRY_DOCTOR
    elif role == 'bn':
        TOOL_REGISTRY = TOOL_REGISTRY_USER

    if intent not in TOOL_REGISTRY:
        raise ValueError(f"Intent '{intent}' không tồn tại trong TOOL_REGISTRY")
    tool = TOOL_REGISTRY[intent]
    required_fields = tool["parameters"].get("required", [])
    example = tool.get("example", "Không có ví dụ cụ thể.")
    json_example = tool.get("json", {})

    # arg_list = "\n".join(f"- `{arg}`" for arg in required_fields)
    # json_str = (
    #     "{\n"
    #     f'  "function": "{intent}",\n'
    #     f'  "args": {{\n'
    #     + ",\n".join(f'    "{arg}": "..."' for arg in required_fields) +
    #     "\n  }\n}"
    # )

    if required_fields:
        arg_list = "\n".join(f"- `{arg}`" for arg in required_fields)
        json_str = (
            "{\n"
            f'  "function": "{intent}",\n'
            f'  "args": {{\n'
            + ",\n".join(f'    "{arg}": "..."' for arg in required_fields) +
            "\n  }\n}"
        )
    else:
        arg_list = "(không có)"
        json_str = (
            '{\n'
            f'  "function": "{intent}",\n'
            '  "args": {}\n'
            '}'
        )


    prompt = f"""Bạn là hệ thống trích xuất tham số để gọi hàm `{intent}`.

Câu người dùng: "{user_message}"

Hãy trích xuất các tham số sau từ câu nói của người dùng:
{arg_list}

Yêu cầu:
- Chỉ lấy tham số nếu người dùng nói rõ ràng. **Không tự suy đoán, không tự tạo hoặc bổ sung thông tin**.
- Các trường **doctor_name, relative_name, medicine_name** phải được tách đầy đủ tên.
- Năm nay là năm 2025.
- Trường **time** phải được tách đầy đủ dưới dạng ngày, tháng, năm nếu có (ví dụ `lúc 7 giờ 30 sáng ngày mai`, `vào 8 giờ sáng thứ ba tuần sau`).
- Trả về kết quả dưới dạng **JSON hợp lệ** (không thêm ```json hoặc ```).
- **Nếu hàm không có tham số**, phải trả về JSON chứa arg rỗng (không thêm bất kỳ arg nào khác).

Định dạng đầu ra:
{json_str}

Ví dụ mẫu:
Người dùng: "{example}"

Trả về:
{json_example}
"""
    return prompt


def build_medical_advice_prompt(user_message: str) -> str:
    return f"""
Bạn là một bác sĩ ảo. Hãy tư vấn sức khỏe dựa trên triệu chứng người dùng mô tả.
Câu hỏi có thể liên quan đến: đau đầu, ho, sốt, tiêu hóa, tim mạch, hô hấp, v.v.
Trả lời rõ ràng, dễ hiểu và khuyến khích khám bác sĩ nếu cần.

Câu hỏi: {user_message}

Trả lời:
"""

def build_app_guide_prompt(user_message: str) -> str:
    return f"""
Bạn là trợ lý hỗ trợ sử dụng ứng dụng.
Hãy hướng dẫn người dùng cách sử dụng các tính năng trong app như: tạo lịch nhắc thuốc, đặt khám, xem hồ sơ...
Giải thích đơn giản, rõ ràng, đúng tính năng trong hệ thống.

Câu hỏi: {user_message}

Hướng dẫn:
"""


from llm_engine.web_search import search_medical_web

def build_medical_advice_prompt_with_search(user_message: str) -> str:
    web_contexts = search_medical_web(user_message)

    if not web_contexts:
        return build_medical_advice_prompt(user_message)

    context_text = "\n".join([f"{i+1}. {s}" for i, s in enumerate(web_contexts)])

    return f"""
Người dùng hỏi: "{user_message}"

Dưới đây là các thông tin tham khảo từ Internet:
{context_text}

Hãy trả lời câu hỏi một cách ngắn gọn, chính xác và thân thiện như một bác sĩ tư vấn sức khỏe.
"""
