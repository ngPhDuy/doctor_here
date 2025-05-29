import pandas as pd
import pickle
import numpy as np
import lightgbm as lgb
from sklearn.preprocessing import RobustScaler
import os

# Đường dẫn đến thư mục lưu trữ mô hình và scaler
current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "export", "best_lgbm_model.pkl")
scaler_path = os.path.join(current_dir, "export", "scaler.pkl")

# Load mô hình và scaler
with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(scaler_path, "rb") as f:
    scaler = pickle.load(f)

# Load thứ tự cột đã lưu trước đó
column_order_path = os.path.join(current_dir, "export", "column_order.csv")
column_order_df = pd.read_csv(column_order_path)


def predict_diabetes(data):
    """
    Dự đoán bệnh tiểu đường dựa trên dữ liệu đầu vào.
    """

    # Chuyển dữ liệu đầu vào thành DataFrame
    input_df = pd.DataFrame([data])

    # Các cột cần thiết cho dự đoán
    required_columns = [
        "gender",
        "age",
        "hypertension",
        "heart_disease",
        "smoking_history",
        "bmi",
        "HbA1c_level",
        "blood_glucose_level",
    ]

    # Kiểm tra xem tất cả các cột cần thiết có tồn tại trong dữ liệu đầu vào hay không
    if not all(col in input_df.columns for col in required_columns):
        raise ValueError("Dữ liệu đầu vào thiếu một hoặc nhiều cột bắt buộc.")

    # Tiền xử lý dữ liệu
    # 1. Xử lý giá trị ngoại lai (Clip các giá trị cực đoan)
    input_df["blood_glucose_level"] = input_df["blood_glucose_level"].clip(upper=250)
    input_df["HbA1c_level"] = input_df["HbA1c_level"].clip(upper=8)
    input_df["bmi"] = input_df["bmi"].clip(upper=60)

    # 2. One-hot encode các feature dạng category
    categorical_cols = ["gender", "smoking_history", "hypertension", "heart_disease"]
    input_df = pd.get_dummies(input_df, columns=categorical_cols, drop_first=True)

    # 3. Thêm các cột bị thiếu trong quá trình one-hot encoding
    missing_cols = set(column_order_df["Column_Name"]) - set(input_df.columns)
    for col in missing_cols:
        input_df[col] = 0

    # 4. Đảm bảo thứ tự cột giống với dữ liệu huấn luyện
    input_df = input_df[column_order_df["Column_Name"].tolist()]

    # 5. Scale dữ liệu (Sử dụng scaler đã lưu)
    num_cols = ["age", "bmi", "HbA1c_level", "blood_glucose_level"]
    input_df[num_cols] = scaler.transform(input_df[num_cols])

    print("input_df:\n")
    print(input_df)

    # 6. Dự đoán
    prediction = model.predict(input_df)

    return prediction[0]


# Ví dụ sử dụng hàm dự đoán
# Lưu ý: Thay thế dữ liệu đầu vào bằng dữ liệu thực tế
input_data = {
    "gender": "Female",
    "age": 80,
    "hypertension": 0,
    "heart_disease": 1,
    "smoking_history": "never",
    "bmi": 25.19,
    "HbA1c_level": 6.6,
    "blood_glucose_level": 140,
}

prediction = predict_diabetes(input_data)
print(f"Dự đoán: {prediction}")
