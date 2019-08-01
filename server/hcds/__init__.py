import os

import numpy as np
from flask import Flask, request
from flask_cors import CORS
from joblib import load

from hcds.ml import (
    load_scalers,
    load_models,
    t1_predict_heparin_bolus,
    t2_predict_heparin_bolus_dose,
    t3_predict_heparin_dose_to_aptt_distribution)


app = Flask(__name__)
CORS(app)

STATIC_PATH = os.path.join(app.root_path, "static")

scaler_t1, scaler_t2, scaler_t3 = load_scalers(STATIC_PATH)
model_t1, model_t2, model_t3 = load_models(STATIC_PATH)


@app.route("/t3", methods=["GET"])
def t3():
    raw_data = request.args
    data = {}
    for k, v in raw_data.items():
        data[k] = np.float64(v)

    is_bolus = t1_predict_heparin_bolus(data, scaler_t1, model_t1)

    if is_bolus == 1:
        heparin_dose_bolus = t2_predict_heparin_bolus_dose(data, scaler_t2, model_t2)
    else:
        heparin_dose_bolus = 0.0

    heparin_doses, aptt_distribution = (
        t3_predict_heparin_dose_to_aptt_distribution(
            data,
            scaler_t3,
            model_t3,
            is_bolus,
            heparin_dose_bolus))

    data_points = []
    for i in range(len(heparin_doses)):
        data_points.append({"x": heparin_doses[i], "y": aptt_distribution[i].item()})
    return {"t2": heparin_dose_bolus, "t3": data_points}
