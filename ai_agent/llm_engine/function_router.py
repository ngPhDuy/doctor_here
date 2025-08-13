
from llm_engine.prompt_templates import (
    build_function_call_prompt,
    build_medical_advice_prompt,
    build_medical_advice_prompt_with_search
)


from llm_engine.llama_chatbot_gguf import get_bot_response

def get_prompt_for_intent(intent: str, user_message: str, role) -> str:
    if intent == "medical_advice":
        return build_medical_advice_prompt_with_search(user_message)
    elif intent == "app_guide":
        return get_bot_response(user_message)
    else:
        return build_function_call_prompt(intent, user_message, role)
