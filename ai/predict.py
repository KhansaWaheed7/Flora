import joblib
import pandas as pd

model_data = joblib.load("models/pcos_model.pkl")

model = model_data["model"]

feature_names = model_data["features"]


FEATURE_LABELS = {
    "Age (yrs)": "Age",
    "BMI": "High BMI",
    "Cycle length(days)": "Long menstrual cycle",
    "Cycle(R/I)": "Irregular menstrual cycles",
    "Weight gain(Y/N)": "Weight gain",
    "Pimples(Y/N)": "Acne",
    "Hair loss(Y/N)": "Hair loss",
    "hair growth(Y/N)": "Excessive hair growth",
    "Skin darkening (Y/N)": "Dark skin patches",
    "Reg.Exercise(Y/N)": "Lack of regular exercise",
    "Fast food (Y/N)": "Frequent fast-food consumption",
}


def predict(features):

    df = pd.DataFrame([features])

    prediction = bool(model.predict(df)[0])

    probability = float(model.predict_proba(df)[0][1])

    confidence = round(probability * 100)

    if probability >= 0.70:
        risk = "High"
    elif probability >= 0.40:
        risk = "Medium"
    else:
        risk = "Low"

    importances = model.feature_importances_

    ranked = sorted(
        zip(feature_names, importances),
        key=lambda x: x[1],
        reverse=True
    )

    topFactors = []

    for feature, importance in ranked:

        if features[feature]:

            topFactors.append(
                FEATURE_LABELS[feature]
            )

        if len(topFactors) == 4:
            break

    return {
        "prediction": prediction,
        "probability": round(probability * 100, 2),
        "confidence": confidence,
        "risk": risk,
        "topFactors": topFactors,
    }