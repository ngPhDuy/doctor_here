# app/model.py
import pandas as pd
import pickle
import numpy as np
import lightgbm as lgb
from sklearn.preprocessing import RobustScaler
import os

current_dir = os.path.dirname(__file__)
model_path = os.path.join(current_dir, "..", "export", "best_lgbm_model.pkl")
scaler_path = os.path.join(current_dir, "..", "export", "scaler.pkl")
column_order_path = os.path.join(current_dir, "..", "export", "column_order.csv")

with open(model_path, "rb") as f:
    model = pickle.load(f)

with open(scaler_path, "rb") as f:
    scaler = pickle.load(f)

column_order_df = pd.read_csv(column_order_path)


def predict_diabetes(data: dict) -> float:
    input_df = pd.DataFrame([data])
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

    if not all(col in input_df.columns for col in required_columns):
        raise ValueError("Missing required input fields.")

    input_df["blood_glucose_level"] = input_df["blood_glucose_level"].clip(upper=250)
    input_df["HbA1c_level"] = input_df["HbA1c_level"].clip(upper=8)
    input_df["bmi"] = input_df["bmi"].clip(upper=60)

    categorical_cols = ["gender", "smoking_history", "hypertension", "heart_disease"]
    input_df = pd.get_dummies(input_df, columns=categorical_cols, drop_first=True)

    missing_cols = set(column_order_df["Column_Name"]) - set(input_df.columns)
    for col in missing_cols:
        input_df[col] = 0

    input_df = input_df[column_order_df["Column_Name"].tolist()]
    num_cols = ["age", "bmi", "HbA1c_level", "blood_glucose_level"]
    input_df[num_cols] = scaler.transform(input_df[num_cols])

    prediction = model.predict(input_df)
    return float(prediction[0])
