from preprocessing import load_dataset
from preprocessing import preprocess
from preprocessing import FEATURE_COLUMNS

from sklearn.model_selection import train_test_split

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

import joblib
import os


# =========================================
# Load Dataset
# =========================================

df = load_dataset("data/pcos.xlsx")

X, y = preprocess(df)


# =========================================
# Train / Test Split
# =========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# =========================================
# Final Random Forest Model
# =========================================

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=5,
    min_samples_leaf=2,
    min_samples_split=5,
    class_weight="balanced",
    random_state=42
)


# =========================================
# Train
# =========================================

model.fit(
    X_train,
    y_train
)


# =========================================
# Predictions
# =========================================

predictions = model.predict(X_test)

probabilities = model.predict_proba(X_test)[:, 1]


# =========================================
# Evaluation
# =========================================

accuracy = accuracy_score(
    y_test,
    predictions
)

precision = precision_score(
    y_test,
    predictions
)

recall = recall_score(
    y_test,
    predictions
)

f1 = f1_score(
    y_test,
    predictions
)

roc = roc_auc_score(
    y_test,
    probabilities
)

cm = confusion_matrix(
    y_test,
    predictions
)


# =========================================
# Print Results
# =========================================

print("\n========== FINAL RANDOM FOREST EVALUATION ==========\n")

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1 Score : {f1:.4f}")
print(f"ROC AUC  : {roc:.4f}")

print("\nConfusion Matrix")
print(cm)

print("\nClassification Report")

print(
    classification_report(
        y_test,
        predictions
    )
)


# =========================================
# Save Model
# =========================================

os.makedirs(
    "models",
    exist_ok=True
)

model_data = {
    "model": model,
    "features": FEATURE_COLUMNS
}

joblib.dump(
    model_data,
    "models/pcos_model.pkl"
)

print("\nModel saved successfully.")