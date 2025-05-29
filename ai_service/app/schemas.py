# app/schemas.py
from pydantic import BaseModel


class DiabetesInput(BaseModel):
    gender: str
    age: int
    hypertension: int
    heart_disease: int
    smoking_history: str
    bmi: float
    HbA1c_level: float
    blood_glucose_level: float


class DiabetesOutput(BaseModel):
    prediction: float
