from preprocessing import load_dataset, preprocess

from sklearn.model_selection import StratifiedKFold, cross_validate

from sklearn.ensemble import RandomForestClassifier

from xgboost import XGBClassifier

import numpy as np


# =========================================
# Load Dataset
# =========================================

df = load_dataset("data/pcos.xlsx")

X, y = preprocess(df)


# =========================================
# Cross Validation
# =========================================

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)


# =========================================
# Models
# =========================================

models = {

    "Random Forest": RandomForestClassifier(
        n_estimators=300,
        max_depth=5,
        min_samples_leaf=2,
        min_samples_split=5,
        random_state=42,
        class_weight="balanced"
    ),

    "XGBoost": XGBClassifier(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.03,
        min_child_weight=5,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42,
        eval_metric="logloss"
    )
}


# =========================================
# Metrics
# =========================================

scoring = {
    "accuracy": "accuracy",
    "precision": "precision",
    "recall": "recall",
    "f1": "f1",
    "roc_auc": "roc_auc"
}


# =========================================
# Compare Models
# =========================================

print("\n========================================")
print("      PCOS MODEL COMPARISON")
print("========================================\n")

for name, model in models.items():

    print(f"\n========== {name.upper()} ==========\n")

    results = cross_validate(
        model,
        X,
        y,
        cv=cv,
        scoring=scoring,
        n_jobs=-1
    )

    for metric in scoring:

        scores = results[f"test_{metric}"]

        mean = np.mean(scores)
        std = np.std(scores)

        print(
            f"{metric.upper():10}: "
            f"{mean:.4f} ± {std:.4f}"
        )


print("\n========================================")
print("       COMPARISON COMPLETE")
print("========================================")