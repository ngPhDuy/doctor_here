import json
from llm_engine.llama_chatbot_gguf import ask_tllama, get_bot_response
from tensorflow import keras
from llm_engine.intent_classification import classify_intent_llm
from llm_engine.function_router import get_prompt_for_intent
from tools.tool_registry_user import TOOL_REGISTRY_USER
from tools.tool_registry_doctor import TOOL_REGISTRY_DOCTOR
from datetime import datetime
import os
import re
import requests

def get_vietnamese_weekday(date: datetime) -> str:
    weekdays = {
        0: "Thứ Hai",
        1: "Thứ Ba",
        2: "Thứ Tư",
        3: "Thứ Năm",
        4: "Thứ Sáu",
        5: "Thứ Bảy",
        6: "Chủ Nhật"
    }
    return weekdays[date.weekday()]

def parse_time_to_iso(raw_time_string: str) -> str:
    today = datetime.now()
    weekday_vn = get_vietnamese_weekday(today)
    prompt = f"""Hãy chuyển đổi chuỗi thời gian sau sang định dạng ISO 8601:
    Chuỗi đầu vào: "{raw_time_string}"
    Ngày hôm nay là {weekday_vn}, ngày {today.strftime('%d/%m/%Y')}, năm nay là năm 2025.
    Lưu ý:
    - Tuần được tính từ **Thứ Hai đến Chủ Nhật** (theo chuẩn ISO 8601).
    - "Thứ X tuần này" là ngày Thứ X gần nhất còn lại trong tuần hiện tại, tính từ Thứ Hai.
    - "Thứ X tuần sau" là ngày Thứ X trong tuần kế tiếp (tính từ Thứ Hai tuần tới).
    - Năm hiện tại là năm 2025.
    - Ví dụ: nếu hôm nay là giữa tuần, "thứ 7 tuần này" vẫn là Thứ Bảy cùng tuần; "thứ 7 tuần sau" là sau 7 ngày nữa.
    Chỉ trả lời bằng chuỗi ISO 8601, không giải thích thêm."""
    print(prompt)
    payload = {
        "model": "gemma3:12b",
        "prompt": prompt,
        "stream": False
    }


    public_url = os.getenv("GEMMA_API_URL") 

    response = requests.post(f"{public_url}/api/generate", json=payload)
    response.raise_for_status() 

    data = response.json()
    output = data.get("response", "").strip()
    return output


def handle_user_message(user_input: str, role: str) -> str:
    intent = classify_intent_llm(user_input, role)
    print(f"Classified intent: {intent}")

    prompt = get_prompt_for_intent(intent, user_input, role)
    print("=== Prompt sent to LLM ===")
    print(prompt)
    model_output = ask_tllama(prompt)
    print("=== Model Output ===")
    print(model_output)

    if intent == "medical_advice" or intent == "app_guide":
        return model_output.strip()  

    cleaned_output = re.sub(r"^```(?:json)?\s*|\s*```$", "", model_output.strip(), flags=re.MULTILINE).strip()

    # 3. Parse JSON và thực thi
    parsed = json.loads(cleaned_output)
    function_name = parsed.get("function")
    args = parsed.get("args", {})

    if role == 'bs':
        TOOL_REGISTRY = TOOL_REGISTRY_DOCTOR
    elif role == 'bn':
        TOOL_REGISTRY = TOOL_REGISTRY_USER

    if function_name not in TOOL_REGISTRY:
        raise ValueError(f"Hàm `{function_name}` không có trong TOOL_REGISTRY")
    
    if "time" in args:
        raw_time = args["time"]
        parsed_time = parse_time_to_iso(raw_time)
        if parsed_time:
            args["time"] = parsed_time
        else:
            return "⚠️ Không thể hiểu thời gian bạn cung cấp. Vui lòng nói rõ ràng hơn."

    func = TOOL_REGISTRY[function_name]["function"]
    reply = func(**args)

    parsed_json_result = {
        "function": function_name,
        "args": args,
        "message": user_input,
        "reply": reply 
    }

    return parsed_json_result

