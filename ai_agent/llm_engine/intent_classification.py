import pickle
from keras.layers import TFSMLayer
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModel
import pickle
from huggingface_hub import login
import tensorflow as tf
import os

login(os.getenv("HUGGING_KEY"))

def load_model_and_encoder(role: str = "user"):
    if role == "bs":
        model_path = "models/intent-classifier/intent-classifier-doctor"
        encoder_path = "models/intent-classifier/intent-classifier-doctor/label_encoder_doctor.pkl"
    else:
        model_path = "models/intent-classifier/intent-classifier-user"
        encoder_path = "models/intent-classifier/intent-classifier-user/label_encoder_user.pkl"

    model = TFSMLayer(model_path, call_endpoint="serving_default")
    with open(encoder_path, "rb") as f:
        label_encoder = pickle.load(f)
    return model, label_encoder

# GTE EMBEDDING
def get_gte_embedding(text: str) -> np.ndarray:
    _tokenizer = AutoTokenizer.from_pretrained("Alibaba-NLP/gte-multilingual-base", trust_remote_code=True)
    _gte_model = AutoModel.from_pretrained("Alibaba-NLP/gte-multilingual-base", trust_remote_code=True)

    inputs = _tokenizer(text, return_tensors='pt', padding=True, truncation=True)
    with torch.no_grad():
        outputs = _gte_model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings.numpy()
# ------------------ CLASSIFY INTENT ------------------

def classify_intent_llm(user_message: str, role: str) -> str:
    model, label_encoder = load_model_and_encoder(role)

    embedding = get_gte_embedding(user_message)
    
    # Chuyển numpy -> tensor float32
    embedding_tensor = tf.convert_to_tensor(embedding, dtype=tf.float32)

    # Gọi trực tiếp như hàm
    output = model(embedding_tensor)

    # Nếu output là dict (vì dùng signature)
    if isinstance(output, dict):
        prediction = next(iter(output.values())).numpy()
    else:
        prediction = output.numpy()

    predicted_index = np.argmax(prediction, axis=1)[0]
    predicted_intent = label_encoder.inverse_transform([predicted_index])[0]
    return predicted_intent
