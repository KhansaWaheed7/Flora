import joblib
import pandas as pd
import shap


# =====================================
# Load trained model
# =====================================

model_data = joblib.load("models/pcos_model.pkl")

model = model_data["model"]

feature_names = model_data["features"]


# =====================================
# Feature labels for Flora
# =====================================

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


# =====================================
# SHAP Explainer
# =====================================

explainer = shap.TreeExplainer(model)


# =====================================
# Prediction
# =====================================

def predict(features):

    # Keep feature order exactly the same
    df = pd.DataFrame(
        [features],
        columns=feature_names
    )

    # ---------------------------------
    # Model prediction
    # ---------------------------------

    prediction = bool(model.predict(df)[0])

    probability = float(
        model.predict_proba(df)[0][1]
    )

    probability_percent = round(
        probability * 100,
        2
    )

    # ---------------------------------
    # Confidence
    # ---------------------------------

    confidence = round(
        probability * 100,
        2
    )

    # ---------------------------------
    # Risk classification
    # ---------------------------------

    SCREENING_THRESHOLD = 0.4779

    if probability >= 0.70:

        risk = "High"

    elif probability >= SCREENING_THRESHOLD:

        risk = "Medium"

    else:

        risk = "Low"

    # ---------------------------------
    # SHAP explanation
    # ---------------------------------

    shap_values = explainer.shap_values(df)

# SHAP 0.52+ returns:
# (samples, features, classes)
#
# We need the PCOS class = class 1.

    if isinstance(shap_values, list):
        values = shap_values[1][0]
    elif len(shap_values.shape) == 3:
        values = shap_values[0, :, 1]
    else:
        values = shap_values[0]
    # ---------------------------------
    # Rank individual contributions
    # ---------------------------------

    contributions = list(
        zip(
            feature_names,
            values
        )
    )

    contributions.sort(
        key=lambda x: abs(x[1]),
        reverse=True
    )

    # ---------------------------------
    # Top factors contributing
    # towards PCOS prediction
    # ---------------------------------

    topFactors = []

    for feature, contribution in contributions:

        # Positive SHAP contribution
        # means this feature pushed the
        # prediction towards PCOS.

        if contribution > 0:

            topFactors.append({
            "factor": FEATURE_LABELS[feature],
            "impact": "positive",
            "shapValue": round(float(contribution), 4)
        })

        if len(topFactors) == 4:

            break

    return {

        "prediction": prediction,

        "probability": probability_percent,

        "confidence": confidence,

        "risk": risk,

        "topFactors": topFactors,

    }