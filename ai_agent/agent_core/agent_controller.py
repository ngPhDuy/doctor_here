import json
from llm_engine.llama_chatbot_gguf import ask_tllama, get_bot_response
from llm_engine.intent_classification import classify_intent_llm
from llm_engine.function_router import get_prompt_for_intent
from llm_engine.question_suggestions import suggest_api_intent, suggest_app_guide, suggest_medical
from tools.tool_registry_user import TOOL_REGISTRY_USER
from tools.tool_registry_doctor import TOOL_REGISTRY_DOCTOR
from datetime import datetime, timedelta, time as dtime  # dùng dtime cho datetime.time
import pytz
import os
import re
import requests
import time as pytime
import json

TZ = pytz.timezone("Asia/Ho_Chi_Minh")

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

REL_DAY_MAP = {
    "hôm nay": 0, "hom nay": 0,
    "mai": 1, "ngày mai": 1, "ngay mai": 1,
    "mốt": 2, "ngày mốt": 2, "ngay mot": 2,
    "kia": 3, "ngày kia": 3, "ngay kia": 3,
}

WEEKDAY_MAP = {
    "thứ hai": 0, "thu hai": 0,
    "thứ ba": 1,  "thu ba": 1,
    "thứ tư": 2,  "thu tu": 2,
    "thứ năm": 3, "thu nam": 3,
    "thứ sáu": 4, "thu sau": 4,
    "thứ bảy": 5, "thu bay": 5,
    "chủ nhật": 6, "chu nhat": 6,
}

# Giờ mặc định khi chỉ nói 'sáng/chiều/tối/đêm' mà không kèm số giờ
BUOI_DEFAULT_START = {
    "sáng": (7, 0),    # 07:00
    "chiều": (13, 0),  # 13:00
    "tối": (19, 0),    # 19:00
    "đêm": (22, 0),    # 22:00 (tuỳ chỉnh)
}

# Mốc kết thúc mặc định của mỗi "buổi"
BUOI_DEFAULT_END = {
    "sáng": (11, 59, 59),   # đến ~12h
    "chiều": (17, 59, 59),  # đến ~18h
    "tối": (21, 59, 59),    # đến ~22h
    "đêm": (23, 59, 59),    # đến hết ngày
}

# bắt các chuỗi ISO thiếu giây → chuẩn hoá HH:MM:SS
ISO_RE = re.compile(r"\b(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?\b")

# ================== TIỆN ÍCH PHÂN TÍCH THỜI GIAN ==================
def _normalize_iso(s: str) -> str:
    if not s:
        return s
    m = ISO_RE.search(s.strip())
    if not m:
        return s.strip()
    y, mth, d, hh, mm, ss = m.groups()
    return f"{y}-{mth}-{d}T{hh}:{mm}:{ss or '00'}"

def _adjust_hour_by_buoi(hour: int, buoi: str | None) -> int:
    if not buoi:
        return hour
    b = buoi.lower()
    if b == "sáng":
        return hour
    if b in ("chiều", "tối"):
        return hour + 12 if hour < 12 else hour
    if b == "đêm":
        # tuỳ ngữ cảnh: thường 0–4h hoặc late-night 23h, ở đây giữ nguyên input
        return hour
    return hour

def _resolve_relative_date(raw: str, base_dt: datetime):
    raw_l = raw.lower()
    for key in sorted(REL_DAY_MAP.keys(), key=len, reverse=True):
        if key in raw_l:
            return (base_dt + timedelta(days=REL_DAY_MAP[key])).date()
    return None

def _parse_ddmm_or_relative(raw: str, base_dt: datetime):
    """
    Trả về (YYYY, M, D) từ:
    - 'ngày dd/mm' (có thể kèm /yyyy)
    - hoặc các từ tương đối (hôm nay/mai/mốt/kia)
    """
    rel = _resolve_relative_date(raw, base_dt)
    if rel:
        return rel.year, rel.month, rel.day

    m = re.search(r"(?:ngày\s+)?(\d{1,2})/(\d{1,2})(?:/(\d{4}))?", raw, flags=re.IGNORECASE)
    if m:
        dd, mm, yyyy = int(m.group(1)), int(m.group(2)), int(m.group(3) or base_dt.year)
        return yyyy, mm, dd

    return None

