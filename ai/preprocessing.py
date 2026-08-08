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

    # Convert all selected columns to numeric
    for col in FEATURE_COLUMNS + [TARGET_COLUMN]:
        df[col] = pd.to_numeric(df[col], errors="coerce")

    # Remove rows with missing values
    df = df.dropna()

    # Keep Cycle(R/I) as the dataset's original numeric encoding
    # Dataset values are: 2, 4, 5
    df["Cycle(R/I)"] = df["Cycle(R/I)"].astype(int)

    # Binary columns already use:
    # Yes = 1
    # No  = 0
    binary_columns = [
        "Weight gain(Y/N)",
        "Pimples(Y/N)",
        "Hair loss(Y/N)",
        "hair growth(Y/N)",
        "Skin darkening (Y/N)",
        "Fast food (Y/N)",
        "Reg.Exercise(Y/N)",
    ]

    for col in binary_columns:
        df[col] = df[col].astype(int)

    X = df[FEATURE_COLUMNS]
    y = df[TARGET_COLUMN].astype(int)

    return X, y