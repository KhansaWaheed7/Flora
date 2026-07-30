import pandas as pd


FEATURE_COLUMNS = [
    "Age (yrs)",
    "BMI",
    "Cycle length(days)",
    "Cycle(R/I)",
    "Weight gain(Y/N)",
    "Pimples(Y/N)",
    "Hair loss(Y/N)",
    "hair growth(Y/N)",
    "Skin darkening (Y/N)",
    "Reg.Exercise(Y/N)",
    "Fast food (Y/N)"
]

TARGET_COLUMN = "PCOS (Y/N)"


def load_dataset(path):

    df = pd.read_excel(
        path,
        sheet_name="Full_new"
    )

    # Remove leading/trailing spaces from every column
    df.columns = df.columns.str.strip()

    return df

def preprocess(df):

    df = df.copy()

    df = df[FEATURE_COLUMNS + [TARGET_COLUMN]]

    df = df.dropna()

    # Regular Exercise
    df["Reg.Exercise(Y/N)"] = (
        df["Reg.Exercise(Y/N)"]
        .astype(int)
    )

    # Binary columns
    binary_columns = [
        "Weight gain(Y/N)",
        "Pimples(Y/N)",
        "Hair loss(Y/N)",
        "hair growth(Y/N)",
        "Skin darkening (Y/N)",
        "Fast food (Y/N)"
    ]

    for col in binary_columns:
        df[col] = df[col].astype(int)

    # Cycle(R/I)
    # R = Regular
    # I = Irregular

    df["Cycle(R/I)"] = (
        df["Cycle(R/I)"]
        .map({
            "R": 0,
            "I": 1
        })
    )

    X = df[FEATURE_COLUMNS]

    y = df[TARGET_COLUMN]

    return X, y