def _parse_vi_range(raw: str, base_dt: datetime):
    pat = re.compile(
        r"từ\s+(\d{1,2})(?::|h)?(\d{2})?\s*(sáng|chiều|tối|đêm)?\s*"
        r"đến\s+(\d{1,2})(?::|h)?(\d{2})?\s*(sáng|chiều|tối|đêm)?",
        flags=re.IGNORECASE
    )
    m = pat.search(raw)
    if not m:
        return None

    sh, sm, s_buoi, eh, em, e_buoi = m.groups()
    sh, eh = int(sh), int(eh)
    sm = int(sm) if sm else 0
    em = int(em) if em else 0

    # Thử bắt ngày từ cụm "thứ ... tuần ..."
    date_info = _parse_vi_weekday(raw, base_dt)
    if date_info:
        yyyy, mm, dd = date_info
    else:
        # fallback: dd/mm hoặc hôm nay/mai/mốt/kia
        date_info = _parse_ddmm_or_relative(raw, base_dt)
        if date_info:
            yyyy, mm, dd = date_info
        else:
            yyyy, mm, dd = base_dt.year, base_dt.month, base_dt.day

    sh = _adjust_hour_by_buoi(sh, s_buoi)
    eh = _adjust_hour_by_buoi(eh, e_buoi)

    start_iso = f"{yyyy:04d}-{mm:02d}-{dd:02d}T{sh:02d}:{sm:02d}:00"
    end_iso   = f"{yyyy:04d}-{mm:02d}-{dd:02d}T{eh:02d}:{em:02d}:00"
    return start_iso, end_iso


def _monday_of_week(base_dt: datetime):
    """
    Trả về date của THỨ HAI trong tuần chứa base_dt (theo ISO: Mon=0).
    """
    return (base_dt - timedelta(days=base_dt.weekday())).date()

def _resolve_week_shift(token: str | None) -> int:
    if not token:
        return 0  # tuần này
    t = token.lower()
    if t in ("nay", "này"):
        return 0
    if t in ("tới", "toi", "sau"):   # 'tuần tới' == tuần sau
        return 1
    if t == "trước":
        return -1
    return 0

# Regex: "thứ ... (tuần (này|sau|trước))?" / "chủ nhật ..."
WEEK_TOKEN_RE = re.compile(
    r"(thứ\s+(hai|ba|tư|tu|năm|nam|sáu|sau|bảy|bay)|chủ\s+nhật|chu\s+nhat)"
    r"(?:\s+(?:tuần\s+)?(này|nay|tới|toi|sau|trước))?",
    flags=re.IGNORECASE
)

def _normalize_day_key(text: str) -> str:
    # Chuẩn hóa để map: tư->tu, năm->nam, sáu->sau, chủ->chu, nhật->nhat
    t = re.sub(r"\s+", " ", text.lower()).strip()
    t = t.replace("tư", "tu").replace("năm", "nam").replace("sáu", "sau")
    t = t.replace("chủ", "chu").replace("nhật", "nhat")
    return t

def _parse_vi_weekday(raw: str, base_dt: datetime):
    """
    'thứ hai (tuần này|sau|trước)', 'chủ nhật', ...
    -> (YYYY, M, D) hoặc None
    """
    m = WEEK_TOKEN_RE.search(raw)
    if not m:
        return None

    full_token = m.group(1)  # "thứ hai" / "chủ nhật" ...
    week_word  = m.group(3)  # "này|sau|trước" hoặc None

    # xác định thứ mục tiêu
    day_key_norm = _normalize_day_key(full_token)
    target_wd = None
    for k, v in WEEKDAY_MAP.items():
        if _normalize_day_key(k) == day_key_norm:
            target_wd = v
            break
    if target_wd is None:
        return None

    # xác định tuần mục tiêu
    week_shift = _resolve_week_shift(week_word)
    monday_cur = _monday_of_week(base_dt)                 # date: thứ hai tuần hiện tại
    monday_target = monday_cur + timedelta(weeks=week_shift)
    target_date = monday_target + timedelta(days=target_wd)

    return target_date.year, target_date.month, target_date.day

