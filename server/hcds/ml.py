import os
from copy import deepcopy

import numpy as np
from joblib import load


def load_scalers(static_path):
    scaler_t1 = load(os.path.join(static_path, "ml", "scalers", "t1.joblib"))
    scaler_t2 = load(os.path.join(static_path, "ml", "scalers", "t2.joblib"))
    scaler_t3 = load(os.path.join(static_path, "ml", "scalers", "t3.joblib"))
    return (scaler_t1, scaler_t2, scaler_t3)


def load_models(static_path):
    model_t1 = load(os.path.join(static_path, "ml", "models", "t1.joblib"))
    model_t2 = load(os.path.join(static_path, "ml", "models", "t2.joblib"))
    model_t3 = load(os.path.join(static_path, "ml", "models", "t3.joblib"))
    return (model_t1, model_t2, model_t3)


def t1_predict_heparin_bolus(data, scaler, model):
    features = [
        data["gender"],
        data["age"],
        data["weight"],
        data["height"],
        round(data["bmi"], 1),
        data["apttPrev"],
        data["pt"],
        data["plateletCount"],
        data["hemoglobin"],
        round(data["hematocrit"], 1),
        data["bilirubin"],
        data["creatinine"]
    ]
    X = [features]
    X_scaled = scaler.transform(X)
    y = model.predict(X_scaled)
    return y


def t2_predict_heparin_bolus_dose(data, scaler, model):
    low = 500
    high = 5000
    step = 500
    features = [
        data["gender"],
        data["age"],
        data["weight"],
        data["height"],
        round(data["bmi"], 1),
        data["apttPrev"],
        data["apttInterval"],
        0,  # Index 7.
        data["pt"],
        data["plateletCount"],
        data["hemoglobin"],
        round(data["hematocrit"], 1),
        data["bilirubin"],
        data["creatinine"]
    ]
    X = []
    bolus_heparin_doses = [i for i in range(low, high + step, step)]
    for b in bolus_heparin_doses:
        tmp = deepcopy(features)
        tmp[7] = b
        X.append(tmp)
    X_scaled = scaler.transform(X)
    y = model.predict(X_scaled)
    # Suggest the first predicted value that results in the therapeutic range.
    selected_value = None
    for i in range(len(y)):
        if y[i] >= 60 and y[i] <= 80:
            selected_value = bolus_heparin_doses[i]
            break
    # Otherwise suggest the value that leads to the highest APTT.
    if selected_value is None:
        selected_value = bolus_heparin_doses[np.argmax(y)]
    return selected_value


def t3_predict_heparin_dose_to_aptt_distribution(
        data, scaler, model, is_bolus, heparin_dose_bolus):
    low = 300
    high = 3000
    step = 1
    features = [
        data["gender"],
        data["age"],
        data["weight"],
        data["height"],
        round(data["bmi"], 1),
        data["apttPrev"],
        data["apttInterval"],
        0,  # Index 7.
        is_bolus,
        heparin_dose_bolus,
        data["pt"],
        data["plateletCount"],
        data["hemoglobin"],
        round(data["hematocrit"], 1),
        data["bilirubin"],
        data["creatinine"]
    ]
    X = []
    heparin_doses = [i for i in range(low, high + step, step)]
    for heparin_dose in heparin_doses:
        tmp = deepcopy(features)
        tmp[7] = heparin_dose
        X.append(tmp)
    X_scaled = scaler.transform(X)
    y = model.predict(X_scaled)
    return heparin_doses, y
