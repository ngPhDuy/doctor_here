import json
import os
import numpy as np
import torch
import pickle
from transformers import AutoTokenizer, AutoModel
from concurrent.futures import ThreadPoolExecutor

# ======== CẤU HÌNH ========
INTENT_FILES = {
    'book_appointment': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/book_appointment.json',
    'cancel_appointment': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/cancel_appointment.json',
    'get_doctor_info': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_doctor_info.json',
    'create_reminder': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/create_reminder.json',
    'medical_advice': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/medical_advice.json',
    'app_guide': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/app_guide.json',
    'get_medicine': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_medicine.json',
    'get_medicine_schedule': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_medicine_schedule.json',
    'get_appointment': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_appointment.json',
    'get_detail_appointment': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_detail_appointment.json',
    'get_detail_diagnosis_patient': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_detail_diagnosis_patient.json',
    'get_appointment_by_time': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_appointment_by_time.json',
    'get_upcoming_appointment': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_upcoming_appointment.json',
    'get_all_diagnosis_results': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_all_diagnosis_results.json',
    'get_doctor_list': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_doctor_list.json',
    'get_doctor_specialization': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_doctor_specialization.json',
    'get_love_list': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_love_list.json',
    'delete_love_list': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/delete_love_list.json',
    'add_love_list': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/add_love_list.json',
    'connect_to_chat': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/connect_to_chat.json',
    'get_relatives': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/get_relatives.json',
    'add_relative': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/add_relative.json',
    'delete_relative': '/Users/letrunghieu/Documents/ai-agent/llm_engine/med_data/intent_user/delete_relative.json',
}
CACHE_PATH = "vectorstore/intent_vectors.pkl"

# ======== LOAD MÔ HÌNH EMBEDDING ========
print("Loading tokenizer and model...")
tokenizer = AutoTokenizer.from_pretrained('VoVanPhuc/sup-SimCSE-VietNamese-phobert-base')
model = AutoModel.from_pretrained('VoVanPhuc/sup-SimCSE-VietNamese-phobert-base')
model.eval()

# ======== HÀM XỬ LÝ ========
def load_json_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_embedding(text):
    inputs = tokenizer(text, return_tensors='pt', padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        output = model(**inputs).last_hidden_state.mean(dim=1)
    return output.squeeze().numpy()   

def process_sentences(file_path):
    data = load_json_file(file_path)
    sentences = data['sentences']
    embeddings = [get_embedding(sentence) for sentence in sentences]
    return np.array(embeddings)

def build_vectorstore():
    print("Building vectorstore...")
    with ThreadPoolExecutor(max_workers=5) as executor:
        results = executor.map(process_sentences, INTENT_FILES.values())
    vector_dict = dict(zip(INTENT_FILES.keys(), results))
    return vector_dict

def save_vectorstore(vectors, cache_file=CACHE_PATH):
    with open(cache_file, 'wb') as f:
        pickle.dump(vectors, f)
    print(f"✅ Vectorstore saved to {cache_file}")

# ======== CHẠY ========
if __name__ == "__main__":
    vectors = build_vectorstore()
    save_vectorstore(vectors)