def _parse_weekday_range(raw: str, base_dt: datetime):
    """
    'từ thứ hai đến thứ sáu (tuần này|sau|trước)' -> (start_iso, end_iso)
    """
    pat = re.compile(
        r"từ\s+(thứ\s+(hai|ba|tư|tu|năm|nam|sáu|sau|bảy|bay)|chủ\s+nhật|chu\s+nhat)"
        r"\s+đến\s+(thứ\s+(hai|ba|tư|tu|năm|nam|sáu|sau|bảy|bay)|chủ\s+nhật|chu\s+nhat)"
        r"(?:\s+tuần\s+(này|nay|sau|trước))?",
        flags=re.IGNORECASE
    )
    m = pat.search(raw)
    if not m:
        return None

    start_token = m.group(1)
    end_token   = m.group(3)
    week_word   = m.group(5)

    # Gắn "tuần X" vào từng vế nếu có
    suffix = f" tuần {week_word}" if week_word else ""
    d1 = _parse_vi_weekday(start_token + suffix, base_dt)
    d2 = _parse_vi_weekday(end_token   + suffix, base_dt)
    if not d1 or not d2:
        return None

    y1, m1, d_1 = d1
    y2, m2, d_2 = d2
    start_iso = f"{y1:04d}-{m1:02d}-{d_1:02d}T00:00:00"
    end_iso   = f"{y2:04d}-{m2:02d}-{d_2:02d}T23:59:59"
    return start_iso, end_iso

def _parse_buoi_weekday_range(raw: str, base_dt: datetime):
    """
    Ví dụ:
      - 'từ chiều thứ hai đến sáng thứ ba tuần tới'
      - 'từ tối thứ bảy đến đêm chủ nhật tuần trước'
    Trả về (start_iso, end_iso)
    """
    pat = re.compile(
        r"từ\s+(sáng|chiều|tối|đêm)\s+"
        r"(thứ\s+(hai|ba|tư|tu|năm|nam|sáu|sau|bảy|bay)|chủ\s+nhật|chu\s+nhat)"
        r"\s+đến\s+(sáng|chiều|tối|đêm)\s+"
        r"(thứ\s+(hai|ba|tư|tu|năm|nam|sáu|sau|bảy|bay)|chủ\s+nhật|chu\s+nhat)"
        r"(?:\s+tuần\s+(này|nay|tới|toi|sau|trước))?",
        flags=re.IGNORECASE
    )
    m = pat.search(raw)
    if not m:
        return None

    s_buoi, s_day_token, _, e_buoi, e_day_token, _, week_word = m.groups()

    # ngày bắt đầu/kết thúc theo thứ + tuần
    s_date = _parse_vi_weekday(f"{s_day_token} {'tuần ' + week_word if week_word else ''}", base_dt)
    e_date = _parse_vi_weekday(f"{e_day_token} {'tuần ' + week_word if week_word else ''}", base_dt)
    if not s_date or not e_date:
        return None

    sy, sm, sd = s_date
    ey, em, ed = e_date

    # giờ mặc định theo 'buổi'
    sh, smin = BUOI_DEFAULT_START[s_buoi.lower()]
    eh, emin, esec = BUOI_DEFAULT_END[e_buoi.lower()]

    start_iso = f"{sy:04d}-{sm:02d}-{sd:02d}T{sh:02d}:{smin:02d}:00"
    end_iso   = f"{ey:04d}-{em:02d}-{ed:02d}T{eh:02d}:{emin:02d}:{esec:02d}"
    return start_iso, end_iso

