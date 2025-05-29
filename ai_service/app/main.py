# app/main.py
from fastapi import FastAPI
from app.model import predict_diabetes
from app.schemas import DiabetesInput, DiabetesOutput

app = FastAPI(title="Diabetes Prediction API")


@app.get("/")
def root():
    return {"message": "Diabetes Prediction API is running."}


@app.post("/predict/diabetes", response_model=DiabetesOutput)
def predict(data: DiabetesInput):
    prediction = predict_diabetes(data.dict())
    return {"prediction": prediction}