# ================== API PHÂN TÍCH THỜI GIAN ==================
def _fallback_llm_parse(raw_time_string: str, now: datetime) -> str:
    """
    Gọi LLM theo format cũ để lấy {"start_time","end_time"}; trả về nguyên chuỗi phản hồi (JSON string).
    """
    prompt = f"""
Bạn là công cụ phân tích thời gian tiếng Việt.
Trả về DUY NHẤT một JSON hợp lệ:
{{"start_time":"YYYY-MM-DDTHH:MM:SS","end_time":"YYYY-MM-DDTHH:MM:SS"}}

Quy ước:
- Định dạng ngày Việt Nam dd/mm; nếu dùng từ tương đối (hôm nay/mai/mốt/kia), hiểu theo ngày gốc là {now.strftime('%d/%m/%Y')}.
- Múi giờ: Asia/Ho_Chi_Minh.
- Nếu là khoảng “từ … đến …” → start_time = mốc đầu, end_time = mốc cuối.
- Chỉ trả về JSON, không kèm chữ nào khác.

Chuỗi đầu vào: "{raw_time_string}"
""".strip()

    payload = {"model": "gemma3:12b", "prompt": prompt, "stream": False}
    public_url = os.getenv("GEMMA_API_URL")
    resp = requests.post(f"{public_url}/api/generate", json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return (data.get("response") or "").strip()

def parse_time_to_iso(raw_time_string: str) -> str:
    now = datetime.now(TZ)

    # (1) Buổi + thứ + tuần
    rng = _parse_buoi_weekday_range(raw_time_string, now)
    if rng:
        return rng[0]

    # (2) Khoảng theo thứ (không buổi)
    rng = _parse_weekday_range(raw_time_string, now)
    if rng:
        return rng[0]

    # (3) Một ngày theo thứ
    wd = _parse_vi_weekday(raw_time_string, now)
    if wd:
        y, mth, d = wd
        return f"{y:04d}-{mth:02d}-{d:02d}T00:00:00"

    # (4) Khoảng theo giờ có số + dd/mm / relative
    rng = _parse_vi_range(raw_time_string, now)
    if rng:
        return rng[0]

    # (5) Fallback LLM (giữ nguyên như bạn đang dùng)
    try:
        txt = _fallback_llm_parse(raw_time_string, now)
        obj = json.loads(txt) if txt.startswith("{") else json.loads(re.search(r"\{.*\}", txt, re.S).group(0))
        st = obj.get("start_time")
        if isinstance(st, dict):
            st = st.get("start_time") or st.get("value") or st.get("iso")
        return _normalize_iso(st) if isinstance(st, str) else txt
    except Exception:
        return raw_time_string

def parse_time_range_to_iso(raw_time_string: str) -> dict:
    now = datetime.now(TZ)

    # (1) Buổi + thứ + tuần (ví dụ: "từ chiều thứ hai đến sáng thứ ba tuần tới")
    rng = _parse_buoi_weekday_range(raw_time_string, now)
    if rng:
        return {"start_time": _normalize_iso(rng[0]), "end_time": _normalize_iso(rng[1])}

    # (2) Khoảng theo giờ có số + (dd/mm | hôm nay/mai/mốt | thứ ... (tới/sau/trước))
    rng = _parse_vi_range(raw_time_string, now)
    if rng:
        return {"start_time": _normalize_iso(rng[0]), "end_time": _normalize_iso(rng[1])}

    # (3) Khoảng theo thứ (không buổi → 00:00–23:59:59)
    rng = _parse_weekday_range(raw_time_string, now)
    if rng:
        return {"start_time": _normalize_iso(rng[0]), "end_time": _normalize_iso(rng[1])}

    # (4) Một ngày theo thứ (không giờ → 00:00–23:59:59)
    wd = _parse_vi_weekday(raw_time_string, now)
    if wd:
        y, mth, d = wd
        return {
            "start_time": f"{y:04d}-{mth:02d}-{d:02d}T00:00:00",
            "end_time":   f"{y:04d}-{mth:02d}-{d:02d}T23:59:59",
        }

    # (5) Fallback LLM
    try:
        txt = _fallback_llm_parse(raw_time_string, now)
        obj = json.loads(txt) if txt.startswith("{") else json.loads(re.search(r"\{.*\}", txt, re.S).group(0))
        st = obj.get("start_time"); et = obj.get("end_time")
        if isinstance(st, dict): st = st.get("start_time") or st.get("value") or st.get("iso")
        if isinstance(et, dict): et = et.get("end_time") or et.get("value") or et.get("iso")
        return {"start_time": _normalize_iso(st), "end_time": _normalize_iso(et)}
    except Exception:
        return {}

def handle_user_message(user_input: str, role: str) -> str:
    start_time = pytime.time()

    # 1) Phân loại ý định & tạo prompt
    intent = classify_intent_llm(user_input, role)
    print(f"Classified intent: {intent}")
    prompt = get_prompt_for_intent(intent, user_input, role)
    print("=== Prompt sent to LLM ===")
    print(prompt)

    # 2) Gọi model sinh trả lời tự nhiên
    model_output = ask_tllama(prompt)

    # 3) Các intent đặc thù (không gọi tool)
    if intent == "medical_advice":
        parsed_json_result = {
            "function": "medical_advice",
            "message": user_input,
            "reply": model_output.strip(),
            "suggestions": suggest_medical(role, user_input, 3)
        }
        print(parsed_json_result)
        return parsed_json_result

    if intent == "app_guide":
        parsed_json_result = {
            "function": "app_guide",
            "message": user_input,
            "reply": model_output.strip(),
            "suggestions": suggest_app_guide(role, user_input, 3)
        }
        print(parsed_json_result)
        return parsed_json_result

    # 4) Chuẩn hoá output model về JSON tool-call
    cleaned_output = re.sub(r"^```(?:json)?\s*|\s*```$", "", model_output.strip(), flags=re.MULTILINE).strip()
    try:
        parsed = json.loads(cleaned_output)
    except Exception as e:
        return {
            "reply": f"⚠️ Không đọc được JSON từ LLM: {e}",
            "raw": cleaned_output
        }

    function_name = parsed.get("function")
    args = parsed.get("args", {}) or {}

    # 5) Chọn registry theo vai trò
    if role == "bs":
        TOOL_REGISTRY = TOOL_REGISTRY_DOCTOR
    elif role == "bn":
        TOOL_REGISTRY = TOOL_REGISTRY_USER
    else:
        TOOL_REGISTRY = {}

    if function_name not in TOOL_REGISTRY:
        return {
            "reply": "⚠️ Hệ thống chưa hỗ trợ hành động bạn yêu cầu.",
            "suggestions": suggest_api_intent(role, intent, user_input, 3)
        }

    # 6) CHỈNH: Ưu tiên parse cả câu để giữ 'buổi' & 'tuần' (07:00/13:00/19:00, 'tuần tới', ...)
    if ("start_time" in args) or ("end_time" in args):
        rng = parse_time_range_to_iso(user_input)
        if rng.get("start_time") and rng.get("end_time"):
            args["start_time"] = rng["start_time"]
            args["end_time"]   = rng["end_time"]
        else:
            # Fallback: parse từng field nếu tool yêu cầu
            for key in ("start_time", "end_time"):
                if key in args and isinstance(args[key], str):
                    parsed_time = parse_time_to_iso(args[key])
                    if parsed_time:
                        args[key] = parsed_time
                    else:
                        return {
                            "reply": f"⚠️ Không thể hiểu {key.replace('_', ' ')} bạn cung cấp. Vui lòng nói rõ ràng hơn.",
                            "suggestions": suggest_api_intent(role, intent, user_input, 3)
                        }
    else:
        # Tool chỉ có một field 'time'
        if "time" in args and isinstance(args["time"], str):
            parsed_time = parse_time_to_iso(args["time"])
            if parsed_time:
                args["time"] = parsed_time
            else:
                return {
                    "reply": "⚠️ Không thể hiểu thời gian bạn cung cấp. Vui lòng nói rõ ràng hơn.",
                    "suggestions": suggest_api_intent(role, intent, user_input, 3)
                }

    # 7) Gọi tool thực thi
    func = TOOL_REGISTRY[function_name]["function"]
    reply = func(**args)

    parsed_json_result = {
        "function": function_name,
        "args": args,
        "message": user_input,
        "reply": reply,
        "suggestions": suggest_api_intent(role, intent, user_input, 3)
    }

    elapsed = pytime.time() - start_time
    print(f"[{pytime.strftime('%H:%M:%S')}] ⏱️ Processing done in {elapsed:.2f} seconds")
    print("=== Model Output ===")
    print(parsed_json_result)

    return parsed_json_result

